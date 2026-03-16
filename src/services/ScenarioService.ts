import { getScenarioConfig } from '@/data/scenarios'
import type {
  ScenarioName,
  Difficulty,
  ParentId,
  Phase,
  PADState,
  Message,
  ParentMemory,
  ScenarioConfig,
  ExpertMessage,
} from '@/types'

export function getScenarioData(name: ScenarioName, difficulty: Difficulty): ScenarioConfig {
  return getScenarioConfig(name, difficulty)
}

function describePAD(pad: PADState): string {
  const P =
    pad.pleasure >= 2 ? '情緒愉悅' :
    pad.pleasure >= 0 ? '情緒平穩' :
    pad.pleasure >= -2 ? '情緒偏低、有些不滿' :
    '情緒很差、明顯不悅'

  const A =
    pad.arousal >= 3 ? '極度激動、語氣急迫' :
    pad.arousal >= 1 ? '有些緊張、情緒上升' :
    pad.arousal >= -1 ? '平靜' :
    '很平靜、較冷漠'

  const D =
    pad.dominance >= 2 ? '強勢主導、習慣控制對話' :
    pad.dominance >= 0 ? '略有主導傾向' :
    pad.dominance >= -2 ? '較順從、配合對方' :
    '完全順從、很被動'

  return `- Pleasure（愉悅度）：${pad.pleasure}（${P}）
- Arousal（激動度）：${pad.arousal}（${A}）
- Dominance（主控感）：${pad.dominance}（${D}）

P 低 → 語氣更冷漠或不配合；A 高 → 訊息更短促、語氣更急；D 高 → 語氣更強勢主導`
}

function formatMessages(messages: Message[]): string {
  if (messages.length === 0) return '（尚無對話記錄）'
  return messages
    .map(m => `${m.role === 'user' ? '老師' : '我'}：${m.content}`)
    .join('\n')
}

export function buildSystemPrompt(
  scenario: ScenarioConfig,
  parentId: ParentId,
  padState: PADState,
  memory: ParentMemory,
  phase: Phase,
  messages: Message[],
): string {
  const persona = scenario.parents[parentId]
  const phaseConfig = phase === 1 ? scenario.phase1 : scenario.phase2
  const phaseGoal = phase === 1 ? phaseConfig.description : phaseConfig.description

  return `# 角色設定卡 — ${persona.name}

## 基本資料
${persona.name}，${persona.age} 歲。
${persona.occupation}。

## 個性
${persona.personality}

## 說話風格
${persona.speechStyle}
口頭禪：${persona.catchphrases.join('、')}
絕對不說：${persona.forbiddenWords.join('、')}

## 心理底層
核心動機：${persona.coreMotivation}
敏感點：${persona.traumas.join('；')}

---

# 情緒狀態（PAD）
${describePAD(padState)}

# 對老師的印象與記憶
${memory.teacherImpression || '還沒有特別的印象。'}

對事件的理解：${memory.events || persona.initialKnowledge}

---

# 當前場景
劇本：${scenario.title}
本幕目標（你的任務）：${phaseGoal}
當前階段：Phase ${phase}

---

# 對話記錄
${formatMessages(messages)}

---

# 你的工作
你正在扮演 ${persona.name}，透過 LINE 與班導師溝通關於孩子的事情。

## LINE 訊息設計規則
1. **分則傳送**：可以分成 1–3 則短訊息，模擬角色分次打字的節奏
2. **每則要短**：每則訊息通常 10–${Math.max(10, 30 - Math.round(padState.dominance * 2))} 字，就像真實 LINE 泡泡
3. **根據 PAD 調整**：Arousal 高 → 訊息更短促；Dominance 高 → 語氣更強勢；Pleasure 低 → 語氣更冷漠
4. **嚴守角色**：口頭禪要自然出現，禁用詞絕對不能出現
5. **繁體中文**：不要括號動作描述，不要旁白說明
6. **不重複**：不重複對話記錄中已說過的內容
7. **回覆目標限定**：直接回應老師最新的訊息

請以 JSON 格式輸出訊息陣列，例如：
{"bubbles": ["訊息一", "訊息二"]}

每個泡泡是一則 LINE 訊息。`
}

