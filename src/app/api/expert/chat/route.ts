import { generateText } from 'ai'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import { buildExpertResponsePrompt, getScenarioData } from '@/services/ScenarioService'
import type { ScenarioName, Difficulty, ParentId, Message, ExpertMessage } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    userMessage: string
    expertMessages: ExpertMessage[]
    parentsMessages: Record<ParentId, Message[]>
    teacherMessages?: Message[]
  }

  const { scenarioName, difficulty, userMessage, expertMessages, parentsMessages, teacherMessages } = body

  const scenario = getScenarioData(scenarioName, difficulty)
  const prompt = buildExpertResponsePrompt(
    scenario,
    expertMessages,
    { parentsMessages, teacherMessages },
    userMessage,
  )

  const { text } = await generateText({
    model: getLLMModel(),
    prompt,
    providerOptions: googleProviderOptions,
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return Response.json({ content: text.trim(), relatedTechniqueIds: [] })
  }

  try {
    const result = JSON.parse(jsonMatch[0]) as { content: string; relatedTechniqueIds: string[] }
    return Response.json({
      content: result.content ?? text.trim(),
      relatedTechniqueIds: result.relatedTechniqueIds ?? [],
    })
  } catch {
    return Response.json({ content: text.trim(), relatedTechniqueIds: [] })
  }
}
