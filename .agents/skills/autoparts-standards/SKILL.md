---
name: autoparts-standards
description: Core project rules, Clean Architecture design patterns, human-grade UI guidelines to avoid AI aesthetics, comment constraints, internationalization (i18n), application security standards, and explanation requirements for the AutoParts platform.
---

# AutoParts Engineering & Design Standards

> **Notice**: This skill mirrors the project's root `AGENTS.md` and `steering/` rules. It applies to all AI agents working on this repository across all IDEs.

---

## 1. Comment & Code Rules (User Explicit Constraints)
- **Language**: ALL code comments MUST be written in **English only**.
- **Line Constraint**: NEVER write comments exceeding **two (2) lines** per block or function. Comments must be ultra-concise and explain "why", not obvious "what".
- **Self-Documenting Code**: Choose expressive, clean domain names over long explanatory comments.
- **Post-Action Explanation**: After writing or modifying any code, ALWAYS provide a clear explanation in Vietnamese containing:
  1. What each new or changed file does.
  2. The actual newly written or modified code snippets quoted in code blocks.
  3. Verification results (commands run and actual outputs).

---

## 2. Application Security Standards (Security by Design)
All code across frontend (`web`, `admin`) and backend (`backend`) must adhere strictly to OWASP Top 10 guidelines and security best practices:
- **Authentication & Authorization**:
  - Secure JWT management: Store tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies (never in plain `localStorage` or `sessionStorage` vulnerable to XSS).
  - Enforce strict server-side RBAC (Role-Based Access Control) verification on every sensitive API route, usecase, and mutation. Never trust client-side permission flags alone.
- **Injection Prevention**:
  - Zero SQL Injection: ALWAYS use parameterized queries or safe ORM mappings (sqlc / GORM prepared statements). Never concatenate raw input strings into SQL commands.
  - Zero NoSQL / Command Injection: Sanitize and validate all system commands and external inputs.
- **XSS & Content Security**:
  - Avoid `dangerouslySetInnerHTML` in React / Next.js unless input is sanitized through DOMPurify.
  - Configure defensive HTTP security headers: Content-Security-Policy (CSP), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), and HSTS.
- **Data Protection & Rate Limiting**:
  - Protect public and auth endpoints (Login, OTP, VIN lookup, Reset Password) with rate limiting (Redis Token Bucket / IP Rate Limiter).
  - Hash all passwords using `bcrypt` (cost >= 12) or `Argon2id`.

---

## 3. Internationalization (i18n) & Zero Hardcoded Strings Rule
- **STRICT PROHIBITION**: NEVER hardcode display strings, labels, placeholders, titles, error messages, or button text directly into UI components or templates.
- **Dedicated Localization Dictionaries**:
  - All customer-facing and admin text MUST be extracted into standardized localization dictionaries/translation keys (`src/locales/vi.json`, `src/locales/en.json`).
  - Use modular namespaces organized by feature: `common`, `auth`, `catalog`, `garage`, `order`, `admin`, `errors`.
- **Backend Error Localization**: Golang API returns structured error codes and machine-readable message keys (`ERR_VEHICLE_NOT_FOUND`, `ERR_OUT_OF_STOCK`), mapped by the client.

---

## 4. Anti-AI Aesthetics UI Design Rules (Human-Grade Frontend)
To avoid the generic, soulless "AI-generated aesthetic" (AI slop), strictly follow these principles:
- **NO Default AI Color Crutches**: Never default to purple/indigo glowing gradients (`bg-indigo-600` / violet-pink gradients). Use automotive-industrial, high-contrast palettes (slate, deep navy, racing red/amber accents, clean warm whites).
- **NO Monotonous 3-Card Grids**: Avoid identical rows of rounded cards with soft blurry shadows and generic decorative corner icons. Use asymmetric Bento grids, varied spans, and functional editorial layouts.
- **NO Meaningless Decoration**: Eliminate generic floating blur blobs or useless icon badges. If an icon or UI element does not aid comprehension or action, remove it.
- **Typography & Whitespace**: Pair strong, high-contrast headings with crisp, readable sans-serif fonts supporting complete Vietnamese diacritics. Rely on intentional whitespace and subtle structural divider lines.
- **Mobile Thumb-Zone First**: All customer and garage interfaces must support fluid one-handed mobile usage with sticky bottom actions and thumb-accessible navigation. Touch targets >= 44x44px.

---

## 5. Architecture & Design Patterns

### Backend (Golang)
- **Layout**:
  - `cmd/api/main.go`: config, deps wiring, graceful shutdown.
  - `internal/modules/<name>/`: `handler.go`, `service.go`, `repository.go`, `model.go`, `events.go`.
  - `internal/platform/`: `config`, `db`, `redis`, `storage`, `httpx`, `authz`. Never use generic names like `util`, `common`, `helpers`.
- **Layering & Inward Dependencies**:
  - `handler` (HTTP, decode, validation) -> `service` (business logic, transactions, authorization) -> `repository` (SQL execution).
  - Explicit error handling with `%w`. Standard error JSON response: `{"error":{"code","message","details"}}`.

### Frontend Web & Admin (Next.js 14/15)
- App Router & Server Components by default. Add `'use client'` only to interactive leaf nodes.
- Container / Presentational Component Pattern & Custom Hooks.
- Feature-driven directory structure: `features/<domain>`.
- Format numbers/currency using `Intl.NumberFormat("vi-VN")` without decimals (`180.000đ`). Never floating points.