export function getInitialTriggerMessage(
  scenario: ScenarioConfig,
  parentId: ParentId,
): string {
  const questionBank = scenario.phase2.questionBank[parentId]
  const startQuestion = questionBank.find(q => q.trigger === 'start')
  return startQuestion?.question ?? questionBank[0]?.question ?? '老師，請問發生了什麼事？'
}

export function getMissionLabels(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
): Array<{ id: string; label: string }> {
  const missions = phase === 1
    ? scenario.phase1.missions[parentId]
    : scenario.phase2.missions[parentId]
  return missions.map(m => ({ id: m.id, label: m.label }))
}

export function buildCheckMissionPrompt(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
  messages: Message[],
): string {
  const phaseData = phase === 1 ? scenario.phase1 : scenario.phase2
  const missions = phaseData.missions[parentId]
  const conversation = formatMessages(messages)

  return `以下是老師與家長 ${scenario.parents[parentId].name} 的對話記錄：

${conversation}

---

請根據以下過關條件，判斷每一條是否已達成。
只要老師的訊息中有足夠的相關資訊即視為達成，不需要家長確認。

過關條件：
${missions.map((m, i) => `${i + 1}. [${m.id}] ${m.label}：${m.description}`).join('\n')}

請以 JSON 格式回答，例如：
{"results": [{"id": "A1", "completed": true}, {"id": "A2", "completed": false}]}`
}

export function buildCheckSendPrompt(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
  messages: Message[],
): string {
  const persona = scenario.parents[parentId]
  const conversation = formatMessages(messages)
  const questionBank = scenario.phase2.questionBank[parentId]
  const askedIds = new Set(messages.filter(m => m.role === 'assistant').map(m => m.content.substring(0, 20)))

  const remainingQuestions = questionBank.filter(
    q => !Array.from(askedIds).some(asked => q.question.startsWith(asked.substring(0, 10)))
  )

  return `你是 ${persona.name}，正在透過 LINE 與老師溝通（Phase ${phase}）。

對話記錄：
${conversation}

---

你還想問的問題：
${remainingQuestions.map(q => `- ${q.question}`).join('\n')}

根據你的角色設定和目前對話狀況，判斷你現在是否需要主動發訊息給老師。
如果老師的問題都已回應，且你還有未詢問的問題，通常應該主動發訊。
如果對話剛結束或老師正在等你回應，則不需要。

請以 JSON 格式回答：{"shouldSend": true, "suggestedMessage": "你會說的話"}`
}

export function buildUpdatePADPrompt(
  scenario: ScenarioConfig,
  parentId: ParentId,
  currentPAD: PADState,
  messages: Message[],
): string {
  const persona = scenario.parents[parentId]
  const recentMessages = messages.slice(-4)
  const conversation = formatMessages(recentMessages)

  return `你是一位情緒分析師。請根據最近的對話，評估家長 ${persona.name} 的情緒變化。

家長個性：${persona.personality}

目前 PAD 值：P=${currentPAD.pleasure}, A=${currentPAD.arousal}, D=${currentPAD.dominance}

最近對話：
${conversation}

PAD 變化規則：
- 老師成功降溫 → Arousal 下降 1–2
- 老師定責或承諾超出範圍 → Arousal 上升 2，Dominance 上升 1
- 老師語氣溫暖具體 → Pleasure 上升 1
- 老師回應模糊迴避 → Dominance 上升 1
- 老師表達同理 → Pleasure 上升 1，Arousal 下降 1

請以 JSON 格式回答 delta（正負整數，通常 -2 到 +2 之間）：
{"pleasureDelta": 0, "arousalDelta": -1, "dominanceDelta": 0}`
}

// ──────────────────────────────────────────────────────────────
// Teacher (colleague) prompt
// ──────────────────────────────────────────────────────────────

