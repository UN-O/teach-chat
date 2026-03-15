'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getScenarioConfig } from '@/data/scenarios'
import type {
  GameSession,
  GameState,
  ParentId,
  Phase,
  Message,
  MissionItem,
  ScoreResult,
  PADState,
  ParentMemory,
  PhaseStartSnapshot,
  PlayerProfile,
  ScenarioName,
  Difficulty,
} from '@/types'

interface GameStore {
  session: GameSession | null

  // Session init
  initSession: (
    name: ScenarioName,
    difficulty: Difficulty,
    player: PlayerProfile,
  ) => string

  // Messages
  addMessage: (parentId: ParentId, message: Message) => void
  addPendingSeq: (parentId: ParentId, bubbles: string[]) => void
  flushNextBubble: (parentId: ParentId) => string | null
  markMessagesRead: (parentId: ParentId) => void

  // PAD & Memory
  updatePAD: (parentId: ParentId, newPAD: PADState) => void
  updateMemory: (parentId: ParentId, memory: ParentMemory) => void

  // Missions & Scores
  updateMissions: (parentId: ParentId, phase: Phase, missions: MissionItem[]) => void
  setPhaseScores: (parentId: ParentId, phase: Phase, scores: ScoreResult[]) => void
  setPhaseDone: (parentId: ParentId, phase: Phase) => void
  resetParentPhaseState: (parentId: ParentId, phase: Phase) => void

  // Phase & State
  setPhase: (phase: Phase) => void
  setParentOnline: (parentId: ParentId) => void
  setActiveParent: (parentId: ParentId | null) => void
  setGameState: (state: GameState) => void
  updateLastCheckSend: (parentId: ParentId) => void

  clearSession: () => void
}

function createInitialParentSession(parentId: ParentId, scenarioName: ScenarioName, difficulty: Difficulty) {
  const scenario = getScenarioConfig(scenarioName, difficulty)
  const persona = scenario.parents[parentId]
  const phase1Missions = scenario.phase1.missions[parentId].map(m => ({
    id: m.id,
    label: m.label,
    completed: false,
  }))
  const phase2Missions = scenario.phase2.missions[parentId].map(m => ({
    id: m.id,
    label: m.label,
    completed: false,
  }))

  return {
    parentId,
    messages: [] as Message[],
    pendingSeq: [] as string[],
    padState: { ...persona.initialPAD },
    memory: { events: '', teacherImpression: '' } as ParentMemory,
    phase1Missions,
    phase2Missions,
    phase1Scores: [] as ScoreResult[],
    phase2Scores: [] as ScoreResult[],
    phase1Done: false,
    phase2Done: false,
    phase2StartSnapshot: null as PhaseStartSnapshot | null,
    isOnline: false,
    lastCheckSendAt: 0,
  }
}

