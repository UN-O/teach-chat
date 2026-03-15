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
- [ ] `npx create-next-app@latest` with TypeScript + Tailwind + App Router + src/ dir
- [ ] Install dependencies: `zustand`, `@anthropic-ai/sdk`, `shadcn/ui`, `clsx`, `tailwind-merge`
- [ ] Configure `shadcn/ui` (init, warm neutral base color)
- [ ] Create folder scaffold: `src/services/`, `src/lib/`, `src/data/`, `src/types/`, `src/components/game/`
- [ ] Create `src/lib/claudeClient.ts` — singleton Anthropic client
- [ ] Create stub service files: `ScenarioService.ts`, `ScoringService.ts`, `PolishService.ts`
- [ ] Create `src/types/index.ts` — shared interfaces (`Scenario`, `Message`, `ScoreResult`, etc.)
- [ ] Add `Noto Sans TC` via `next/font/google` in root layout
- [ ] Create `.env.example` with `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_APP_URL`
- [ ] Add `CLAUDE.md`-aligned ESLint rules (no unused vars, explicit return types on services)
- [ ] Verify `next dev` runs without error
- [ ] Verify `jest` and `playwright --chrome` configs are wired

## Acceptance Criteria
- [ ] `npm run dev` starts cleanly
- [ ] `npm run build` passes with no type errors
- [ ] `npm test` runs (no tests yet, but runner works)
- [ ] Playwright config targets Chrome
- [ ] Folder structure matches `CLAUDE.md` spec exactly

## Notes
- shadcn/ui base color: `stone` (warm neutral) — avoid `slate` or `zinc`
- Zustand store should live at `src/store/` (one store per domain: `useGameStore`, `useSessionStore`)
- `claudeClient.ts` must read `ANTHROPIC_API_KEY` from `process.env` and throw a clear error if missing
