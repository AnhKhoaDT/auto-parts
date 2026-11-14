# 30 UI design (anti "AI-looking website")

Applies to every visible change in `frontend/`. Read `20-frontend-nextjs.md` too. The goal: a screen that could only belong to a Vietnamese sports booking product, not a template.

## Before you build any screen

1. Write the token plan (below) once, in `globals.css` and `docs/design-system.md`. Every page reads from it.
2. Look at the real data: Vietnamese venue names, wards, prices like `180.000đ`, distances in km, scores. Design with that data, not lorem ipsum.
3. Pick the one memorable element for the page. Everything else stays quiet.
4. Check the plan against the banned list. Replace anything that is the generic answer.

Swapping one default for a trendier one does not fix it. Each choice must trace back to courts, pitches, timetables, scoreboards, or price boards.

## Banned patterns

- Purple, indigo, or violet-to-blue gradients. Gradient headline text (`bg-clip-text`). Glows and neon.
- Inter or Geist as the only font, with no display face. Fonts without a Vietnamese subset (Sora, DM Sans, Figtree, Rubik, Gabarito, Instrument Sans, Schibsted Grotesk).
- Unmodified shadcn: zinc/slate cards, default ring, default `rounded-lg`, uniform `p-6`.
- Centered hero with a pill badge, giant H1, subtext, two buttons, then three identical icon cards.
- Emoji as UI icons. Mixed icon sets.
- Every surface `rounded-2xl` with the same soft grey shadow. Cards inside cards.
- Fade-up on every section. Hover lift on every card. Bounce easing. `transition: all`.
- Cream background + serif display + terracotta or sage accent, unless the owner chose it and it is recorded in `docs/design-system.md`.
- Near-black page with one acid accent used as decoration.
- Chrome without meaning: ALL-CAPS eyebrow above every heading, `A · B · C` meta strings, `01 / 02 / 03` on non-sequences, `→` on every link, monospace for small labels, one word in a different color in every headline.
- Stock avatars, fake logos, fake testimonials, fake numbers like "10,000+ players" before they exist.
- Marketing copy: "Elevate", "Seamless", "Unlock", "Tất cả trong một nền tảng".

## Design tokens

Define in `src/app/globals.css`. Use OKLCH. Wipe the default palette so only project colors exist.

```css
@import "tailwindcss";

@theme {
  --color-*: initial;
  --color-pitch-50: oklch(0.97 0.02 150);
  --color-pitch-500: oklch(0.58 0.13 152);
  --color-pitch-700: oklch(0.42 0.09 155);
  --color-pitch-900: oklch(0.27 0.05 158);
  --color-line: oklch(0.9 0.01 150);
  --color-ink: oklch(0.22 0.02 160);
  --color-paper: oklch(0.985 0.004 120);
  --color-danger: oklch(0.55 0.2 27);
  --color-warn: oklch(0.75 0.15 75);
  --color-ok: oklch(0.55 0.13 150);
}
```

Color roles (semantic names map to the palette; components use roles, not raw colors):

| Role | Light | Dark |
|---|---|---|
| `--background` | `oklch(0.985 0.004 120)` | `oklch(0.2 0.015 160)` |
| `--surface` | `oklch(1 0 0)` | `oklch(0.25 0.018 160)` |
| `--foreground` | `oklch(0.22 0.02 160)` | `oklch(0.95 0.008 130)` |
| `--muted-foreground` | `oklch(0.5 0.02 160)` | `oklch(0.72 0.02 150)` |
| `--border` | `oklch(0.9 0.01 150)` | `oklch(0.34 0.02 160)` |
| `--primary` | `oklch(0.42 0.09 155)` | `oklch(0.72 0.14 152)` |
| `--primary-foreground` | `oklch(0.985 0.004 120)` | `oklch(0.2 0.015 160)` |
| `--ring` | `oklch(0.58 0.13 152)` | `oklch(0.72 0.14 152)` |

Per-sport accents. Use only on sport chips, map pins, venue tile edges, and slot headers. Never on large surfaces. Check text contrast on each (AA for body text).

```css
:root {
  --sport-football: oklch(0.62 0.17 145);
  --sport-badminton: oklch(0.82 0.16 95);
  --sport-pickleball: oklch(0.7 0.17 55);
  --sport-tennis: oklch(0.65 0.11 185);
  --sport-swimming: oklch(0.58 0.14 240);
}
```

