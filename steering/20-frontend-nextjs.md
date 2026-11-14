# 20 Frontend (Next.js)

Applies to everything under `frontend/`. Read `00-project-rules.md` and `30-ui-design.md` first. Next.js ships version-matched docs in `node_modules/next/dist/docs/`. Read them before using a framework API. This file holds project decisions only.

## Stack

Next.js App Router (16.x), React, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, React Hook Form + Zod, `openapi-typescript` + `openapi-fetch`, Vitest, Playwright, `lucide-react`.

- Pin exact or tilde versions. Check the registry first.
- Pin `typescript` to `~5.9` or `~6.0` until typescript-eslint supports 7.
- Node 20.9 or newer. Turbopack is the default bundler; do not add a custom webpack config.
- Lint with the ESLint CLI. `next lint` no longer exists.
- `params`, `searchParams`, `cookies()`, and `headers()` are async: always `await` them.

## Folder layout

```
frontend/
  proxy.ts or src/proxy.ts   route guard + admin subdomain rewrite
  src/
    app/
      (public)/   (auth)/   (app)/   owner/   admin/
      layout.tsx  not-found.tsx  global-error.tsx  globals.css
    features/<domain>/        components/ hooks/ queries.ts schemas.ts actions.ts types.ts index.ts
    components/ui/            shadcn primitives
    components/               AppShell, BottomNav, EmptyState
    lib/                      api/ (generated + client), env.ts, format.ts
```

- `app/` holds routes only. Files there stay thin: fetch, compose, render.
- Logic lives in `features/<domain>`. A feature imports another feature only through its `index.ts`.
- Domains: booking, team, matchmaking, match, chat, feed, venue, owner, admin.
- Shared components with no domain go in `components/`. Do not make a `utils.ts` dump.
- No barrel files except each feature's `index.ts`.

## Route areas and guarding

| Area | Who | Notes |
|---|---|---|
| `(public)` | anyone | SEO pages: venues, teams, rankings. Server rendered |
| `(auth)` | guests | login, register, reset password |
| `(app)` | signed-in players | feed, matches, bookings, teams, messages, me |
| `owner` | role `owner` | own layout, desktop-first |
| `admin` | role `admin` | own layout, reached via `admin.<domain>` |

Use `proxy.ts`. `middleware.ts` is the deprecated name; keep it only if you need the Edge runtime (we do not). Export exactly one function. Never set `runtime` in its config.

```ts
export function proxy(request: NextRequest) {
  const session = readSession(request);
  if (!session) return redirectToLogin(request);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

- Proxy only does optimistic redirects and the admin subdomain rewrite. It is not the security gate.
- Re-check role in the `owner` and `admin` layouts, and in every Server Function. The Go API checks again.
- Always set a matcher that skips static assets. A skipped path also skips its Server Functions, so auth lives inside them.

## Server and client components

- Pages and layouts are Server Components by default.
- Add `'use client'` only to small leaves that need state, effects, event handlers, or browser APIs.
- Client leaves: slot grid, chat, map, filters, geolocation. Server: venue pages, team pages, rankings.
- Server Components can be passed as `children` into client components. Use that to keep client trees small.
- Import `server-only` in modules that read secrets or call the API with cookies.
- Load heavy widgets (`maplibre-gl`, charts, calendar) with `next/dynamic` inside a client leaf.
- Start independent fetches together with `Promise.all`. Wrap slow parts in `<Suspense>` with a skeleton.
- Pass minimal DTOs from server to client, never whole API objects.

## Data and API

- The Go API is the source of truth. Do not duplicate business rules in Next.js.
- Generate types and client from `backend/api/openapi.yaml`. Never edit generated files.
- Server side: `lib/api/server.ts` (server-only) forwards the auth cookie to the Go API.
- Client side: TanStack Query for lists, polling, optimistic updates, and infinite lists.
- Keep filter, tab, sort, and page state in the URL so a link reproduces the screen.
- Query keys are built by one factory per feature.

```ts
export const bookingKeys = {
  all: ["bookings"] as const,
  list: (filters: BookingFilters) => [...bookingKeys.all, "list", filters] as const,
};
```

- API errors carry a stable `code`. Map the code to Vietnamese copy in one dictionary, never show raw server text.
- Server Actions are a thin layer for forms that must set cookies (login, logout, refresh). Each action validates with Zod and checks auth itself.
- After a mutation call `revalidatePath` or `revalidateTag` before `redirect()`, because `redirect` throws.

## Forms

- React Hook Form with the Zod resolver. Schema in `schemas.ts`, shared by form and action.
- Visible `<label>`, correct `type`, `autoComplete`, and `inputMode`. Never block paste.
- Show the error next to the field and focus the first invalid field on submit.
- Disable the submit button only while pending, and show a spinner plus the real action name.
- Destructive actions ask for confirmation or offer undo.

```ts
export const bookingSchema = z.object({
  courtId: z.uuid(),
  startsAt: z.iso.datetime(),
  durationMin: z.number().int().min(30).max(240),
});
```

## TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`. No `any`; use `unknown` and narrow.
- No non-null `!` without a one-line reason. No `@ts-ignore`.
- Derive types from Zod or the generated API types. Do not hand-write a second copy.
- Money is an integer number of đồng. Format only at render time.

