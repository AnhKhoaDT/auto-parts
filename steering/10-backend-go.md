# 10 Backend (Go)

Applies to everything under `backend/`. Read `00-project-rules.md` first. Framework details change: check `go doc` and the library README before using an API you are unsure about.

## Layout

```
backend/
  cmd/api/main.go            wiring only: config, deps, routes, graceful shutdown
  cmd/worker/main.go         River workers and the outbox relay
  internal/platform/         config, db, redis, storage, logger, httpx, authz
  internal/modules/<name>/   handler.go service.go repository.go model.go events.go
  db/migrations/             goose SQL files
  db/queries/                sqlc SQL files
  api/openapi.yaml
  sqlc.yaml
```

- Modules: identity, catalog, team, venue, booking, payment, matchmaking, match, social, chat, notification, moderation.
- One Go package per module at first. Add sub-packages only when a cycle or size problem appears.
- Each `internal/platform` sub-package has a precise name (`httpx`, `config`, `authz`). Never `util`, `common`, `helpers`, `types`.
- `main.go` only wires things. No business logic there.
- Do not create empty folders or a `pkg/` folder "just in case".

## Naming and style

- Run `gofmt` and `goimports`. Package names are short, lowercase, no underscores.
- Do not repeat the package name: `booking.Service`, not `booking.BookingService`.
- No `Get` prefix on getters. Initialisms keep one case: `ID`, `URL`, `HTTP`.
- Receiver names are one or two letters. Do not mix pointer and value receivers on a type.
- Return early on errors. No `else` after `return`. Keep the happy path at the left margin.
- Error strings are lowercase with no trailing punctuation.
- Enums start at 1 so the zero value means "unset".

## Errors

Wrap with short context and `%w`. Handle each error once: return it or log it, never both.

```go
// Wrap so callers can still use errors.Is.
if err := s.repo.Insert(ctx, b); err != nil {
	return Booking{}, fmt.Errorf("insert booking: %w", err)
}
```

Don't write "failed to ...", don't ignore errors with `_`, don't `panic` for flow control.

Domain errors are sentinels in the module. The handler maps them to the API error shape from the design doc (`{"error":{"code","message","details"}}`).

```go
var ErrSlotTaken = errors.New("slot taken")

func writeErr(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, booking.ErrSlotTaken):
		httpx.Error(w, http.StatusConflict, "BOOKING_SLOT_TAKEN")
	default:
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL")
	}
}
```

Never return raw database errors or stack traces to the client.

## Context, state, concurrency

- `context.Context` is the first parameter on every call that reaches the DB, Redis, or another service. Never store it in a struct.
- Use `context.Background()` only in `main` or a worker root.
- Request-scoped values (user id, request id) go in context with unexported key types.
- No global mutable state, no `init()` for wiring. Pass dependencies through constructors.
- Every goroutine has an owner that waits for it or cancels it. No fire-and-forget.
- Use `crypto/rand` for tokens and keys, never `math/rand`.

## Interfaces

Define the interface in the package that uses it. Producers return concrete types.

```go
// payment depends only on what it needs from booking.
type bookingReader interface {
	Get(ctx context.Context, id uuid.UUID) (booking.Booking, error)
}
```

Do not add an interface "for mocking" without a second real use.

## Layers

- Handler: decode, validate shape, call the service, encode. No SQL, no rules.
- Service: business rules, authorization (role AND ownership), transactions, events.
- Repository: wraps sqlc `Queries`. No rules, no HTTP types.
- Another module is reached through a small interface or an event, never its tables.

Authorization is checked in the service every time, default deny.

```go
func (s *Service) Cancel(ctx context.Context, actor authz.Actor, id uuid.UUID) error {
	b, err := s.repo.Get(ctx, id)
	if err != nil {
		return fmt.Errorf("get booking: %w", err)
	}
	if !actor.CanCancel(b.UserID, b.VenueOwnerID) {
		return ErrForbidden
	}
	return s.repo.SetStatus(ctx, id, StatusCancelled)
}
```

## Database: pgx, sqlc, goose

- `pgxpool` for the app. Never share a single `pgx.Conn`.
- sqlc config uses `engine: postgresql` and `sql_package: "pgx/v5"`. Write real SQL in `db/queries/`. Generated code is never edited by hand.
- No ORM. No string-built SQL. Parameters only.
- Transactions start in the service via one helper in `internal/platform/db`. The repository accepts the `DBTX` or `Queries.WithTx(tx)`.

```go
func (s *Service) Confirm(ctx context.Context, id uuid.UUID) error {
	return s.tx.Run(ctx, func(q *db.Queries) error {
		if err := q.ConfirmBooking(ctx, id); err != nil {
			return fmt.Errorf("confirm booking: %w", err)
		}
		return q.InsertOutbox(ctx, outboxBookingConfirmed(id))
	})
}
```