Type scale (display face for headings, scores, prices; body face for the rest):

| Token | Size / line height | Face and weight |
|---|---|---|
| `--text-display` | 40px / 1.05 | display 700 |
| `--text-h1` | 30px / 1.1 | display 700 |
| `--text-h2` | 24px / 1.15 | display 600 |
| `--text-h3` | 18px / 1.3 | body 600 |
| `--text-body` | 16px / 1.55 | body 400 |
| `--text-small` | 14px / 1.45 | body 400 |
| `--text-caption` | 12px / 1.4 | body 500 |

Keep body line length under 75 characters. Use `tabular-nums` on prices, times, scores, and table columns.

Spacing: 4px base. Steps 4, 8, 12, 16, 24, 32, 48, 72. Tight inside components (8 to 12), looser between sections (32 to 72). Do not use one gap everywhere.

Radius by role, not one value:

```css
@theme {
  --radius-slot: 6px;
  --radius-field: 8px;
  --radius-sheet: 16px;
  --radius-chip: 999px;
}
```

Elevation: shadows only on floating layers (menus, sheets, the sticky booking bar). Content is separated by 1px borders or a tone shift.

```css
@theme {
  --shadow-float: 0 8px 24px oklch(0.22 0.02 160 / 0.14);
}
```

## Typography

Pair a scoreboard-style display face with a Vietnamese-designed body face. Both ship a Vietnamese subset (verified on Google Fonts).

```tsx
import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";

export const display = Barlow_Condensed({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
```

```css
@theme inline {
  --font-display: var(--font-display);
  --font-sans: var(--font-body);
}
```

- Apply both variables on `<html>`. Use `font-display` for headings, scores, prices, and slot times. Everything else uses `font-sans`.
- Test with `Đặt sân bóng Tân Bình ế ộ ữ ở` at 20 to 24px. Stacked tone marks on condensed capitals can collide; if they do, use sentence case or raise line height.
- Owner and admin tables may use Be Vietnam Pro only.
- JetBrains Mono (Vietnamese verified) is allowed for booking codes only.
- Vietnamese UI copy is sentence case. No ALL CAPS styling.

## Layout principles

Booking is a comparison task. Show price, time, and distance together. Prefer dense lists, tables, and timetable grids over big marketing cards.

- Venue list: row with photo, name, ward, distance, price from, open slots count, sport chip. Filters in a bottom sheet on mobile, a side column on desktop. Filter state lives in the URL. A list/map toggle.
- Venue detail: horizontal day strip, then slot grid. Mobile shows one court at a time with a court switcher, or chips grouped into sáng, chiều, tối. Desktop shows time on one axis and courts on the other.
- Slot cell looks like a timetable cell: time in the display face, price under it, state by fill and border (free, taken, held by you, selected). Color is never the only signal; taken cells also carry a strike line and a label.
- Sticky bottom bar on mobile: selected slot, total, one primary button "Giữ chỗ". After hold, show a visible countdown.
- Matchmaking: a request card states sport, level, time window, area, and team strength in plain fields. Offers are a list with accept and decline. Venue suggestions show distance for each team.
- Chat: list and thread side by side on tablet and desktop, stacked on phone. Composer pinned to the bottom with safe-area padding. Optimistic send with a "đang gửi" then sent state, and retry on failure. Newest at the bottom; do not jump the scroll when older messages load.
- Owner and admin: desktop-first tables and calendars (TanStack Table), still usable on tablet.
- One-line pitch markings (1.5px lines) may appear only as dividers inside venue detail. Do not scatter field graphics.

## Empty, loading, and error states

Every list has all three. Use real Vietnamese copy that names the next action.

