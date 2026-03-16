import { generateText } from 'ai'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import { buildTipPrompt, getScenarioData } from '@/services/ScenarioService'
import type { ScenarioName, Difficulty, ParentId, Phase, PADState, Message } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    parentId: ParentId
    phase: Phase
    messages: Message[]
    padState: PADState
  }

  const { scenarioName, difficulty, parentId, phase, messages, padState } = body

  const scenario = getScenarioData(scenarioName, difficulty)
  const prompt = buildTipPrompt(scenario, parentId, phase, messages, padState)

  const { text } = await generateText({
    model: getLLMModel(),
    prompt,
    providerOptions: googleProviderOptions,
  })

  return Response.json({ direction: text.trim() })
}
