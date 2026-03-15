import { NextResponse } from 'next/server'
import { getScenarioData } from '@/services/ScenarioService'
import { checkSend, generateMessage } from '@/services/GameEngineService'
import type { ScenarioName, Difficulty, ParentId, Phase, PADState, Message, ParentMemory } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    parentId: ParentId
    phase: Phase
    messages: Message[]
    padState: PADState
    memory: ParentMemory
  }

  const { scenarioName, difficulty, parentId, phase, messages, padState, memory } = body

  const scenario = getScenarioData(scenarioName, difficulty)
  const result = await checkSend(scenario, parentId, phase, messages)

  if (!result.shouldSend) {
    return NextResponse.json({ shouldSend: false, bubbles: [] })
  }

  // Generate the actual message bubbles
  const bubbles = await generateMessage(scenario, parentId, padState, memory, phase, messages)

  return NextResponse.json({ shouldSend: true, bubbles })
}
