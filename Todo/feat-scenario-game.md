# feat/scenario-game — Scenario Interactive Game System

## 目標

實作完整 Scenario 互動遊戲系統（UI + AI 整合），使用 Zustand 管理 client session 狀態。

## 路由

```
/scenario                                   → 情境列表
/scenario/[name]                            → 劇本介紹 + 難度選擇
/scenario/[name]/[difficulty]/[uuid]/init   → 選頭像、名字、場域、身份
/scenario/[name]/[difficulty]/[uuid]/intro  → RPG 前情提要
/scenario/[name]/[difficulty]/[uuid]/chat   → 遊戲主體（chatlist + chatroom + mission）
/scenario/[name]/[difficulty]/[uuid]/score/phase1
/scenario/[name]/[difficulty]/[uuid]/score/phase2
/scenario/[name]/[difficulty]/[uuid]/final  → 最終雷達圖
```

## Checklist

- [x] Create branch `feat/scenario-game`
- [x] Install packages (`@ai-sdk/google`, `@ai-sdk/openai`, `zustand`, `recharts`, `zod`)
- [x] `src/types/index.ts` — 共用型別
- [x] `src/data/scenarios.ts` — 劇本資料
- [x] `src/lib/llm/config.ts` — LLM provider 設定
- [x] `src/services/ScenarioService.ts` — 劇本與 prompt 服務
- [x] `src/services/ScoringService.ts` — 評分服務
- [x] `src/services/GameEngineService.ts` — Phase 2 引擎
- [x] `src/store/game-store.ts` — Zustand store（含 persist）
- [x] `src/app/api/chat/route.ts`
- [x] `src/app/api/game/check-mission/route.ts`
- [x] `src/app/api/game/check-send/route.ts`
- [x] `src/app/api/game/update-pad/route.ts`
- [x] `src/app/api/score/route.ts`
- [x] `src/components/game/chat-bubble.tsx`
- [x] `src/components/game/chat-input.tsx`
- [x] `src/components/game/chat-list.tsx`
- [x] `src/components/game/mission-panel.tsx`
- [x] `src/components/game/pad-indicator.tsx`
- [x] `src/components/game/score-card.tsx`
- [x] `src/components/game/radar-chart.tsx`
- [x] `src/app/scenario/page.tsx`
- [x] `src/app/scenario/[name]/page.tsx`
- [x] `src/app/scenario/[name]/[difficulty]/[uuid]/init/page.tsx`
- [x] `src/app/scenario/[name]/[difficulty]/[uuid]/intro/page.tsx`
- [x] `src/app/scenario/[name]/[difficulty]/[uuid]/chat/page.tsx`
- [x] `src/app/scenario/[name]/[difficulty]/[uuid]/score/phase1/page.tsx`
- [x] `src/app/scenario/[name]/[difficulty]/[uuid]/score/phase2/page.tsx`
- [x] `src/app/scenario/[name]/[difficulty]/[uuid]/final/page.tsx`
- [x] Update `README.md` and `.env.example`
- [x] `pnpm build` passes with no errors
