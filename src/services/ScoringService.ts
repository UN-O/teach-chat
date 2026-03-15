import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import type { ScenarioConfig, ParentId, Phase, Message, ScoreResult } from '@/types'

const scoreResultSchema = z.object({
  scores: z.array(
    z.object({
      techniqueId: z.string(),
      techniqueName: z.string(),
      score: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
      feedback: z.string(),
      suggestion: z.string(),
    })
  ),
})

function formatMessages(messages: Message[]): string {
  return messages
    .map(m => `${m.role === 'user' ? '老師' : '家長'}：${m.content}`)
    .join('\n')
}

function buildScoringPrompt(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
  messages: Message[],
): string {
  const phaseData = phase === 1 ? scenario.phase1 : scenario.phase2
  const techniques = phaseData.techniques
  const parentName = scenario.parents[parentId].name
  const conversation = formatMessages(messages)

  const techDetails = techniques.map(t => {
    const rubricExamples: Record<string, string> = {
      T01: '4=溫暖具體不驚嚇；3=可接受；2=略顯公式化；1=讓家長立刻進入防禦',
      T02: '4=事實與擔憂明確分層；3=大致分層；2=混在一起；1=完全未區分',
      T04: '4=文字中能感受真誠；3=尚可；2=過冷或過熱；1=引發家長不適',
      T05: '4=有跟進已讀未回；3=有提但未跟進；2=忽略已讀；1=完全沒注意',
      T06: '4=成功降溫；3=略有反擊但未激化；2=過度道歉；1=與家長爭論',
      T07: '4=有明確下一步（時間、行動）；3=有提但不具體；2=結尾模糊；1=對話無疾而終',
      T09: '4=適時引導轉換媒介；3=有提但不明確；2=繼續在 LINE 討論敏感話題；1=完全未考慮媒介問題',
      T10: '4=有主動思考通知順序邏輯；3=有順序但未說明；2=順序不合理；1=同時或隨機通知',
      T11: '4=全程用「衝突」未用「打人」；3=偶有傾向；2=明顯帶有傾向；1=直接定罪',
      T12: '4=部位+程度+處置說清楚；3=大致準確；2=過度誇大或輕描；1=未說明傷況',
      T14: '4=全程未定責；3=大致守住；2=帶有傾向；1=明確在 LINE 上定責',
      T15: '4=主動說明輔導流程；3=有說明但不完整；2=只說「會處理」；1=未說明後續',
      T16: '4=自然引導轉面談；3=有提但生硬；2=只說來學校沒說原因；1=未引導',
      T17: '4=先安心再說事件；3=有安撫但順序不對；2=直接說傷況；1=未安撫',
    }
    return `- ${t.id} ${t.name}：${rubricExamples[t.id] || '請根據技巧名稱評估對話品質'}`
  }).join('\n')

  return `你是一位資深教師溝通訓練評分師。請根據以下評分標準，針對老師與家長 ${parentName} 的對話（Phase ${phase}）進行評分。

## 評分標準（1-4分）
${techDetails}

## 對話記錄
${conversation}

## 評分要求
- 每個技巧給 1-4 分整數
- feedback：說明老師這次在此技巧的表現（50字以內，用繁體中文）
- suggestion：給老師的具體改進建議（50字以內，用繁體中文）
- 語氣要鼓勵性但誠實

請以 JSON 格式輸出評分結果。`
}

export async function scorePhase(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
  messages: Message[],
): Promise<ScoreResult[]> {
  const model = getLLMModel()
  const prompt = buildScoringPrompt(scenario, parentId, phase, messages)

  const { output } = await generateText({
    model,
    output: Output.object({ schema: scoreResultSchema }),
    prompt,
    providerOptions: googleProviderOptions,
  })

  return output.scores.map(s => ({
    techniqueId: s.techniqueId,
    techniqueName: s.techniqueName,
    score: s.score,
    feedback: s.feedback,
    suggestion: s.suggestion,
  }))
}
