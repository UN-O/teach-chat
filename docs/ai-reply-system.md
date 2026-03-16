# AI 回覆系統說明文件

> 文件更新：2026-03-16

---

## 架構總覽

所有 AI 呼叫都透過 Next.js API Route Handler 進行，服務層（`src/services/`）負責組合 prompt，Route 呼叫 Vercel AI SDK（`generateText` + `Output.object()`），前端透過 `fetch` 呼叫 Route。

```
前端 (chat/page.tsx)
  ↓ fetch
API Route Handler (src/app/api/)
  ↓ call
Service Function (src/services/)
  ↓ generateText / Output.object()
LLM Provider (Gemini / OpenAI via src/lib/llm/config.ts)
```

---

## LLM 設定

**檔案**：`src/lib/llm/config.ts`

| 函式 | 用途 | 模型 |
|------|------|------|
| `getDialogueLLMModel()` | 對話、情緒、記憶相關呼叫 | `gemini-3-flash-preview` / `gpt-5-mini` |
| `getTaskLLMModel()` | 任務判斷（checkMission） | 同上 |

**Provider 優先順序**：`GOOGLE_GENERATIVE_AI_API_KEY` > `OPENAI_API_KEY`
**Google 特殊設定**：`thinkingBudget: 0`（關閉思考模式，加速回應）
**禁用參數**：不使用 `temperature`、不使用 `generateObject`（已棄用）

---

## API Routes 一覽

### `/api/game/check-send` — 家長自主傳訊判斷

**觸發時機**：
1. Phase 2 首次進入家長聊天室（初始觸發）
2. 每 20 秒週期性檢查（若家長在線）
3. 使用者傳訊後等待 `tDelay` 毫秒後觸發

**Request**：
```ts
{
  scenarioName, difficulty, parentId, phase,
  messages: Message[],
  padState: PADState,
  memory: ParentMemory,
}
```
**Response**：`{ shouldSend: boolean, bubbles: string[] }`
**流程**：呼叫 `checkSend()` 判斷是否發送 → 若是則呼叫 `generateMessage()` 產生 1–4 則訊息泡泡

---

### `/api/game/check-mission` — 任務完成判斷

**觸發時機**：使用者傳訊後 2 秒（debounce），背景執行
**Request**：`{ scenarioName, difficulty, parentId, phase, messages, currentMissions }`
**Response**：`{ missions: MissionItem[] }`
**Guard**：若無使用者訊息，直接回傳現有任務（不呼叫 LLM）

---

### `/api/game/update-pad` — 情緒狀態 + 記憶更新

**觸發時機**：使用者傳訊後，在 `checkSend` 完成後背景非阻塞執行
**Request**：`{ scenarioName, difficulty, parentId, currentPAD, currentMemory, messages }`
**Response**：`{ pad: PADState, memory: ParentMemory }`
**執行**：`updatePAD()` + `updateMemories()` 同時呼叫（`/api/game/update-pad` 內部）
**Guard**：`messages.length < 2` 時直接回傳現有狀態

---

### `/api/game/tip` — 即時指導提示

**觸發時機**：使用者點擊「取得回覆建議」按鈕（按需觸發）
**Response**：`{ direction: string }`（20–40 字的一行提示）

---

### `/api/teacher/chat` — 同事協調對話

**觸發時機**：使用者傳訊給李老師（fight-advanced 限定）
**Response**：`{ bubbles: string[] }`

---

### `/api/expert/greeting` — 顧問初始問候

**觸發時機**：頁面掛載時觸發一次（非只在切換到顧問頁籤時）
**Response**：`{ content: string }`（60–120 字）
**Guard**：`expertGreetTriggeredRef`、`session.expert.hasGreeted`，確保只觸發一次

---

### `/api/expert/chat` — 顧問問答回覆

**觸發時機**：使用者傳訊給資深老師
**特殊**：使用 `Output.object()` 結構化輸出，包含 `relatedTechniqueIds`
**Context**：包含所有家長聊天記錄 + 同事聊天記錄（全域 context）

---

### `/api/score` — 階段評分

**觸發時機**：進入 score 頁時呼叫
**Response**：`{ scores: ScoreResult[] }`（T01–T18 技巧評分）

---

## Service 函式一覽

**檔案**：`src/services/GameEngineService.ts`

| 函式 | Action | 用途 | LLM |
|------|--------|------|-----|
| `generateMessage()` | A1 | 產生家長回覆泡泡（1–4 則） | Dialogue |
| `checkSend()` | A2 | 判斷家長是否自主傳訊 | Dialogue |
| `checkMission()` | A3 | 判斷任務是否完成 | Task |
| `updateMemories()` | A4 | 更新家長記憶摘要 | Dialogue |
| `updatePAD()` | A5 | 更新 PAD 情緒狀態 | Dialogue |
| `calculateTDelay()` | — | 計算回覆延遲 ms | 無 LLM |

**檔案**：`src/services/ScoringService.ts`

| 函式 | Action | 用途 |
|------|--------|------|
| `scorePhase()` | A6 | Phase 評分（T01–T18） |

---

## Phase 2 自主觸發完整流程

### 觸發點 1：初始觸發（進入聊天室）

