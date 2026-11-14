# Project Rules & Agent Instructions (Universal IDE & AI Agents)

> **Universal Compatibility**: This file is read by all AI agents, IDE assistants, and tools (Antigravity, Cursor, Claude Code, GitHub Copilot, Windsurf, Kiro, Codex) across any editor.

---

## 00. Project Rules (Owner's Mandatory Rules)

These are the owner's personal rules. They override style advice from any other source. Skill/code files are English. Reports and explanations to the user are Vietnamese.

### A. Code Comments
- **Max 2 lines per comment block**. English only.
- Prefer a self-explanatory name over a comment.
- Comment the **why**, never the **what**.
- No long docblocks, no banner comments, no section dividers, no commented-out code, no TODO without a ticket.
- Go doc comments on exported names are allowed: one or two lines, starting with the name.

### B. Clean, Maintainable Architecture
- **Layering**: handler (HTTP, input validation) -> service (business rules, authorization, transactions) -> repository (SQL).
- **Frontend Layering**: route file (compose) -> feature component -> hook/query -> API client.
- **Dependencies point inward**: Domain and service code never import HTTP, SQL driver, or UI types.
- **Single Responsibility**: One responsibility per function and file. Aim for functions under 40 lines.
- **Zero Business Logic in Handlers or React Components**: Pricing, overlap checks, permissions, and state transitions live strictly in services.
- **Module Boundaries**: A module never reads or writes another module's tables. Call its service interface or publish an event.
- **Explicit Errors**: Return them, wrap with context (`%w`), map them to API error codes at the edge. No silent catch, no `_ =` on errors.
- **Configuration & Secrets**: Config comes from environment variables (`.env`), validated at startup. Secrets are never in code, tests, fixtures, or docs.

### C. Internationalization (i18n) & Zero Hardcoded Strings
- **Strict Prohibition**: NEVER hardcode display strings, labels, placeholders, titles, error messages, or button text directly into UI components or templates.
- **Dedicated Localization Dictionaries**:
  - All customer-facing and admin text MUST be extracted into standardized localization dictionaries/translation keys (`src/locales/vi.json`, `src/locales/en.json`).
  - Use modular namespaces organized by feature: `common`, `auth`, `catalog`, `garage`, `order`, `admin`, `errors`.
- **Backend Error Localization**: Golang API returns structured error codes and machine-readable message keys (`ERR_VEHICLE_NOT_FOUND`, `ERR_OUT_OF_STOCK`), mapped by the frontend.

### D. Application Security Standards (Security by Design)
- **Zero Trust Authentication**:
  - Secure JWT management: Store tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies (never in plain `localStorage` or `sessionStorage` vulnerable to XSS).
  - Enforce strict server-side RBAC verification on every sensitive API route, usecase, and mutation. Never trust client-side permission flags alone.
- **Injection Prevention**:
  - Zero SQL Injection: ALWAYS use parameterized queries or safe ORM mappings (sqlc / GORM prepared statements). Never concatenate raw input strings into SQL commands.
- **XSS & Content Security**:
  - Avoid `dangerouslySetInnerHTML` in React / Next.js unless input is sanitized through DOMPurify.
  - Configure defensive HTTP security headers: Content-Security-Policy (CSP), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), and HSTS.
- **Data Protection & Rate Limiting**:
  - Protect public and auth endpoints (Login, OTP, VIN lookup, Reset Password) with rate limiting (Redis Token Bucket / IP Rate Limiter).
  - Hash all passwords using `bcrypt` (cost >= 12) or `Argon2id`.

### E. Explain Every Change Back to the User (Vietnamese)
After finishing ANY change, even a one-line fix, send an explanation in Vietnamese containing:
1. What each new or changed file does.
2. The actual new code lines or snippets, quoted in code blocks, each with a short reason.
3. What was verified (command and result) and what was not verified.

Template:
````markdown
## Tóm tắt
Một đến hai câu: đã làm gì và vì sao.

## Các file đã thay đổi
- `path/to/file` (mới/sửa): tóm tắt chức năng.

## Giải thích code
### `path/to/file`
```code
// code mới viết, trích nguyên văn
```
Giải thích: dòng này làm gì, vì sao viết như vậy.

## Đã kiểm tra
- Lệnh chạy và kết quả thực tế.

## Chưa kiểm tra
- Ghi rõ nội dung chưa kiểm tra (hoặc "Không có").
````

### F. Anti-AI Aesthetics UI Design Rules
- **Banned Patterns**:
  - NO purple, indigo, or violet-to-blue gradients (`bg-indigo-600` / neon glows).
  - NO centered hero with pill badge, giant H1, two buttons, and 3 identical rounded icon cards.
  - NO monotonous card grids or cards-inside-cards. Use asymmetric Bento grids and editorial layouts.
  - NO meaningless decoration: eliminate floating blur blobs or useless icon badges.
  - NO stock avatars, fake logos, or marketing fluff ("Elevate", "Seamless", "Tất cả trong một").
- **Typography & Formatting**:
  - Pair high-contrast headings with clean, readable sans-serif fonts supporting complete Vietnamese diacritics.
  - Currency: format with `Intl.NumberFormat("vi-VN")` without decimals (`180.000đ`). Never floating numbers.
  - Mobile thumb-zone first: touch targets at least 44x44px with bottom actions and sticky headers.

---

## 10. Backend Architecture (Go)
Applies to everything under `backend/`.
- **Layout**:
  - `cmd/api/main.go`: config, deps wiring, graceful shutdown.
  - `internal/modules/<name>/`: `handler.go`, `service.go`, `repository.go`, `model.go`, `events.go`.
  - `internal/platform/`: `config`, `db`, `redis`, `storage`, `httpx`, `authz`. Never use `util`, `common`, `helpers`.
- **Database**:
  - `pgxpool` with parameterized queries (sqlc). No ORM string concatenation.
  - IDs are UUID v7 generated by backend. Money is `bigint` minor units (đồng). Time is `timestamptz` (UTC).
  - Migrations are goose SQL files (`-- +goose Up` / `-- +goose Down`).
- **Error Handling**:
  - Wrap with short context and `%w`. Handle each error once: return it or log it, never both.
  - Standard JSON response shape: `{"error":{"code","message","details"}}`.

---

## 20. Frontend Architecture (Next.js 14/15)
Applies to everything under `web/` and `admin/`.
- **Stack**: Next.js App Router, React, TypeScript, Tailwind CSS, Lucide Icons, TanStack Query, Zod.
- **Components**:
  - Server Components by default. Add `'use client'` only to small interactive leaves.
  - Logic lives in `features/<domain>`.
- **Routing & i18n**:
  - All user-facing strings loaded from localized dictionaries (`src/locales/vi.json`, `en.json`).
  - Strict TypeScript (`strict: true`, no `any`, no non-null `!` without reason).

---

## E. Quick Self-Check Before Answering
- [ ] Did I read the project rules and steering guidelines?
- [ ] Is every comment at most 2 lines and in English?
- [ ] Are all UI strings loaded from dictionary files (NO hardcoded strings)?
- [ ] Is security adhered to (zero SQL injection, secure auth, RBAC)?
- [ ] Did I avoid generic AI aesthetic tropes (no purple gradients, no 3-card grids)?
- [ ] Did I run the checks and record real results?
- [ ] Is the Vietnamese explanation complete, with real quoted code?

