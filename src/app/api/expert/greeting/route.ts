import { generateText } from 'ai'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import { buildExpertGreetingPrompt, getScenarioData } from '@/services/ScenarioService'
import type { ScenarioName, Difficulty } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
  }

  const { scenarioName, difficulty } = body

  const scenario = getScenarioData(scenarioName, difficulty)
  const prompt = buildExpertGreetingPrompt(scenario)

  const { text } = await generateText({
    model: getLLMModel(),
    prompt,
    providerOptions: googleProviderOptions,
  })

  return Response.json({ content: text.trim() })
}
