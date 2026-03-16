import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import { buildExpertResponsePrompt, getScenarioData } from '@/services/ScenarioService'
import type { ScenarioName, Difficulty, ParentId, Message, ExpertMessage } from '@/types'

const expertResponseSchema = z.object({
  content: z.string(),
  relatedTechniqueIds: z.array(z.string()).default([]),
})

function normalizeTechniqueIds(ids: string[]): string[] {
  return ids.filter(id => /^T\d{2}$/.test(id)).slice(0, 3)
}

function parseExpertResponse(raw: string): { content: string; relatedTechniqueIds: string[] } {
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return { content: raw.trim(), relatedTechniqueIds: [] }

  try {
    const result = JSON.parse(jsonMatch[0]) as { content?: string; relatedTechniqueIds?: string[] }
    return {
      content: (result.content ?? raw).trim(),
      relatedTechniqueIds: Array.isArray(result.relatedTechniqueIds)
        ? normalizeTechniqueIds(result.relatedTechniqueIds)
        : [],
    }
  } catch {
    return { content: raw.trim(), relatedTechniqueIds: [] }
  }
}

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

  try {
    const { output } = await generateText({
      model: getLLMModel(),
      output: Output.object({ schema: expertResponseSchema }),
      prompt,
      providerOptions: googleProviderOptions,
    })

    return Response.json({
      content: output.content.trim(),
      relatedTechniqueIds: normalizeTechniqueIds(output.relatedTechniqueIds),
    })
  } catch {
    const { text } = await generateText({
      model: getLLMModel(),
      prompt,
      providerOptions: googleProviderOptions,
    })

    const parsed = parseExpertResponse(text)

    return Response.json({
      content: parsed.content,
      relatedTechniqueIds: parsed.relatedTechniqueIds,
    })
  }
}