| State | Copy |
|---|---|
| No venues in filter | "Không có sân trống lúc 19:00 ở Quận 7." + button "Xem khung giờ khác" |
| No matches yet | "Đội bạn chưa có trận nào. Đăng kèo để tìm đối thủ cùng trình." + button "Đăng kèo" |
| No messages | "Chưa có tin nhắn. Mở một kèo để nhắn cho đội đối thủ." |
| Slot just taken | "Khung 19:00 vừa có người đặt. Chọn giờ khác hoặc sân khác." |
| Network error | "Không tải được danh sách sân. Kiểm tra mạng rồi thử lại." + button "Thử lại" |
| Hold expired | "Hết thời gian giữ chỗ. Chọn lại khung giờ để tiếp tục." |
| Payment failed | "Thanh toán chưa thành công, bạn chưa bị trừ tiền. Thử lại hoặc đổi cách thanh toán." |

- Loading: skeletons that match the final layout. Spinner only inside a pending button.
- Errors appear next to the thing that failed. Say what happened and how to fix it. No "Đã có lỗi xảy ra" alone.

## Iconography

- One set: `lucide-react`, stroke width 1.75, sizes 16, 20, 24.
- Never emoji as UI icons. Import icons one by one.
- Icon-only buttons need `aria-label`. Pair an icon with text when the meaning is not obvious.
- Sport icons come from one consistent custom or lucide set, same stroke as the rest.

## Motion

- Motion answers an action: open sheet, select slot, confirm booking, send message. Duration 150 to 220 ms, ease-out.
- Animate only `transform` and `opacity`. Never `transition: all`.
- At most one orchestrated entrance per page. No scattered fade-ups, no parallax.
- Wrap non-essential motion in `motion-safe:` and respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## Mobile first

- Design at 360px first, then 768, then 1280.
- Bottom tab bar with 5 items: Trang chủ, Tìm kèo, Đặt sân, Tin nhắn, Tôi. Floating "+" for new match request, post, team.
- Touch targets at least 44x44px, with 8px between neighbors.
- Filters, pickers, and confirmations use bottom sheets (`--radius-sheet`, drag handle, `overscroll-behavior: contain`).
- Safe-area insets on bars: `padding-bottom: env(safe-area-inset-bottom)`.
- Inputs use the right `inputMode` and `autoComplete`; font size 16px minimum to stop iOS zoom.
- Tablet: collapsed icon sidebar, list and detail side by side. Desktop: header + left sidebar, three-column feed.

## Dark mode

- Same semantic tokens, overridden under `.dark`. Do not invert by filter.
- Dark surfaces are green-tinted neutrals (see table), not pure black. Lift elevation with lighter surface, not shadow.
- Re-check sport accent contrast on dark surfaces. Raise lightness if text fails AA.
- Respect system preference by default, with a user toggle stored in a cookie to avoid a flash.

## Content tone

- Vietnamese, plain, specific. Use the player's words: "Đặt sân", "Tìm kèo", "Tìm đối", "Giữ chỗ".
- A button says exactly what happens. The same action keeps the same name in the button, toast, and email.
- Format: `180.000đ`, `T5, 19/11`, `19:00`, `2,4 km`. Use `Intl`, never hand-built strings.
- No exclamation marks in errors. No em dashes. No sales language.

## Pre-merge UI checklist

- [ ] Uses tokens only; no raw hex, no stock zinc or slate.
- [ ] Display and body fonts load with the Vietnamese subset; diacritics render cleanly.
- [ ] Checked at 360, 768, and 1280 px with real screenshots.
- [ ] Empty, loading, and error states exist and use real copy.
- [ ] All targets at least 44px on mobile; focus ring visible on every control.
- [ ] Text contrast meets AA in light and dark.
- [ ] Works with keyboard only; icon buttons have names.
- [ ] Reduced motion respected; only `transform` and `opacity` animate.
- [ ] No banned pattern from the list above.
- [ ] Long names, 0 results, and 500 results do not break the layout.

## How to review a screen for AI-slop

1. Silhouette test: shrink the page to gray blocks. Could it be any other product? If yes, the layout is generic.
2. Cover the logo and text. Would the colors and type still say "sports booking in Vietnam"?
3. Count decorations: gradients, glows, badges, eyebrows, arrows, numbered labels. Remove one by one; keep only those that carry information.
4. Look for sameness: identical cards in a row, identical radius, identical shadow, identical spacing.
5. Read the copy aloud. If a sentence fits any app, rewrite it with a real venue, time, or price.
6. Check the data: realistic Vietnamese names, long names, big numbers, missing photos.
7. Take screenshots and look. A green build says nothing about layout.