```
useEffect deps: [currentPhase, session, activeChatId, ...]

1. 條件檢查：
   - currentPhase === 2
   - isViewingParent
   - 任務未完成
   - phase2AutoTriggerRef.current[pid] === false  ← ref guard

2. 同步設定 phase2AutoTriggerRef.current[pid] = true

3. 非同步執行 runAutoTrigger():
   - setParentOnline(pid)
   - POST /api/game/check-send
   - 若有 bubbles → addPendingSeq(pid, bubbles)
   - 若失敗 → addMessage(pid, fallbackTriggerMsg)
```

### 觸發點 2：週期性檢查（每 20 秒）

```
useEffect deps: [currentPhase, isViewingParent, activeChatId, session, ...]

條件：
  - currentPhase === 2
  - parent.isOnline === true
  - 任務未完成

每 20 秒執行 runCheckSend():
  - 機率過濾：Math.random() > (arousal + 5) / 10 → 跳過
  - POST /api/game/check-send
  - 若 shouldSend && bubbles.length > 0 → addPendingSeq()

注意：session 是 dep，每當 session 更新，interval 就會清除並重建（計時器重置）
```

### 觸發點 3：使用者傳訊後（被動回應）

```
handleSendToParent(content):
  1. addMessage(pid, userMsg)          ← 同步，更新 session
  2. setTimeout(checkMission, 2000ms)  ← 背景任務檢查
  3. if (phase === 2 && parent.isOnline):
     a. tDelay = calculateTDelay(arousal)  ← 500–3000ms
     b. await wait(tDelay)
     c. POST /api/game/check-send
     d. if bubbles → addPendingSeq()
     e. void (async) → POST /api/game/update-pad  ← 非阻塞
```

### 泡泡顯示流程（pendingSeq 佇列）

```
useEffect deps: [session?.parents[pid].pendingSeq, ...]

pendingSeq 有內容 → 800ms 後:
  flushNextBubble(pid) → addMessage(pid, bubble)
  → session 更新 → effect 再次觸發
  → 逐一彈出，每則間隔 800ms
```

---

## 情緒機制（PAD Model）

| 維度 | 範圍 | 影響 |
|------|------|------|
| Pleasure（愉悅） | -5 ~ +5 | 合作意願 |
| Arousal（激動） | -5 ~ +5 | 回覆速度：`tDelay = max(500, 3000 - arousal * 250)` |
| Dominance（主導） | -5 ~ +5 | 對話主導感 |

PAD 更新在每次使用者傳訊後背景非阻塞執行，不影響當前 checkSend 流程。

---

## ⚠️ 雙重觸發風險分析

### 初始觸發（觸發點 1）— **已防護，安全**

`phase2AutoTriggerRef.current[pid] = true` 在非同步函式啟動前同步設定。即使 `setParentOnline()` 更新 Zustand store 導致 effect 重新執行，ref guard 已為 `true`，直接 early return。

### 被動回應（觸發點 3）— **已防護，安全**

`isSubmittingRef` + `SEND_GUARD_MS (400ms)` + `DUPLICATE_CONTENT_GUARD_MS (1500ms)` 防止使用者重複送出。

### ❌ 週期性檢查 × 被動回應競態（觸發點 2 × 觸發點 3）— **存在真實風險**

**問題場景**：

```
T = 0s    ── interval 觸發 runCheckSend() → 開始 API 呼叫（~2s）
T = 0.5s  ── 使用者傳訊 → addMessage() → session 更新
              → interval effect 重新執行 → 舊 interval 清除、新 interval 建立
              → 但 T=0s 那次的 fetch 仍在進行中！
T = 1s    ── handleSendToParent 等待 tDelay 後發送 check-send 請求
T = 2s    ── runCheckSend (T=0) 回傳 bubbles → addPendingSeq(bubbles_1)
T = 2.5s  ── handleSendToParent check-send 回傳 bubbles → addPendingSeq(bubbles_2)
```

**結果**：家長對同一則使用者訊息連續傳送兩組回覆。

**觸發條件**：
1. 週期性 interval 已啟動
2. 使用者恰好在 interval API 呼叫進行中（~2s 視窗）傳訊
3. 兩次 checkSend 都判斷應回覆

**修復方式**：加入 `isCheckSendInFlightRef` 防護同時只有一個 check-send 呼叫執行。

```ts
// 在 page.tsx 頂部加入
const isCheckSendInFlightRef = useRef(false)

// 每次呼叫 check-send 前先檢查
if (isCheckSendInFlightRef.current) return
isCheckSendInFlightRef.current = true
try {
  const res = await fetch('/api/game/check-send', ...)
  // ...
} finally {
  isCheckSendInFlightRef.current = false
}
```

---

## 其他保護機制

| 機制 | 說明 |
|------|------|
| `phase2AutoTriggerRef` | 每個家長的初始觸發只執行一次 |
| `isCheckingMission` | 防止 checkMission 並發 |
| `isSubmittingRef` | 防止使用者重複送出 |
| `SEND_GUARD_MS = 400ms` | 送出間隔保護 |
| `DUPLICATE_CONTENT_GUARD_MS = 1500ms` | 相同內容短時間內不重複送出 |
| `teacherGreetTriggeredRef` | 同事問候只觸發一次 |
| `expertGreetTriggeredRef` | 顧問問候只觸發一次 |
| `session.expert.hasGreeted` | 持久化問候狀態（跨重新整理） |
