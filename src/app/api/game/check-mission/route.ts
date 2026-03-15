import { NextResponse } from 'next/server'
import { getScenarioData } from '@/services/ScenarioService'
import { checkMission } from '@/services/GameEngineService'
import type { ScenarioName, Difficulty, ParentId, Phase, Message, MissionItem } from '@/types'

export async function POST(req: Request) {
  const body = await req.json() as {
    scenarioName: ScenarioName
    difficulty: Difficulty
    parentId: ParentId
    phase: Phase
    messages: Message[]
    currentMissions: MissionItem[]
  }

  const { scenarioName, difficulty, parentId, phase, messages, currentMissions } = body

  const scenario = getScenarioData(scenarioName, difficulty)
  const updatedMissions = await checkMission(scenario, parentId, phase, messages, currentMissions)

  return NextResponse.json({ missions: updatedMissions })
}