export function buildTeacherSystemPrompt(
  scenario: ScenarioConfig,
  messages: Message[],
): string {
  const teacher = scenario.teacher!
  const p = teacher.persona
  const conversation = formatMessages(messages)

  return `# 角色設定 — ${p.name}（${p.role}）

你是 ${p.name}，${p.age} 歲，${p.role}，正在透過 LINE 與甲班導師陳老師溝通今天的衝突事件。

## 個性
${p.personality}

## 說話風格
${p.speechStyle}
口頭禪：${p.catchphrases.join('、')}

## 情境背景與協調重點
${p.coordinationContext}

---

## 對話記錄
${conversation}

---

## 你的工作
你正在跟陳老師用 LINE 溝通。語氣是同事、同僚，不是家長對老師那種張力。
- 訊息短，像真實同事的 LINE：每則 10–25 字
- 可以分 1–2 則
- 偶爾流露出有點緊張、不確定的語氣
- 你有一個「衝動」：想先通知自己班（黃志明），需要陳老師協調才會調整
- 繁體中文，不要括號動作

請以 JSON 格式輸出訊息陣列：{"bubbles": ["訊息一", "訊息二"]}`
}

// ──────────────────────────────────────────────────────────────
// Expert (mentor) prompt
// ──────────────────────────────────────────────────────────────

interface AllChatsContext {
  parentsMessages: Record<ParentId, Message[]>
  teacherMessages?: Message[]
}

const TECHNIQUES_CATALOG = `T01 首訊破冰與開場設計 / T02 事實與擔憂分層陳述 / T03 訊息節奏與分段控制 / T04 情緒語氣的文字轉換 / T05 讀取後不回應的處理 / T06 升溫情況的降溫技術 / T07 適當收尾與後續約定 / T08 保留紀錄的意識 / T09 媒介判斷：何時不該用 LINE / T10 雙方家長分開通知的順序設計 / T11 事實陳述不帶定罪語氣 / T12 傷情通報的精確用語 / T13 憤怒家長的即時文字降溫 / T14 不在 LINE 上做責任判定 / T15 後續處置措施的主動說明 / T16 引導從 LINE 轉為面談 / T17 受傷方家長的安撫語氣 / T18 截圖風險意識與用字自審`

export function buildExpertGreetingPrompt(scenario: ScenarioConfig): string {
  return `你是「照顧我的資深教師」，一位擁有豐富教學與親師溝通經驗的資深老師，正在陪伴一位新手老師面對一個真實的親師溝通挑戰。

現在這位新手老師正要面對的情境是：
${scenario.storyLine}

請用溫暖、真誠的語氣打招呼。
- 先同理老師辛苦了（針對這個具體情境）
- 說明你是誰、可以幫什麼忙
- 邀請老師有問題都可以問你
- 長度：60–120 字，不要太長
- 繁體中文，口語化但專業
- 不要說「我是AI」或類似字眼
- 直接輸出訊息文字，不要任何 JSON 或標籤`
}

export function buildExpertResponsePrompt(
  scenario: ScenarioConfig,
  expertMessages: ExpertMessage[],
  allChats: AllChatsContext,
  userMessage: string,
): string {
  const parentChatContext = Object.entries(allChats.parentsMessages)
    .map(([pid, msgs]) => {
      const name = scenario.parents[pid as ParentId].name
      const last5 = msgs.slice(-5)
      return `【與 ${name} 的對話（最近 ${last5.length} 則）】\n${formatMessages(last5)}`
    })
    .join('\n\n')

  const teacherContext = allChats.teacherMessages && allChats.teacherMessages.length > 0
    ? `\n\n【與李老師的對話（最近 ${Math.min(allChats.teacherMessages.length, 4)} 則）】\n${formatMessages(allChats.teacherMessages.slice(-4))}`
    : ''

  const expertHistory = expertMessages.slice(-6)
  const expertConvo = expertHistory.length > 0
    ? expertHistory.map(m => `${m.role === 'user' ? '新手老師' : '我'}：${m.content}`).join('\n')
    : '（這是第一次提問）'

  return `你是「照顧我的資深教師」，資歷 20 年，專精於親師溝通。你正在陪伴一位新手老師進行情境練習。

## 目前情境
${scenario.title}：${scenario.summary}

## 相關溝通技巧目錄
${TECHNIQUES_CATALOG}

## 目前的對話室內容（所有聊天室最新狀態）
${parentChatContext}${teacherContext}

## 你與新手老師的對話記錄
${expertConvo}

---

## 老師的問題
${userMessage}

---

## 你的回應指引
- 以溫暖、同理又專業的資深老師語氣回答
- 回應長度：500–1000 字，詳細且有深度
- 善用段落分隔，條列式說明步驟時使用數字清單
- 可以具體引用上方的對話室內容來舉例說明
- 在回應中適時提到相關的技巧（例如：「這正是 T13 憤怒降溫所說的…」）
- 繁體中文
- 不要說「我是AI」

除了回應內容，你還需要判斷本次回應中提到了哪些技巧 ID（從 T01–T18 中選，通常 1–3 個）。

請以 JSON 格式輸出：
{"content": "完整的回應文字", "relatedTechniqueIds": ["T01", "T13"]}`
}