## Env

- Validate env in `lib/env.ts` with Zod at startup. Import env only from there.
- Only `NEXT_PUBLIC_*` reaches the browser. Never put a secret in one.
- `.env*` files are not committed. Commit `.env.example` with key names only.

## Accessibility

- Buttons for actions, links for navigation. No `div onClick`.
- Icon-only buttons have `aria-label`. Images have `alt` (empty when decorative).
- Visible `focus-visible` ring everywhere. Never remove an outline without a replacement.
- Dialogs and sheets trap focus, close on Escape, and return focus to the trigger.
- Async updates (new chat message, booking status) use a polite live region.
- Honor `prefers-reduced-motion`. Do not disable zoom.
- Color is never the only signal. Contrast meets WCAG AA.
- Automated checks do not prove conformance. Tell the user manual testing with a screen reader is still needed.

## Performance budgets

- Public pages: LCP under 2.5 s on a mid-range phone over 4G, CLS under 0.1, INP under 200 ms.
- First-load JS per route under 200 kB gzip for `(public)` and `(app)`. Admin and owner code must not ship to players.
- Use `next/image` with explicit `sizes`. Use `next/font`. Lazy-load maps and below-the-fold media.
- No barrel imports from large libraries. Import the icon, not the pack.
- Enable the React Compiler only after the app builds, and confirm the config key in the bundled docs. Then skip hand-written `useMemo` and `useCallback` unless profiling asks.
- Cache with `'use cache'` and `cacheLife` only on public, non-personalized data. Never cache per-user data.

## i18n readiness

- Default locale `vi`. Put all user-facing strings in message files, ready for `next-intl`, even if only Vietnamese exists today.
- Use `Intl.NumberFormat("vi-VN")` and `Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })`.
- Money prints as `180.000đ`, dates as `T5, 19/11`, time in 24h.
- Allow 40% longer text in layouts. Give flex children `min-w-0` so text truncates.

## Testing

- Vitest + Testing Library for hooks, schemas, formatters, and components with logic.
- Playwright for core flows: sign in, find a venue, hold a slot, pay, post a match request, send a chat message. Run at 360 and 1280 px.
- Mock the API with the generated types so mocks cannot drift from the spec.
- Test names state behavior: `shows the taken-slot message when the API returns BOOKING_SLOT_TAKEN`.

```ts
it("formats đồng without decimals", () => {
  expect(formatVnd(180000)).toBe("180.000đ");
});
```

## Commands

```
npx tsc --noEmit && npx eslint . && npx vitest run && npx next build
```

Run Playwright when you changed a user flow. Report any command you could not run.