- Migrations are goose `.sql` files with `-- +goose Up` and `-- +goose Down`. Forward-only in production: never edit a migration that has shipped, add a new one.
- Run migrations with a command or a deploy step, not on every app start.
- Ids are UUID v7. Money is `bigint` in đồng. Time is `timestamptz` (UTC). Venue location is `geography(Point,4326)` with a GiST index.
- Every list query is paginated. Use cursors for feed, chat, and notifications.

## Booking overlap: exclusion constraint

Never rely on a check-then-insert in code. The database must refuse overlaps.

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (court_id WITH =, time_range WITH &&)
  WHERE (status IN ('HOLD', 'CONFIRMED', 'CHECKED_IN'));
```

- Expired, cancelled, and finished bookings are outside the `WHERE`, so they free the slot.
- Availability queries also ignore `HOLD` rows with `hold_expires_at < now()`. Do not depend on the worker alone.
- Map SQLSTATE `23P01` to `ErrSlotTaken` (HTTP 409 `BOOKING_SLOT_TAKEN`).

```go
var pgErr *pgconn.PgError
if errors.As(err, &pgErr) && pgErr.Code == "23P01" {
	return ErrSlotTaken
}
```

- A 7-a-side court built from two 5-a-side courts needs lock rows on both child courts in the same transaction.

## Idempotency and outbox

- `POST /bookings` and payment creation require an `Idempotency-Key` header. Store key, request hash, and response; a repeat returns the stored response. Same key with a different body returns 422.
- Payment webhooks verify the signature before parsing and are idempotent by provider event id.
- Events (`booking.confirmed`, `match.finalized`) are written to an `outbox` table in the same transaction as the data. The worker publishes them. Handlers must tolerate duplicates.

## HTTP

- Router: chi only. Do not mix routers.
- Build `http.Server` explicitly with `ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout`, and a body size limit.
- Middleware order: request id, real IP, recoverer, logging, timeout, rate limit, auth.
- Shut down with `signal.NotifyContext` and `Server.Shutdown` under a deadline. Drain the worker too.
- Routes: `/api/v1`, owner API under `/api/v1/owner/*`, admin under `/api/v1/admin/*`. The prefix middleware checks role; the service checks ownership.
- Errors use one JSON shape. Messages shown to players are Vietnamese; `code` is the stable key the frontend translates.

## OpenAPI first

1. Edit `api/openapi.yaml`.
2. Run `oapi-codegen`, implement the generated server interface.
3. Run the TypeScript generator in `frontend/`.

Never add an endpoint in code without the spec. Never edit generated files.

## Logging and config

- `log/slog` with JSON output. Fields: `request_id`, `user_id`, `module`. Log once at the boundary.
- Never log tokens, OTP codes, card data, passwords, or full phone numbers.
- Config comes from env, parsed once into a struct in `internal/platform/config`, validated at startup. Fail fast when a required key is missing.

## Security checklist

- [ ] Input validated at the edge; unknown JSON fields rejected.
- [ ] Parameterized queries only (sqlc).
- [ ] Role AND ownership checked in the service; default deny.
- [ ] Access JWT short-lived (EdDSA). Refresh token random, stored hashed, rotated on use.
- [ ] Auth cookies `HttpOnly`, `Secure`, `SameSite=Lax`.
- [ ] Rate limits per IP and per user, stricter on OTP, login, and posting.
- [ ] Upload through presigned URLs; check type and size.
- [ ] Admin writes create an audit log row.
- [ ] `govulncheck ./...` clean; `gosec` via golangci-lint clean.
- [ ] No secret in code, logs, or test fixtures.

## Testing

- Table-driven tests. Failure messages show input, got, and want.
- Pure logic (pricing, ELO, slot generation) is tested with no database.
- Repositories and services run against real PostgreSQL via testcontainers-go; apply goose migrations in setup.

```go
func TestPrice(t *testing.T) {
	tests := []struct {
		name  string
		hours int
		want  int64
	}{
		{"one hour", 1, 180000},
		{"two hours", 2, 360000},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Price(tt.hours); got != tt.want {
				t.Errorf("Price(%d) = %d, want %d", tt.hours, got, tt.want)
			}
		})
	}
}
```

- Booking and payment need a concurrency test: N goroutines book one slot, exactly one succeeds.
- Run with `-race`. Add a fuzz test for parsers and validators.

## Commands

```
gofmt -l . && go vet ./... && golangci-lint run && go test -race ./... && govulncheck ./...
```

Lint config is `.golangci.yml` with `version: "2"`. Enable at least errcheck, govet, staticcheck, ineffassign, unused, errorlint, bodyclose, contextcheck, gosec, revive, misspell.