// ──────────────────────────────────────────────────────────────
// Chat tip prompt
// ──────────────────────────────────────────────────────────────

export function buildTipPrompt(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
  messages: Message[],
  padState: PADState,
): string {
  const persona = scenario.parents[parentId]
  const phaseConfig = phase === 1 ? scenario.phase1 : scenario.phase2
  const conversation = messages.length > 0
    ? messages.slice(-4).map(m => `${m.role === 'user' ? '老師' : '家長'}：${m.content}`).join('\n')
    : '（尚未開始對話）'

  const techniques = phaseConfig.techniques.map(t => `${t.id} ${t.name}`).join('、')

  return `你是一位親師溝通訓練教練，正在指導一位新手老師與家長 ${persona.name} 溝通。

## 情境
${scenario.title}，Phase ${phase}：${phaseConfig.description}

## 相關技巧
${techniques}

## 家長狀態
PAD：P=${padState.pleasure} / A=${padState.arousal} / D=${padState.dominance}
${describePAD(padState)}

## 最近對話
${conversation}

---

請給這位老師一個簡短的「下一步回覆方向提示」。
- 1 句話，20–40 字
- 是方向提示，不是直接幫他寫訊息（例如：「先同理家長的擔心，再提供事實，避免在 LINE 定責」）
- 根據目前對話狀態給最有用的建議
- 繁體中文

請直接輸出一句提示文字，不要 JSON 格式，不要其他說明。`
}

// ──────────────────────────────────────────────────────────────
// Polish text prompt
// ──────────────────────────────────────────────────────────────

export function buildPolishPrompt(draftMessage: string): string {
  return `你是一位親師溝通文字潤飾專家，專精於台灣中小學教師透過 LINE 與家長溝通的技巧。

以下是一位老師想要傳給家長的訊息草稿：

「${draftMessage}」

---

請對這則訊息進行分析與潤飾。

## 溝通技巧參考
${TECHNIQUES_CATALOG}

## 你的工作
1. 潤飾這則訊息，讓它更符合專業、同理、不定責的親師溝通原則
2. 找出潤飾了哪些面向，列出每個改動對應的技巧與說明
3. 給出 2–3 條額外建議

請以 JSON 格式輸出：
{
  "polished": "潤飾後的完整訊息",
  "improvements": [
    {
      "techniqueId": "T01",
      "techniqueName": "首訊破冰與開場設計",
      "note": "改動說明（20–40字）"
    }
  ],
  "suggestions": ["建議一", "建議二"]
}`
}

export function buildUpdateMemoryPrompt(
  scenario: ScenarioConfig,
  parentId: ParentId,
  currentMemory: ParentMemory,
  messages: Message[],
): string {
  const persona = scenario.parents[parentId]
  const conversation = formatMessages(messages.slice(-6))

  return `你是 ${persona.name}。根據最近的對話，更新你對這位老師和事件的理解。

目前的記憶：
- 對事件的理解：${currentMemory.events || '尚不清楚'}
- 對老師的印象：${currentMemory.teacherImpression || '尚無印象'}

最近對話：
${conversation}

請以 JSON 格式更新記憶（簡短的一句話）：
{"events": "對事件的最新理解", "teacherImpression": "對老師的最新印象"}`
}
