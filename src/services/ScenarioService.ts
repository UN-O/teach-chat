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
