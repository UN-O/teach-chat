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
    isOnline: false,
    lastCheckSendAt: 0,
  }
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
          return {
            session: {
              ...state.session,
              parents: {
                ...state.session.parents,
                [parentId]: {
                  ...state.session.parents[parentId],
                  [key]: missions,
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

      setPhase: (phase) => {
        set(state => state.session ? { session: { ...state.session, currentPhase: phase } } : state)
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
