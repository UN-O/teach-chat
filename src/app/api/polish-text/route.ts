import { generateText } from 'ai'
import { getLLMModel, googleProviderOptions } from '@/lib/llm/config'
import { buildPolishPrompt } from '@/services/ScenarioService'

export async function POST(req: Request) {
  const body = await req.json() as { draft: string }
  const { draft } = body

  if (!draft?.trim()) {
    return Response.json({ error: 'draft is required' }, { status: 400 })
  }

  const prompt = buildPolishPrompt(draft.trim())

  const { text } = await generateText({
    model: getLLMModel(),
    prompt,
    providerOptions: googleProviderOptions,
  })

  // Parse the JSON from LLM output (may be wrapped in ```json ... ```)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return Response.json({ error: 'Failed to parse LLM response' }, { status: 500 })
  }

  try {
    const result = JSON.parse(jsonMatch[0]) as {
      polished: string
      improvements: Array<{ techniqueId: string; techniqueName: string; note: string }>
      suggestions: string[]
    }
    return Response.json(result)
  } catch {
    return Response.json({ error: 'Failed to parse JSON' }, { status: 500 })
  }
}
