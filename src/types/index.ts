// Scenario & Game Types

export type ScenarioName = 'fight' | 'abnormal'
export type Difficulty = 'basic' | 'advanced'
export type ParentId = 'A' | 'B'
export type Phase = 1 | 2
export type GameState = 'init' | 'intro' | 'interact' | 'report'
export type PlayerAvatar = 1 | 2 | 3 | 4
export type EducationLevel = 'elementary' | 'middle'
export type TeacherRole = 'intern' | 'parttime' | 'substitute' | 'full'

export interface PADState {
  pleasure: number   // -5 to +5
  arousal: number    // -5 to +5
  dominance: number  // -5 to +5
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isRead?: boolean
}

export interface MissionItem {
  id: string
  label: string
  completed: boolean
}

export interface ScoreResult {
  techniqueId: string
  techniqueName: string
  score: 1 | 2 | 3 | 4
  feedback: string
  suggestion: string
}

export interface PlayerProfile {
  avatar: PlayerAvatar
  name: string
  educationLevel: EducationLevel
  role: TeacherRole
}

export interface ParentMemory {
  events: string
  teacherImpression: string
}

export interface ParentSession {
  parentId: ParentId
  messages: Message[]
  pendingSeq: string[]       // 已生成但尚未顯示的訊息泡泡
  padState: PADState
  memory: ParentMemory
  phase1Missions: MissionItem[]
  phase2Missions: MissionItem[]
  phase1Scores: ScoreResult[]
  phase2Scores: ScoreResult[]
  phase1Done: boolean
  phase2Done: boolean
  isOnline: boolean          // Phase 1: false, Phase 2: true
  lastCheckSendAt: number    // timestamp of last checkSend call
}

export interface GameSession {
  sessionId: string
  scenarioName: ScenarioName
  difficulty: Difficulty
  gameState: GameState
  currentPhase: Phase
  player: PlayerProfile
  parents: Record<ParentId, ParentSession>
  activeParent: ParentId | null
  createdAt: number
}

// Scenario Data Types

export interface PersonaConfig {
  name: string
  age: number
  occupation: string
  personality: string
  speechStyle: string
  catchphrases: string[]
  forbiddenWords: string[]
  coreMotivation: string
  traumas: string[]
  initialPAD: PADState
  background: string
  parentingStyle: string
  initialKnowledge: string
}

export interface MissionCondition {
  id: string
  label: string
  description: string
}

export interface QuestionBankItem {
  id: string
  phase: Phase
  question: string
  trigger?: string
}

export interface HintItem {
  techniqueId: string
  content: string
}

export interface TechniqueInfo {
  id: string
  name: string
}

export interface ScenarioConfig {
  name: ScenarioName
  difficulty: Difficulty
  title: string
  summary: string
  storyLine: string
  techniques: TechniqueInfo[]
  parents: Record<ParentId, PersonaConfig>
  phase1: {
    description: string
    goals: string
    missions: Record<ParentId, MissionCondition[]>
    techniques: TechniqueInfo[]
  }
  phase2: {
    description: string
    missions: Record<ParentId, MissionCondition[]>
    questionBank: Record<ParentId, QuestionBankItem[]>
    techniques: TechniqueInfo[]
  }
  hints: HintItem[]
  scoring: {
    totalScore: number
    grade: { excellent: number; pass: number; needWork: number }
  }
}
