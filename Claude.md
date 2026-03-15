# Project Overview

**teach-chat** — A teacher-parent communication simulator for new teachers in Taiwan.
Architecture: Service-Oriented Architecture (SOA)

---

# Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript 5, React 19)
- **Package manager**: pnpm
- **Styling**: Tailwind CSS v4 + shadcn/ui (`neutral` base, `lucide-react` icons)
- **Font**: Geist Sans + Geist Mono (via `geist` package)
- **AI**: Vercel AI SDK (`ai` v6 + `@ai-sdk/react`) — use `useChat` / `streamText` patterns
- **HTTP**: `ky` for fetch wrapper (`src/lib/fetch.ts`); `swr` for client-side data fetching
- **Utilities**: `clsx` + `tailwind-merge` via `cn()` helper (`src/lib/utils.ts`); `class-variance-authority` for component variants
- **Testing**: not configured yet — add Jest + Playwright (`--chrome`) in the setup task
- **Deployment**: Vercel

---

# Folder Structure

Current state: `src/app/`, `src/components/ui/`, `src/hooks/`, `src/lib/` exist. Still to add: `services/`, `data/`, `types/`.

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # home, about, technique, blog, how-to-use
│   ├── api/                # Route handlers (AI stream endpoints)
│   └── scenario/
│       └── [name]/
│           └── [uuid]/     # intro, chatlist, chat, phase*/sectionclose, final
├── services/               # SOA service layer (pure functions / classes)
│   ├── ScenarioService.ts  # scenario data & parent persona prompts
│   ├── ScoringService.ts   # rubric evaluation (T01–T14)
│   └── PolishService.ts    # message rewriting via AI SDK
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui primitives (added via `pnpm dlx shadcn add`)
│   └── game/               # scenario-specific components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── utils.ts            # cn() helper (clsx + tailwind-merge)
│   └── fetch.ts            # ky-based fetcher for swr
├── data/                   # Static scenario TS data files
└── types/                  # Shared TypeScript interfaces
```

---

# Style Guidelines

- **Color palette**: Warm tones — amber, rose, warm-gray (shadcn `neutral` base). Avoid cold blues/greens.
- **Typography**: Geist Sans is the primary font (already configured in layout). Add `Noto Sans TC` via `next/font/google` for Chinese body text.
- **CSS**: Tailwind v4 uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`). CSS variables are defined in `globals.css` using `oklch()`.
- **Component variants**: Use `class-variance-authority` (cva) for multi-variant components.
- **Mobile-first**: Design for 375px viewport first; desktop is enhancement.
- **Tone**: Empathetic, encouraging — never clinical or alarming.
- **UI language**: Chinese (Traditional, zh-TW); set `lang="zh-TW"` on `<html>`.

---

# Service Design Rules (SOA)

- Each service lives in `src/services/` and is responsible for one domain.
- Services must NOT import from `app/` or `components/`.
- AI calls use the Vercel AI SDK (`ai` + `@ai-sdk/react`). Streaming responses go through `app/api/` route handlers; services build the prompts and config, routes call `streamText`.
- Client components use `useChat` (from `@ai-sdk/react`) pointing at those route handlers.
- Data fetching in client components: use `swr` with the `fetcher` from `src/lib/fetch.ts`.
- Services should be independently testable (pure inputs/outputs where possible).

---

# Task Creation Rule

- For each new task, add an item to `README.md` task checklist.
- After finishing a task, put a checkmark `[x]` on the item.

---

# Task Pipeline

1. **Branch** — format: `name-intention-tasktitle` (e.g. `jerry-feature-mainpage`). Checkout to that branch.
2. **Doc** — create a task doc in `Todo/` named `<branch-name>.md`.
3. **Plan** — describe exactly what to do in the task doc before writing any code.
4. **Generate** — follow the plan to implement.
5. **Test** — verify:
   - All unit/service tests pass
   - Frontend renders correctly (`playwright --chrome`)
   - Style aligns with the style guidelines above
   - Code is clean and not over-abstracted
6. **Commit** — commit with a proper message for each sub-task.
7. **PR** — open a pull request to merge changes back to `main`.

---

# Environment Variables

```
# .env.local (never commit)
ANTHROPIC_API_KEY=          # Claude API key — used by Vercel AI SDK on the server
NEXT_PUBLIC_APP_URL=        # e.g. https://teach-chat.vercel.app
```

- Install packages with `pnpm add` / `pnpm add -D`.
- Add shadcn components with `pnpm dlx shadcn add <component>`.
- Never commit `.env.local`. Add all new vars to `.env.example` when introducing them.

---

# Omit / Avoid

- Do not generate lorem ipsum — all copy must come from `text.md` or be confirmed with the team.
- Do not store game session state on the server — use client-side Zustand only.
- Do not hard-code Chinese strings outside of `data/` or `text.md` source — keep copy centralized.