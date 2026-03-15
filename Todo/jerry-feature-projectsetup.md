---
branch: jerry-feature-projectsetup
date: 2026-03-15
status: in-progress
---

# Task: Project Setup & Architecture

## Goal
Bootstrap the Next.js 14 project with the full SOA folder structure, dependencies, and config so every subsequent feature task starts from a clean, consistent foundation.

## Scope
- **Included**: Next.js init, TypeScript, Tailwind, shadcn/ui, Zustand, Anthropic SDK, ESLint/Prettier, folder scaffolding, `.env.example`, base layout with Noto Sans TC font
- **NOT included**: Any page content, Claude API calls, or game logic

## Sub-tasks
- [x] Next.js 16 + React 19 + TypeScript + Tailwind v4 + App Router bootstrapped
- [x] `ky`, `swr`, `ai`, `@ai-sdk/react`, `clsx`, `tailwind-merge`, `cva`, `lucide-react` installed
- [x] shadcn/ui configured (`neutral` base, RSC mode, `lucide` icons)
- [x] `src/lib/utils.ts` — `cn()` helper
- [x] `src/lib/fetch.ts` — `ky` fetcher for swr
- [ ] Create missing folder scaffold: `src/services/`, `src/data/`, `src/types/`
- [ ] Create stub service files: `ScenarioService.ts`, `ScoringService.ts`, `PolishService.ts`
- [ ] Create `src/types/index.ts` — shared interfaces (`Scenario`, `Message`, `ScoreResult`, etc.)
- [ ] Create `app/api/chat/route.ts` — streaming route handler stub using Vercel AI SDK
- [ ] Add `Noto Sans TC` via `next/font/google` in root layout (alongside Geist)
- [ ] Update layout `lang` to `zh-TW`
- [ ] Create `.env.example` with `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_APP_URL`
- [ ] Add ESLint config aligned with CLAUDE.md rules
- [ ] Configure Jest + Playwright (`--chrome`)
- [ ] Verify `pnpm dev` runs without error
- [ ] Verify `pnpm build` passes with no type errors

## Acceptance Criteria
- [ ] `pnpm dev` starts cleanly
- [ ] `pnpm build` passes with no type errors
- [ ] `pnpm test` runs (no tests yet, but runner works)
- [ ] Playwright config targets Chrome
- [ ] Folder structure matches `CLAUDE.md` spec exactly

## Notes
- Package manager is **pnpm** — never use `npm` or `yarn`
- AI calls go through `app/api/` route handlers using `streamText` from `ai`; never call AI SDK in client components directly
- shadcn base color is `neutral` (already set in `components.json`)
- Geist font is already wired in `layout.tsx`; add Noto Sans TC alongside it
