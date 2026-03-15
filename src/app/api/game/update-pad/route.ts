import { NextResponse } from 'next/server'
import { getScenarioData } from '@/services/ScenarioService'
import { updatePAD, updateMemories } from '@/services/GameEngineService'
import type { ScenarioName, Difficulty, ParentId, PADState, Message, ParentMemory } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    parentId: ParentId
    currentPAD: PADState
    currentMemory: ParentMemory
    messages: Message[]
  }

  const { scenarioName, difficulty, parentId, currentPAD, currentMemory, messages } = body

  const scenario = getScenarioData(scenarioName, difficulty)

  const [newPAD, newMemory] = await Promise.all([
    updatePAD(scenario, parentId, currentPAD, messages),
    updateMemories(scenario, parentId, currentMemory, messages),
  ])

  return NextResponse.json({ pad: newPAD, memory: newMemory })
}
