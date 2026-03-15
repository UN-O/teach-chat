import { streamText } from 'ai'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import { buildSystemPrompt, getScenarioData } from '@/services/ScenarioService'
import type { ScenarioName, Difficulty, ParentId, Phase, PADState, Message, ParentMemory } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    parentId: ParentId
    messages: Message[]
    padState: PADState
    memory: ParentMemory
    phase: Phase
  }

  const { scenarioName, difficulty, parentId, messages, padState, memory, phase } = body

  const scenario = getScenarioData(scenarioName, difficulty)
  const systemPrompt = buildSystemPrompt(scenario, parentId, padState, memory, phase, messages)

  const result = streamText({
    model: getLLMModel(),
    prompt: systemPrompt,
    providerOptions: googleProviderOptions,
  })

  return result.toTextStreamResponse()
}
