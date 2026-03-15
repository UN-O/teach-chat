import { NextResponse } from 'next/server'
import { getScenarioData } from '@/services/ScenarioService'
import { scorePhase } from '@/services/ScoringService'
import type { ScenarioName, Difficulty, ParentId, Phase, Message } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    parentId: ParentId
    phase: Phase
    messages: Message[]
  }

  const { scenarioName, difficulty, parentId, phase, messages } = body

  const scenario = getScenarioData(scenarioName, difficulty)
  const scores = await scorePhase(scenario, parentId, phase, messages)

  return NextResponse.json({ scores })
}
