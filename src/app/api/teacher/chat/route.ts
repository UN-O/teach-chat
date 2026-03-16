import { generateText } from 'ai'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import { buildTeacherSystemPrompt, getScenarioData } from '@/services/ScenarioService'
import type { ScenarioName, Difficulty, Message } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    messages: Message[]
  }

  const { scenarioName, difficulty, messages } = body

  const scenario = getScenarioData(scenarioName, difficulty)

  if (!scenario.teacher) {
    return Response.json({ error: 'No teacher in this scenario' }, { status: 400 })
  }

  const prompt = buildTeacherSystemPrompt(scenario, messages)

  const { text } = await generateText({
    model: getLLMModel(),
    prompt,
    providerOptions: googleProviderOptions,
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return Response.json({ bubbles: [text.trim()] })
  }

  try {
    const result = JSON.parse(jsonMatch[0]) as { bubbles: string[] }
    return Response.json({ bubbles: result.bubbles ?? [text.trim()] })
  } catch {
    return Response.json({ bubbles: [text.trim()] })
  }
}
