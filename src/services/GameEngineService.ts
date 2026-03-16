import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getDialogueLLMModel, getTaskLLMModel, googleProviderOptions } from '@/lib/llm/config'
import {
  buildSystemPrompt,
  buildCheckMissionPrompt,
  buildCheckSendPrompt,
  buildUpdatePADPrompt,
  buildUpdateMemoryPrompt,
} from '@/services/ScenarioService'
import type {
  ScenarioConfig,
  ParentId,
  Phase,
  PADState,
  Message,
  MissionItem,
  ParentMemory,
} from '@/types'

const bubblesSchema = z.object({
  bubbles: z.array(z.string()).min(1).max(4),
})

const checkMissionSchema = z.object({
  results: z.array(z.object({
    id: z.string(),
    completed: z.boolean(),
  })),
})

const checkSendSchema = z.object({
  shouldSend: z.boolean(),
  suggestedMessage: z.string().optional(),
})

const padDeltaSchema = z.object({
  pleasureDelta: z.number(),
  arousalDelta: z.number(),
  dominanceDelta: z.number(),
})

const memorySchema = z.object({
  events: z.string(),
  teacherImpression: z.string(),
})

// Action1: Generate parent message bubbles
export async function generateMessage(
  scenario: ScenarioConfig,
  parentId: ParentId,
  padState: PADState,
  memory: ParentMemory,
  phase: Phase,
  messages: Message[],
): Promise<string[]> {
  const model = getDialogueLLMModel()
  const systemPrompt = buildSystemPrompt(scenario, parentId, padState, memory, phase, messages)

  const { output } = await generateText({
    model,
    output: Output.object({ schema: bubblesSchema }),
    prompt: systemPrompt,
    providerOptions: googleProviderOptions,
  })

  return output.bubbles
}

// Action2: Check if parent should autonomously send a message
export async function checkSend(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
  messages: Message[],
): Promise<{ shouldSend: boolean; suggestedMessage?: string }> {
  const model = getDialogueLLMModel()
  const prompt = buildCheckSendPrompt(scenario, parentId, phase, messages)

  const { output } = await generateText({
    model,
    output: Output.object({ schema: checkSendSchema }),
    prompt,
    providerOptions: googleProviderOptions,
  })

  return output
}

// Action3: Check if phase mission conditions are met
export async function checkMission(
  scenario: ScenarioConfig,
  parentId: ParentId,
  phase: Phase,
  messages: Message[],
  currentMissions: MissionItem[],
): Promise<MissionItem[]> {
  if (messages.filter(m => m.role === 'user').length === 0) {
    return currentMissions
  }

  const model = getTaskLLMModel()
  const prompt = buildCheckMissionPrompt(scenario, parentId, phase, messages)

  const { output } = await generateText({
    model,
    output: Output.object({ schema: checkMissionSchema }),
    prompt,
    providerOptions: googleProviderOptions,
  })

  return currentMissions.map(mission => {
    const result = output.results.find(r => r.id === mission.id)
    return result ? { ...mission, completed: result.completed } : mission
  })
}

// Action5: Update PAD state based on recent conversation
export async function updatePAD(
  scenario: ScenarioConfig,
  parentId: ParentId,
  currentPAD: PADState,
  messages: Message[],
): Promise<PADState> {
  if (messages.length < 2) return currentPAD

  const model = getDialogueLLMModel()
  const prompt = buildUpdatePADPrompt(scenario, parentId, currentPAD, messages)

  const { output } = await generateText({
    model,
    output: Output.object({ schema: padDeltaSchema }),
    prompt,
    providerOptions: googleProviderOptions,
  })

  return {
    pleasure: Math.max(-5, Math.min(5, currentPAD.pleasure + output.pleasureDelta)),
    arousal: Math.max(-5, Math.min(5, currentPAD.arousal + output.arousalDelta)),
    dominance: Math.max(-5, Math.min(5, currentPAD.dominance + output.dominanceDelta)),
  }
}

// Action4: Update character memory after conversation
export async function updateMemories(
  scenario: ScenarioConfig,
  parentId: ParentId,
  currentMemory: ParentMemory,
  messages: Message[],
): Promise<ParentMemory> {
  if (messages.length < 2) return currentMemory

  const model = getDialogueLLMModel()
  const prompt = buildUpdateMemoryPrompt(scenario, parentId, currentMemory, messages)

  const { output } = await generateText({
    model,
    output: Output.object({ schema: memorySchema }),
    prompt,
    providerOptions: googleProviderOptions,
  })

  return output
}

// Calculate t_delay based on PAD Arousal
// Higher arousal (A) → shorter delay (more impatient)
export function calculateTDelay(arousal: number): number {
  return Math.max(500, 3000 - arousal * 250)
}
