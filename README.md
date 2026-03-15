# 老師怎麼辦...? [親師溝通篇]

> 專為新手老師打造的「親師溝通情境模擬器」，讓你在安全的防護網裡，免費練就從容應對的底氣。

---

## Tech Stack

- **Framework**: Next.js 16 + React 19 (App Router, TypeScript 5)
- **Package manager**: pnpm
- **Styling**: Tailwind CSS v4 + shadcn/ui (`neutral` base) + `lucide-react`
- **Font**: Chiron GoRound TC + Noto Sans TC + DM Sans
- **AI**: Vercel AI SDK v6 (`ai`, `@ai-sdk/google`, `@ai-sdk/openai`) — Gemini preferred
- **State**: Zustand v5 with localStorage persistence
- **HTTP / Data**: `ky` (fetch wrapper) + `swr` (client-side data fetching)
- **Testing**: Jest + Playwright (`--chrome`) — to be configured

---

## Task Checklist

### Foundation
- [ ] Project setup — Next.js 16 + TypeScript + Tailwind + shadcn/ui
- [ ] Folder structure & SOA service layer scaffolding
- [ ] Environment variable setup (Gemini / OpenAI API keys)
- [x] Development server uses HTTPS in local dev
- [x] Typography refactor — align global font tokens with next/font
- [ ] SEO & Open Graph meta configuration
- [ ] Global style system (warm color palette, Chinese typography)
- [ ] CI/CD pipeline setup

### Pages
- [ ] `/home` — Hero, Hook, Introduction sections
- [x] `/technique` — New Teacher Handbook (communication tips)
- [x] `/technique` + `/docs/techniques/[id]` — Shared 4:3 SVG cover image integration
- [x] `/docs/techniques/[id]` — Technique article detail routes from markdown docs
- [x] `/about` — About the team & future plans
- [ ] `/how-to-use` — Step-by-step usage guide
- [ ] `/blog` — Teacher Ghost Stories (community posts)
- [ ] `/polish` — AI message polish tool

### Scenario System
- [x] `/scenario` — Scenario list (card grid)
- [x] `/scenario/[name]` — Scenario detail + difficulty selector
- [x] `/scenario/[name]/[difficulty]/[uuid]/init` — Avatar & player profile selection
- [x] `/scenario/[name]/[difficulty]/[uuid]/intro` — RPG-style story intro
- [x] `/scenario/[name]/[difficulty]/[uuid]/chat` — Interactive chat (chatlist + chatroom + mission panel)
- [x] `/scenario/[name]/[difficulty]/[uuid]/score/phase1` — Phase 1 scoring & radar chart
- [x] `/scenario/[name]/[difficulty]/[uuid]/score/phase2` — Phase 2 scoring & radar chart
- [x] `/scenario/[name]/[difficulty]/[uuid]/final` — Final results, total radar chart & recommendations
- [x] Services: `ScenarioService`, `ScoringService`, `GameEngineService` (6 LLM Actions)
- [x] Zustand store with localStorage persistence
- [x] API routes: `/api/chat`, `/api/game/check-mission`, `/api/game/check-send`, `/api/game/update-pad`, `/api/score`
- [x] Scenario data: `fight` (student conflict) — basic & advanced
- [x] Scenario data: `abnormal` (student abnormal behavior) — basic & advanced

### AI Services
- [x] `ScenarioService` — system prompt builder, mission labels, initial trigger messages
- [x] `ScoringService` — evaluate teacher replies against rubric (T01–T17)
- [x] `GameEngineService` — 6 LLM actions (generateMessage, checkSend, checkMission, updateMemories, updatePAD, generateScore), t_delay calc
- [ ] `PolishService` — rewrite teacher messages (remove blame, add empathy)

---

## Route Map

```
/
├── home
├── technique
├── docs/techniques/[id]
├── about
├── how-to-use
├── blog
├── polish
└── scenario
    ├── [name]                          # difficulty selector
    └── [name]/[difficulty]/[uuid]
        ├── init                        # avatar & player profile
        ├── intro                       # RPG story intro
        ├── chat                        # Phase 1 & 2 interactive chat
        ├── score/phase1                # Phase 1 scoring
        ├── score/phase2                # Phase 2 scoring
        └── final                       # final results
```