function createPhaseMissions(parentId: ParentId, phase: Phase, scenarioName: ScenarioName, difficulty: Difficulty): MissionItem[] {
  const scenario = getScenarioConfig(scenarioName, difficulty)
  const source = phase === 1 ? scenario.phase1.missions[parentId] : scenario.phase2.missions[parentId]
  return source.map(m => ({
    id: m.id,
    label: m.label,
    completed: false,
  }))
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      session: null,

      initSession: (name, difficulty, player) => {
        const sessionId = crypto.randomUUID()
        const session: GameSession = {
          sessionId,
          scenarioName: name,
          difficulty,
          gameState: 'init',
          currentPhase: 1,
          player,
          parents: {
            A: createInitialParentSession('A', name, difficulty),
            B: createInitialParentSession('B', name, difficulty),
          },
          activeParent: null,
          createdAt: Date.now(),
        }
        set({ session })
        return sessionId
      },

      addMessage: (parentId, message) => {
        set(state => {
          if (!state.session) return state
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  messages: [...state.session.parents[parentId].messages, message],
                },
              },
            },
          }
        })
      },

      addPendingSeq: (parentId, bubbles) => {
        set(state => {
          if (!state.session) return state
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  pendingSeq: [...state.session.parents[parentId].pendingSeq, ...bubbles],
                },
              },
            },
          }
        })
      },

      flushNextBubble: (parentId) => {
        const state = get()
        if (!state.session) return null
        const seq = state.session.parents[parentId].pendingSeq
        if (seq.length === 0) return null
        const [first, ...rest] = seq
        set(s => ({
          session: s.session ? {
            ...s.session,
            parents: {
              ...s.session.parents,
              [parentId]: {
                ...s.session.parents[parentId],
                pendingSeq: rest,
              },
            },
          } : null,
        }))
        return first
      },

      markMessagesRead: (parentId) => {
        set(state => {
          if (!state.session) return state
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  messages: state.session.parents[parentId].messages.map(m => ({
                    ...m,
                    isRead: true,
                  })),
                },
              },
            },
          }
        })
      },

      updatePAD: (parentId, newPAD) => {
        set(state => {
          if (!state.session) return state
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  padState: newPAD,
                },
              },
            },
          }
        })
      },

      updateMemory: (parentId, memory) => {
        set(state => {
          if (!state.session) return state
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  memory,
                },
              },
            },
          }
        })
      },

      updateMissions: (parentId, phase, missions) => {
        set(state => {
          if (!state.session) return state
          const key = phase === 1 ? 'phase1Missions' : 'phase2Missions'
          const existingMissions = state.session.parents[parentId][key]
          const incomingMap = new Map(missions.map(m => [m.id, m]))
          const mergedMissions = existingMissions.map(existing => {
            const incoming = incomingMap.get(existing.id)
            if (!incoming) return existing
            return {
              ...existing,
              ...incoming,
              // Once a mission is completed, never roll it back to false.
              completed: existing.completed || incoming.completed,
            }
          })

          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  [key]: mergedMissions,
                },
              },
            },
          }
        })
      },

      setPhaseScores: (parentId, phase, scores) => {
        set(state => {
          if (!state.session) return state
          const key = phase === 1 ? 'phase1Scores' : 'phase2Scores'
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  [key]: scores,
                },
              },
            },
          }
        })
      },

      setPhaseDone: (parentId, phase) => {
        set(state => {
          if (!state.session) return state
          const key = phase === 1 ? 'phase1Done' : 'phase2Done'
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  [key]: true,
                },
              },
            },
          }
        })
      },

      resetParentPhaseState: (parentId, phase) => {
        set(state => {
          if (!state.session) return state
          const session = state.session
          const scenario = getScenarioConfig(session.scenarioName, session.difficulty)
          const persona = scenario.parents[parentId]
          const parentSession = session.parents[parentId]
          const phaseMissionKey = phase === 1 ? 'phase1Missions' : 'phase2Missions'
          const phaseScoreKey = phase === 1 ? 'phase1Scores' : 'phase2Scores'
          const phaseDoneKey = phase === 1 ? 'phase1Done' : 'phase2Done'
          const phase2Snapshot = parentSession.phase2StartSnapshot

          const restoredState = phase === 2 && phase2Snapshot
            ? {
                messages: phase2Snapshot.messages,
                padState: phase2Snapshot.padState,
                memory: phase2Snapshot.memory,
                isOnline: phase2Snapshot.isOnline,
                lastCheckSendAt: phase2Snapshot.lastCheckSendAt,
              }
            : {
                messages: [] as Message[],
                padState: { ...persona.initialPAD },
                memory: { events: '', teacherImpression: '' } as ParentMemory,
                isOnline: false,
                lastCheckSendAt: 0,
              }

          return {
            session: {
              ...session,
              parents: {
                ...session.parents,
                [parentId]: {
                  ...parentSession,
                  messages: restoredState.messages,
                  pendingSeq: [],
                  padState: restoredState.padState,
                  memory: restoredState.memory,
                  isOnline: restoredState.isOnline,
                  lastCheckSendAt: restoredState.lastCheckSendAt,
                  [phaseMissionKey]: createPhaseMissions(parentId, phase, session.scenarioName, session.difficulty),
                  [phaseScoreKey]: [],
                  [phaseDoneKey]: false,
                },
              },
            },
          }
        })
      },

      setPhase: (phase) => {
        set(state => {
          if (!state.session) return state

          const nextParents = phase === 2
            ? {
                A: {
                  ...state.session.parents.A,
                  phase2StartSnapshot: {
                    messages: [...state.session.parents.A.messages],
                    padState: { ...state.session.parents.A.padState },
                    memory: { ...state.session.parents.A.memory },
                    isOnline: state.session.parents.A.isOnline,
                    lastCheckSendAt: state.session.parents.A.lastCheckSendAt,
                  },
                },
                B: {
                  ...state.session.parents.B,
                  phase2StartSnapshot: {
                    messages: [...state.session.parents.B.messages],
                    padState: { ...state.session.parents.B.padState },
                    memory: { ...state.session.parents.B.memory },
                    isOnline: state.session.parents.B.isOnline,
                    lastCheckSendAt: state.session.parents.B.lastCheckSendAt,
                  },
                },
              }
            : state.session.parents

          return {
            session: {
              ...state.session,
              currentPhase: phase,
              parents: nextParents,
            },
          }
        })
      },

      setParentOnline: (parentId) => {
        set(state => {
          if (!state.session) return state
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  isOnline: true,
                },
              },
            },
          }
        })
      },

      setActiveParent: (parentId) => {
        set(state => state.session ? { session: { ...state.session, activeParent: parentId } } : state)
      },

      setGameState: (gameState) => {
        set(state => state.session ? { session: { ...state.session, gameState } } : state)
      },

      updateLastCheckSend: (parentId) => {
        set(state => {
          if (!state.session) return state
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  lastCheckSendAt: Date.now(),
                },
              },
            },
          }
        })
      },

      clearSession: () => set({ session: null }),
    }),
    {
      name: 'teach-chat-game-session',
      partialize: (state) => ({ session: state.session }),
    },
  ),
)
