# 老師怎麼辦...? [親師溝通篇]

> 專為新手老師打造的「親師溝通情境模擬器」，讓你在安全的防護網裡，免費練就從容應對的底氣。

---

## Tech Stack

- **Framework**: Next.js 16 + React 19 (App Router, TypeScript 5)
- **Package manager**: pnpm
- **Styling**: Tailwind CSS v4 + shadcn/ui (`neutral` base) + `lucide-react`
- **Font**: Chiron GoRound TC + Noto Sans TC + DM Sans
- **AI**: Vercel AI SDK (`ai` v6 + `@ai-sdk/react`) with Claude as provider
- **HTTP / Data**: `ky` (fetch wrapper) + `swr` (client-side data fetching)
- **Testing**: Jest + Playwright (`--chrome`) — to be configured

---

## Task Checklist

### Foundation
- [ ] Project setup — Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [ ] Folder structure & SOA service layer scaffolding
- [ ] Environment variable setup (Claude API key, etc.)
- [x] Development server uses HTTPS in local dev
- [x] Typography refactor — align global font tokens with next/font
- [ ] SEO & Open Graph meta configuration
- [ ] Global style system (warm color palette, Chinese typography)
- [ ] CI/CD pipeline setup

### Pages
- [ ] `/home` — Hero, Hook, Introduction sections
- [ ] `/technique` — New Teacher Handbook (communication tips)
- [x] `/about` — About the team & future plans
- [ ] `/how-to-use` — Step-by-step usage guide
- [ ] `/blog` — Teacher Ghost Stories (community posts)
- [ ] `/polishtext` — AI message polish tool

### Scenario System
- [ ] `/scenario` — Scenario list (card grid)
- [ ] `/scenario/[name]` — Scenario detail + difficulty selector
- [ ] `/scenario/[name]/[uuid]/intro` — RPG intro screen
- [ ] `/scenario/[name]/[uuid]/chatlist` — Chat inbox list
- [ ] `/scenario/[name]/[uuid]/chat` — Interactive chat interface
- [ ] `/scenario/[name]/[uuid]/phase1/sectionclose` — Phase 1 scoring
- [ ] `/scenario/[name]/[uuid]/phase2/sectionclose` — Phase 2 scoring
- [ ] `/scenario/[name]/[uuid]/final` — Final results & skill radar chart

### AI Services
- [ ] `ScenarioService` — generate parent persona & dynamic responses
- [ ] `ScoringService` — evaluate teacher replies against rubric (PAD model)
- [ ] `PolishService` — rewrite teacher messages (remove blame, add empathy)

### Content & Data
- [ ] Scenario data: `studentfeud` (student conflict) — easy & hard difficulty
- [ ] Scenario data: `disorder` (student abnormal behavior)
- [ ] Scoring rubric definitions (T01–T14 skills)

---

## Route Map

```
/
├── home
├── technique
├── about
├── how-to-use
├── blog
├── polishtext
└── scenario
    ├── [name]               # difficulty selector
    └── [name]/[uuid]
        ├── intro
        ├── chatlist
        ├── chat
        ├── phase1/sectionclose
        ├── phase2/sectionclose
        └── final
```
