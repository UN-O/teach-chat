---
branch: claude/setup-interface-content-9llBp
date: 2026-03-15
status: in-progress
---

# Task: Setup Interface & Content (Non-scenario pages)

## Goal
Build out all marketing/static pages with correct copy, layout, and design tokens — ready for the scenario game layer to be layered on top.

## Scope
- **Included**: Home page sections, About page, typography component, color/shadow token cleanup
- **NOT included**: Scenario game flow, AI integration, scoring

## Sub-tasks
- [x] `HeroSection` — layout, copy, responsive mobile/desktop split
- [x] `HookSection` — scenario + polish feature blocks
- [x] `IntroSection` — feature card grid (scenario & polish)
- [x] `OriginSection` — team origin story
- [x] `ContactSection` — CTA section
- [x] `/about` page — team, future plans, recruit sections
- [x] `typography.tsx` — Eyebrow, H1–H3, P, UL/OL/LI, Blockquote, Code components
- [x] Simplify color/shadow tokens — replace `text-[var(--color-NAME)]` 等 with `text-primary`, `bg-background`, `shadow-soft`, etc. across all components

## Acceptance Criteria
- [ ] `pnpm dev` runs without error
- [ ] All marketing pages render correctly on mobile (375px) and desktop
- [ ] No hardcoded `var(--color-NAME)` or shadow RGBA values in components
