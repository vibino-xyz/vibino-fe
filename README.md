# Vibino — Frontend

Multi-page marketing + product UI for **Vibino**, an AI knowledge base that indexes a
company's codebases, chats and meetings so anyone can ask it anything.

Pure frontend. No backend, no API calls — every screen runs on mock data.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

## Routes

| Route               | Screen                                                          |
| ------------------- | --------------------------------------------------------------- |
| `/`                 | Landing page                                                     |
| `/auth`             | Multi-step auth on one page: email → 6-digit OTP → profile        |
| `/onboarding`       | Org setup: create (→ invite teammates) or join                    |
| `/dashboard`        | Dashboard, empty state                                            |
| `/dashboard/active` | Dashboard, active state — sources / indexing / activity           |

The screens link together in that order, so clicking through from the landing page
walks the whole flow. "Connect GitHub" on the empty dashboard leads to the active one.

## Design system

Tokens live in [`src/app/globals.css`](src/app/globals.css) under Tailwind v4's
`@theme`, which is what generates the `bg-canvas` / `text-fg-subtle` / `rounded-card`
utilities used throughout.

| Token                   | Value     | Used for                        |
| ----------------------- | --------- | ------------------------------- |
| `canvas`                | `#09090B` | Page background                 |
| `surface`               | `#111113` | Cards                           |
| `elevated`              | `#151517` | Hover / nested fills            |
| `hairline`              | `#1C1C1F` | Borders                         |
| `fg`                    | `#FAFAFA` | Primary text                    |
| `fg-subtle`             | `#71717A` | Secondary text                  |
| `accent`                | `#7C3AED` | CTAs and key highlights only    |
| `success` `warning` `danger` | `#22C55E` `#F59E0B` `#EF4444` | Status |

Radii: `rounded-card` 8px, `rounded-badge` 6px, `rounded-pill` 24px.

### No monospace, anywhere

Inter is the only typeface. Two guards keep it that way:

- `--font-mono` is aliased to the Inter stack, so even an accidental `font-mono`
  resolves to Inter.
- `kbd`, `code`, `pre` and `samp` are reset in the base layer — those four are
  monospace by browser default and are the one way a terminal look creeps back in.

Numeric columns use the `nums` utility (`font-variant-numeric: tabular-nums`) to line
up without reaching for a monospace face.

## Notes

- The active dashboard runs a live indexing simulation
  ([`src/lib/use-indexing.ts`](src/lib/use-indexing.ts)): the progress bar advances,
  the ETA counts down, and repositories move Queued → Syncing → Indexed. Every status,
  file count and total is derived from one progress number, so the panels can't
  disagree with each other.
- All icons are hand-rolled stroke SVGs on a shared 24px/1.5-weight grid
  ([`src/components/icons.tsx`](src/components/icons.tsx)) — no icon dependency.
- Mock content lives in [`src/lib/mock-data.ts`](src/lib/mock-data.ts).
