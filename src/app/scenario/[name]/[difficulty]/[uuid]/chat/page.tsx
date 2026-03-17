'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Info, RotateCcw, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useGameStore } from '@/store/game-store'
import { getScenarioConfig } from '@/data/scenarios'
import { ConfirmNavigationDialog } from '@/components/shared/confirm-navigation-dialog'
import { getInitialTriggerMessage, getMissionLabels } from '@/services/ScenarioService'
import { calculateTDelay } from '@/services/GameEngineService'
import { ChatBubble } from '@/components/game/chat-bubble'
import { ChatInput } from '@/components/game/chat-input'
import { ChatTip } from '@/components/game/chat-tip'
import { ChatList, getLastMessage, getUnreadCount } from '@/components/game/chat-list'
import type { ChatListItem } from '@/components/game/chat-list'
import { MissionPanel } from '@/components/game/mission-panel'
import { ScoreEntryButton } from '@/components/game/score-entry-button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { ScenarioName, Difficulty, ParentId, Message, MissionItem, ActiveChatId, ExpertMessage } from '@/types'
import { cn } from '@/lib/utils'

const CHECK_MISSION_DEBOUNCE = 2000
const CHECK_SEND_INTERVAL = 20000
const SEND_GUARD_MS = 400
const DUPLICATE_CONTENT_GUARD_MS = 1500

function formatMessageTime(ts: number) {
  return new Date(ts).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function inlineTechniqueLinks(content: string, techniqueIds: string[] = []) {
  const contentTechniqueIds = Array.from(content.matchAll(/T\d{2}/g)).map(match => match[0])
  const allTechniqueIds = Array.from(new Set([...techniqueIds, ...contentTechniqueIds])).slice(0, 3)
  let output = content
  const linkedIds = new Set<string>()

  for (const tid of allTechniqueIds) {
    const docId = tid.replace('T', '').padStart(2, '0')
    const linkMarkdown = ` [技巧 ${tid}](/docs/techniques/${docId})`
    const pattern = new RegExp(`\\b(${tid})\\b`)

    if (pattern.test(output)) {
      output = output.replace(pattern, `$1${linkMarkdown}`)
      linkedIds.add(tid)
    }
  }

  const remainingLinks = allTechniqueIds
    .filter(tid => !linkedIds.has(tid))
    .map(tid => {
      const docId = tid.replace('T', '').padStart(2, '0')
      return `[技巧 ${tid}](/docs/techniques/${docId})`
    })

  if (remainingLinks.length > 0) {
    output = `${output}\n\n${remainingLinks.join(' ')}`
  }

  return output
}

export default function ChatPage() {
  const params = useParams<{ name: string; difficulty: string; uuid: string }>()
  const router = useRouter()

  const name = params.name as ScenarioName
  const difficulty = params.difficulty as Difficulty

  const scenario = getScenarioConfig(name, difficulty)

  const session = useGameStore(s => s.session)
  const addMessage = useGameStore(s => s.addMessage)
  const addPendingSeq = useGameStore(s => s.addPendingSeq)
  const flushNextBubble = useGameStore(s => s.flushNextBubble)
  const markMessagesRead = useGameStore(s => s.markMessagesRead)
  const updateMissions = useGameStore(s => s.updateMissions)
  const setParentOnline = useGameStore(s => s.setParentOnline)
  const setActiveParent = useGameStore(s => s.setActiveParent)
  const updateLastCheckSend = useGameStore(s => s.updateLastCheckSend)
  const updateParentPAD = useGameStore(s => s.updatePAD)
  const updateParentMemory = useGameStore(s => s.updateMemory)
  const setPhaseDone = useGameStore(s => s.setPhaseDone)
  const resetParentPhaseState = useGameStore(s => s.resetParentPhaseState)
  const addTeacherMessage = useGameStore(s => s.addTeacherMessage)
  const updateTeacherMission = useGameStore(s => s.updateTeacherMission)
  const setTeacherGreeted = useGameStore(s => s.setTeacherGreeted)
  const addExpertMessage = useGameStore(s => s.addExpertMessage)
  const setExpertGreeted = useGameStore(s => s.setExpertGreeted)
  const markExpertMessagesRead = useGameStore(s => s.markExpertMessagesRead)

  const [activeChatId, setActiveChatId] = useState<ActiveChatId>('A')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileChat, setIsMobileChat] = useState(false)
  const [allMissionsDone, setAllMissionsDone] = useState(false)
  const [isCheckingMission, setIsCheckingMission] = useState(false)
  const [isParentInfoDialogOpen, setIsParentInfoDialogOpen] = useState(false)
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const checkMissionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const checkSendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phase2AutoTriggerRef = useRef<Record<ParentId, boolean>>({ A: false, B: false })
  const isSubmittingRef = useRef(false)
  const lastSubmitAtRef = useRef(0)
  const lastSubmittedContentRef = useRef<{ content: string; at: number; parentId: ParentId; phase: 1 | 2 } | null>(null)
  const teacherGreetTriggeredRef = useRef(false)
  const expertGreetTriggeredRef = useRef(false)
  const isCheckSendInFlightRef = useRef(false)

  const currentPhase = session?.currentPhase ?? 1
  const isViewingParent = activeChatId !== 'teacher' && activeChatId !== 'expert'
  const activeParentId: ParentId = isViewingParent ? (activeChatId as ParentId) : 'A'
  const parentSession = session?.parents[activeParentId]
  const teacherSession = session?.teacher
  const expertSession = session?.expert

  const isParentMissionsDone = useCallback((parentId: ParentId) => {
    if (!session) return false
    const phaseMissions = currentPhase === 1
      ? session.parents[parentId].phase1Missions
      : session.parents[parentId].phase2Missions

    return phaseMissions.length > 0 && phaseMissions.every(m => m.completed)
  }, [session, currentPhase])

  // Active messages based on current chat
  const messages: Message[] = isViewingParent
    ? (session?.parents[activeChatId as ParentId]?.messages ?? [])
    : activeChatId === 'teacher'
    ? (teacherSession?.messages ?? [])
    : (expertSession?.messages ?? [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark parent messages as read when viewing
  useEffect(() => {
    if (isViewingParent && parentSession && getUnreadCount(parentSession.messages) > 0) {
      markMessagesRead(activeChatId as ParentId)
    }
  }, [activeChatId, parentSession, markMessagesRead, isViewingParent])

  // Mark expert messages as read when viewing
  useEffect(() => {
    if (activeChatId === 'expert' && expertSession) {
      const unread = expertSession.messages.filter(m => m.role === 'assistant' && !m.isRead).length
      if (unread > 0) markExpertMessagesRead()
    }
  }, [activeChatId, expertSession, markExpertMessagesRead])

  // All parent missions done check
  useEffect(() => {
    if (!session) { setAllMissionsDone(false); return }
    const done = scenario.parentIds.every(pid => {
      const phaseMissions = currentPhase === 1
        ? session.parents[pid].phase1Missions
        : session.parents[pid].phase2Missions
      return phaseMissions.length > 0 && phaseMissions.every(m => m.completed)
    })
    setAllMissionsDone(done)
  }, [session, currentPhase, scenario])

  // Reset phase2 auto-trigger on session change
  useEffect(() => {
    phase2AutoTriggerRef.current = { A: false, B: false }
  }, [session?.sessionId])

  // Teacher: auto greet once when switching to teacher chat
  useEffect(() => {
    if (activeChatId !== 'teacher' || !session?.teacher || teacherGreetTriggeredRef.current) return
    if (session.teacher.hasGreeted) { teacherGreetTriggeredRef.current = true; return }

    teacherGreetTriggeredRef.current = true
    setTeacherGreeted()

    const greetMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: scenario.teacher!.initialMessage,
      timestamp: Date.now(),
    }
    addTeacherMessage(greetMsg)
  }, [activeChatId, session?.teacher, setTeacherGreeted, addTeacherMessage, scenario.teacher])

  // Expert: auto greet once on page mount (not only when viewing expert)
  useEffect(() => {
    if (!session || expertGreetTriggeredRef.current) return
    if (session.expert.hasGreeted) { expertGreetTriggeredRef.current = true; return }

    expertGreetTriggeredRef.current = true
    setExpertGreeted()

    const fetchGreeting = async () => {
      try {
        const res = await fetch('/api/expert/greeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenarioName: name, difficulty }),
        })
        const data = await res.json() as { content: string }
        const greetMsg: ExpertMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.content,
          timestamp: Date.now(),
          relatedTechniqueIds: [],
        }
        addExpertMessage(greetMsg)
      } catch {
        // silently fail - expert greeting is nice-to-have
      }
    }
    void fetchGreeting()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.sessionId])

  // Phase 2: auto trigger once per parent
  useEffect(() => {
    if (currentPhase !== 2 || !session || !isViewingParent) return
    const pid = activeChatId as ParentId
    if (isParentMissionsDone(pid)) return
    if (phase2AutoTriggerRef.current[pid]) return

    const parent = session.parents[pid]
    const phase2StartCount = parent.phase2StartSnapshot?.messages.length ?? 0
    const hasNewPhase2Messages = parent.messages.length > phase2StartCount

    if (hasNewPhase2Messages) {
      phase2AutoTriggerRef.current[pid] = true
      return
    }

    phase2AutoTriggerRef.current[pid] = true

    const runAutoTrigger = async () => {
      setParentOnline(pid)
      updateLastCheckSend(pid)
      try {
        const res = await fetch('/api/game/check-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioName: name, difficulty, parentId: pid, phase: currentPhase,
            messages: parent.messages, padState: parent.padState, memory: parent.memory,
          }),
        })
        const data = await res.json() as { shouldSend: boolean; bubbles: string[] }
        if (data.bubbles.length > 0) { addPendingSeq(pid, data.bubbles); return }
      } catch { /* fall through to deterministic trigger */ }

      const triggerMsg = getInitialTriggerMessage(scenario, pid)
      addMessage(pid, { id: crypto.randomUUID(), role: 'assistant', content: triggerMsg, timestamp: Date.now() })
    }

    void runAutoTrigger()
  }, [currentPhase, session, activeChatId, isViewingParent, name, difficulty, scenario, setParentOnline, updateLastCheckSend, addPendingSeq, addMessage, isParentMissionsDone])

  // Phase 2: Flush pending seq bubbles
  useEffect(() => {
    if (currentPhase !== 2 || !isViewingParent) return
    const pid = activeChatId as ParentId
    const seq = session?.parents[pid]?.pendingSeq ?? []
    if (seq.length === 0) return

    const timer = setTimeout(() => {
      const bubble = flushNextBubble(pid)
      if (bubble) {
        addMessage(pid, { id: crypto.randomUUID(), role: 'assistant', content: bubble, timestamp: Date.now() })
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [currentPhase, isViewingParent, activeChatId, session?.parents, flushNextBubble, addMessage])

  // Phase 2: checkSend every 20s
  useEffect(() => {
    if (currentPhase !== 2 || !isViewingParent) return
    const pid = activeChatId as ParentId
    if (isParentMissionsDone(pid)) return
    const parent = session?.parents[pid]
    if (!parent?.isOnline) return

    const runCheckSend = async () => {
      if (!session) return
      if (isCheckSendInFlightRef.current) return
      const probability = (parent.padState.arousal + 5) / 10
      if (Math.random() > probability) return
      updateLastCheckSend(pid)
      isCheckSendInFlightRef.current = true
      try {
        const res = await fetch('/api/game/check-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioName: name, difficulty, parentId: pid, phase: currentPhase,
            messages: parent.messages, padState: parent.padState, memory: parent.memory,
          }),
        })
        const data = await res.json() as { shouldSend: boolean; bubbles: string[] }
        if (data.shouldSend && data.bubbles.length > 0) addPendingSeq(pid, data.bubbles)
      } catch { /* silently fail */ }
      finally { isCheckSendInFlightRef.current = false }
    }

    checkSendIntervalRef.current = setInterval(runCheckSend, CHECK_SEND_INTERVAL)
    return () => { if (checkSendIntervalRef.current) clearInterval(checkSendIntervalRef.current) }
  }, [currentPhase, isViewingParent, activeChatId, session, name, difficulty, updateLastCheckSend, addPendingSeq, isParentMissionsDone])

  // Background checkMission
  const triggerCheckMission = useCallback(async (parentId: ParentId, msgs: Message[]) => {
    if (isCheckingMission || !session) return
    setIsCheckingMission(true)
    try {
      const currentMissions = currentPhase === 1
        ? session.parents[parentId].phase1Missions
        : session.parents[parentId].phase2Missions
      const res = await fetch('/api/game/check-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioName: name, difficulty, parentId, phase: currentPhase, messages: msgs, currentMissions }),
      })
      const data = await res.json() as { missions: MissionItem[] }
      updateMissions(parentId, currentPhase, data.missions)
    } catch { /* silently fail */ }
    finally { setIsCheckingMission(false) }
  }, [isCheckingMission, session, currentPhase, name, difficulty, updateMissions])

  // ──── Send handlers ────

  const handleSendToParent = async (content: string) => {
    const pid = activeChatId as ParentId
    const parent = session!.parents[pid]
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now() }
    addMessage(pid, userMsg)

    if (checkMissionTimerRef.current) clearTimeout(checkMissionTimerRef.current)
    checkMissionTimerRef.current = setTimeout(() => {
      triggerCheckMission(pid, [...parent.messages, userMsg])
    }, CHECK_MISSION_DEBOUNCE)

    if (currentPhase === 2 && parent.isOnline) {
      setIsLoading(true)
      const tDelay = calculateTDelay(parent.padState.arousal)
      await new Promise(resolve => setTimeout(resolve, tDelay))
      if (isCheckSendInFlightRef.current) { setIsLoading(false); return }
      isCheckSendInFlightRef.current = true
      try {
        const res = await fetch('/api/game/check-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioName: name, difficulty, parentId: pid, phase: currentPhase,
            messages: [...parent.messages, userMsg], padState: parent.padState, memory: parent.memory,
          }),
        })
        const data = await res.json() as { shouldSend: boolean; bubbles: string[] }
        if (data.bubbles.length > 0) addPendingSeq(pid, data.bubbles)
        void (async () => {
          try {
            const padRes = await fetch('/api/game/update-pad', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                scenarioName: name,
                difficulty,
                parentId: pid,
                currentPAD: parent.padState,
                currentMemory: parent.memory,
                messages: [...parent.messages, userMsg],
              }),
            })

            const padData = await padRes.json() as {
              pad: { pleasure: number; arousal: number; dominance: number }
              memory: { events: string; teacherImpression: string }
            }

            updateParentPAD(pid, padData.pad)
            updateParentMemory(pid, padData.memory)
          } catch {
            // silently fail to keep send flow non-blocking
          }
        })()
      } catch { /* silently fail */ }
      finally { isCheckSendInFlightRef.current = false; setIsLoading(false) }
    }
  }

  const handleSendToTeacher = async (content: string) => {
    if (!session?.teacher) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now() }
    addTeacherMessage(userMsg)
    setIsLoading(true)
    try {
      const updatedMessages = [...(session.teacher.messages), userMsg]
      const res = await fetch('/api/teacher/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioName: name, difficulty, messages: updatedMessages }),
      })
      const data = await res.json() as { bubbles: string[] }
      for (const bubble of data.bubbles) {
        addTeacherMessage({ id: crypto.randomUUID(), role: 'assistant', content: bubble, timestamp: Date.now() })
      }
      // Simple keyword check for coordination completion
      const allMsgs = [...updatedMessages, ...(data.bubbles.map(b => ({ role: 'assistant' as const, content: b, id: '', timestamp: 0 })))]
      const userTexts = allMsgs.filter(m => m.role === 'user').map(m => m.content).join(' ')
      if (/受傷|吳|先通知|順序/.test(userTexts)) updateTeacherMission('C1', true)
      if (/衝突|一樣|措辭|說法|一致/.test(userTexts)) updateTeacherMission('C2', true)
    } catch { /* silently fail */ }
    finally { setIsLoading(false) }
  }

  const handleSendToExpert = async (content: string) => {
    if (!session) return
    const userMsg: ExpertMessage = { id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now() }
    addExpertMessage(userMsg)
    setIsLoading(true)
    try {
      const parentsMessages = Object.fromEntries(
        scenario.parentIds.map(pid => [pid, session.parents[pid].messages])
      ) as Record<ParentId, Message[]>

      const res = await fetch('/api/expert/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioName: name,
          difficulty,
          userMessage: content,
          expertMessages: session.expert.messages,
          parentsMessages,
          teacherMessages: session.teacher?.messages,
        }),
      })
      const data = await res.json() as { content: string; relatedTechniqueIds: string[] }
      const expertMsg: ExpertMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content,
        timestamp: Date.now(),
        relatedTechniqueIds: data.relatedTechniqueIds,
      }
      addExpertMessage(expertMsg)
    } catch { /* silently fail */ }
    finally { setIsLoading(false) }
  }

  const handleSendMessage = async () => {
    const now = Date.now()
    if (isSubmittingRef.current) return
    if (now - lastSubmitAtRef.current < SEND_GUARD_MS) return
    if (!inputValue.trim() || isLoading || !session) return

    const content = inputValue.trim()

    // Only guard duplicate detection for parent chats
    if (isViewingParent) {
      const lastSubmitted = lastSubmittedContentRef.current
      if (
        lastSubmitted &&
        lastSubmitted.content === content &&
        lastSubmitted.parentId === (activeChatId as ParentId) &&
        lastSubmitted.phase === currentPhase &&
        now - lastSubmitted.at < DUPLICATE_CONTENT_GUARD_MS
      ) return
      lastSubmittedContentRef.current = { content, at: now, parentId: activeChatId as ParentId, phase: currentPhase }
    }

    isSubmittingRef.current = true
    lastSubmitAtRef.current = now
    setInputValue('')

    try {
      if (activeChatId === 'teacher') {
        await handleSendToTeacher(content)
      } else if (activeChatId === 'expert') {
        await handleSendToExpert(content)
      } else {
        await handleSendToParent(content)
      }
    } finally {
      isSubmittingRef.current = false
    }
  }

  const goToScorePage = () => router.push(`/scenario/${name}/${difficulty}/${params.uuid}/score/phase${currentPhase}`)

  const handleGoToScore = () => {
    scenario.parentIds.forEach(pid => setPhaseDone(pid, currentPhase))
    goToScorePage()
  }

  const handleDirectGoToScore = () => goToScorePage()

  const handleSelectParent = (parentId: ParentId) => {
    setActiveChatId(parentId)
    setActiveParent(parentId)
    setIsMobileChat(true)
  }

  const handleSelectTeacher = () => {
    setActiveChatId('teacher')
    setIsMobileChat(true)
  }

  const handleSelectExpert = () => {
    setActiveChatId('expert')
    setIsMobileChat(true)
  }

  const handleRestartCurrentChat = () => {
    if (checkMissionTimerRef.current) { clearTimeout(checkMissionTimerRef.current); checkMissionTimerRef.current = null }
    setInputValue('')
    setIsLoading(false)
    isSubmittingRef.current = false
    resetParentPhaseState(activeParentId, currentPhase)
  }

  const formatParentDisplayName = (parentId: ParentId) => {
    const parent = scenario.parents[parentId]
    return parent.childRelationLabel ? `${parent.name}（${parent.childRelationLabel}）` : parent.name
  }

  const getPadTone = (value: number, positiveLabel: string, neutralLabel: string, negativeLabel: string) => {
    if (value >= 2) return positiveLabel
    if (value <= -2) return negativeLabel
    return neutralLabel
  }

  if (!session) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center">
        <p className="text-muted">找不到遊戲 session，請重新開始。</p>
      </div>
    )
  }

  // Build chat list items
  const chatListItems: ChatListItem[] = [
    ...scenario.parentIds.map(pid => ({
      type: 'parent' as const,
      parentId: pid,
      name: formatParentDisplayName(pid),
      avatar: scenario.parents[pid].name.slice(0, 1),
      lastMessage: getLastMessage(session.parents[pid].messages),
      unreadCount: getUnreadCount(session.parents[pid].messages),
      isOnline: session.parents[pid].isOnline,
      phase1Done: session.parents[pid].phase1Done,
    })),
    ...(scenario.teacher && teacherSession ? [{
      type: 'teacher' as const,
      name: `${scenario.teacher.persona.name}（${scenario.teacher.persona.role}）`,
      lastMessage: getLastMessage(teacherSession.messages),
      hasCoordinated: teacherSession.coordinationMissions.every(m => m.completed),
    }] : []),
    {
      type: 'expert' as const,
      name: '照顧我的資深教師',
      lastMessage: getLastMessage(expertSession?.messages ?? []),
      unreadCount: (expertSession?.messages ?? []).filter(m => m.role === 'assistant' && !m.isRead).length,
    },
  ]

  const missionPanels = scenario.parentIds.map(pid => {
    const parentMissions = currentPhase === 1 ? session.parents[pid].phase1Missions : session.parents[pid].phase2Missions
    const parentMissionLabels = getMissionLabels(scenario, pid, currentPhase)
    const items: MissionItem[] = parentMissions.length > 0
      ? parentMissions
      : parentMissionLabels.map(m => ({ ...m, completed: false }))
    return { parentId: pid, title: `${formatParentDisplayName(pid)} 任務`, missions: items }
  })
  const activeMissionPanel = missionPanels.find(panel => panel.parentId === activeParentId)

  // Chat header info
  const getChatHeader = () => {
    if (activeChatId === 'teacher') {
      return {
        avatarText: scenario.teacher!.persona.name.slice(0, 1),
        avatarBg: 'bg-emerald-600',
        title: `${scenario.teacher!.persona.name}（${scenario.teacher!.persona.role}）`,
        subtitle: '同事協調',
      }
    }
    if (activeChatId === 'expert') {
      return {
        avatarText: '顧',
        avatarBg: 'bg-accent',
        title: '照顧我的資深教師',
        subtitle: '資深顧問',
      }
    }
    return {
      avatarText: scenario.parents[activeParentId].name.slice(0, 1),
      avatarBg: 'bg-secondary',
      title: formatParentDisplayName(activeParentId),
      subtitle: parentSession?.isOnline ? '在線' : '未上線',
    }
  }

  const chatHeader = getChatHeader()

  // Expert message bubble with technique quick-links
  const renderMessages = () => {
    if (activeChatId === 'expert') {
      const expertMsgs = expertSession?.messages ?? []
      return expertMsgs.map(msg => (
        <div key={msg.id}>
          {msg.role === 'assistant' ? (
            <div className="mb-4">
              <div className="px-1 text-sm leading-7 text-[#7A1F22]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-5 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm font-bold mb-2 mt-5 first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1.5 mt-4 first:mt-0">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-3 list-disc pl-5 space-y-1.5">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 space-y-1.5">{children}</ol>,
                    li: ({ children }) => <li className="leading-7 marker:text-[#C53B3F]">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => (
                      <code className="px-1 py-0.5 rounded bg-black/10 text-[0.9em]">{children}</code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="mb-3 border-l-2 border-[#FFD2D3] pl-3 text-[#8B3A3D]">{children}</blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="mb-3 overflow-x-auto">
                        <table className="w-full border-collapse text-xs">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-[#FFF1F1]">{children}</thead>,
                    th: ({ children }) => <th className="border border-[#FFD2D3] px-2 py-1 text-left font-semibold">{children}</th>,
                    td: ({ children }) => <td className="border border-[#FFD2D3] px-2 py-1 align-top">{children}</td>,
                    a: ({ href, children }) => {
                      if (href?.startsWith('/docs/techniques/')) {
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0 rounded-md bg-[#FFF1F1] text-[#C53B3F] border border-[#FFD2D3] hover:bg-[#FFE3E4] transition-colors align-middle"
                          >
                            <BookOpen size={10} />
                            {children}
                          </a>
                        )
                      }

                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                          {children}
                        </a>
                      )
                    },
                  }}
                >
                  {inlineTechniqueLinks(msg.content, (msg as ExpertMessage).relatedTechniqueIds ?? [])}
                </ReactMarkdown>
              </div>
              <span className="mt-1 block text-[10px] text-muted">{formatMessageTime(msg.timestamp)}</span>
            </div>
          ) : (
            <ChatBubble
              content={msg.content}
              role={msg.role}
              isRead={msg.isRead}
              timestamp={msg.timestamp}
              userBubbleColor="accent"
            />
          )}
        </div>
      ))
    }

    if (activeChatId === 'teacher') {
      const teacherMsgs = teacherSession?.messages ?? []
      return teacherMsgs.map(msg => (
        <ChatBubble
          key={msg.id}
          content={msg.content}
          role={msg.role}
          isRead={msg.isRead}
          timestamp={msg.timestamp}
          bubbleColor={msg.role === 'assistant' ? 'teacher' : undefined}
        />
      ))
    }

    return messages.map(msg => (
      <ChatBubble
        key={msg.id}
        content={msg.content}
        role={msg.role}
        isRead={msg.isRead}
        timestamp={msg.timestamp}
      />
    ))
  }

  const isMessagesEmpty = (
    (isViewingParent && messages.length === 0)
    || (activeChatId === 'teacher' && (teacherSession?.messages.length ?? 0) === 0)
    || (activeChatId === 'expert' && (expertSession?.messages.length ?? 0) === 0)
  )

  return (
    <div className="flex h-svh bg-background">
      {/* Sidebar */}
      <div className={cn('bg-white border-r border-gray-100 flex flex-col', 'w-full md:w-72 md:shrink-0', isMobileChat ? 'hidden md:flex' : 'flex')}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <ConfirmNavigationDialog
            title="離開遊戲？"
            description="離開後，目前的對話進度仍會保留在裝置上，下次從情境入口可繼續。任務紀錄與情緒狀態不會消失。"
            confirmLabel="確認離開"
            cancelLabel="繼續遊戲"
            onConfirm={() => router.push(`/scenario/${name}`)}
            trigger={
              <button type="button" className="text-muted hover:text-black transition-colors">
                <ArrowLeft size={18} />
              </button>
            }
          />
          <div>
            <p className="text-sm font-medium text-black">{scenario.title}</p>
            <p className="text-xs text-muted">Phase {currentPhase}</p>
          </div>
        </div>

        {/* Mission Panel (desktop) */}
        <div className="hidden p-3 border-b border-gray-50 space-y-2 md:block">
          {missionPanels.map(panel => (
            <MissionPanel key={panel.parentId} title={panel.title} missions={panel.missions} />
          ))}
        </div>

        {/* Mission Panel (mobile, collapsed by default) */}
        <div className="p-3 border-b border-gray-50 space-y-2 md:hidden">
          {missionPanels.map(panel => (
            <MissionPanel
              key={panel.parentId}
              title={panel.title}
              missions={panel.missions}
              defaultOpen={false}
            />
          ))}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            items={chatListItems}
            activeChatId={activeChatId}
            onSelectParent={handleSelectParent}
            onSelectTeacher={handleSelectTeacher}
            onSelectExpert={handleSelectExpert}
          />
        </div>

        <div className="p-3 border-t border-gray-100 space-y-2">
          <AlertDialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
            <AlertDialogTrigger asChild>
              <button type="button" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-background">
                完整事件介紹
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>{scenario.title}｜完整事件介紹</AlertDialogTitle>
                <AlertDialogDescription className="max-h-[50svh] overflow-y-auto whitespace-pre-line text-left">
                  {scenario.storyLine}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>關閉</AlertDialogCancel></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <ScoreEntryButton state="direct" phase={currentPhase} onConfirm={handleDirectGoToScore} />
        </div>

        {allMissionsDone && (
          <div className="p-3 border-t border-gray-100">
            <ScoreEntryButton state="ready" phase={currentPhase} onConfirm={handleGoToScore} />
          </div>
        )}
      </div>

      {/* Chatroom */}
      <div className={cn('flex-1 min-w-0 flex flex-col', activeChatId === 'expert' ? 'bg-white' : 'bg-[#E8EFF5]', !isMobileChat && 'hidden md:flex')}>
        {/* Chat header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => setIsMobileChat(false)} className="md:hidden text-muted hover:text-black transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className={cn('w-9 h-9 rounded-full flex items-center justify-center', chatHeader.avatarBg)}>
            <span className="text-white text-sm font-medium">{chatHeader.avatarText}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-black">{chatHeader.title}</p>
            <p className="text-xs text-muted">{chatHeader.subtitle}</p>
          </div>

          {/* Parent info button (only for parent chats) */}
          {isViewingParent && (
            <>
              <AlertDialog open={isParentInfoDialogOpen} onOpenChange={setIsParentInfoDialogOpen}>
                <AlertDialogTrigger asChild>
                  <button type="button" title="角色狀態與介紹" className="h-8 w-8 flex items-center justify-center rounded-md text-muted hover:text-black transition-colors">
                    <Info size={16} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{formatParentDisplayName(activeParentId)}｜角色狀態與介紹</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="max-h-[58svh] space-y-4 overflow-y-auto text-sm leading-relaxed text-black/80">
                    <section className="space-y-2 rounded-lg bg-background px-4 py-3">
                      <p className="text-xs font-medium tracking-widest text-muted">目前狀態</p>
                      <div className="space-y-1">
                        <p>階段：Phase {currentPhase}</p>
                        <p>在線狀態：{parentSession?.isOnline ? '在線' : '未上線'}</p>
                        <p>情緒狀態：{getPadTone(parentSession?.padState.pleasure ?? 0, '較願意合作', '相對平穩', '偏低落或不悅')}・{getPadTone(parentSession?.padState.arousal ?? 0, '情緒偏高', '情緒穩定', '較冷靜')}・{getPadTone(parentSession?.padState.dominance ?? 0, '主導感較強', '互動普通', '較被動')}</p>
                        <p>PAD：P {parentSession?.padState.pleasure ?? 0} / A {parentSession?.padState.arousal ?? 0} / D {parentSession?.padState.dominance ?? 0}</p>
                      </div>
                    </section>
                    <section className="space-y-2">
                      <p className="text-xs font-medium tracking-widest text-muted">角色介紹</p>
                      <div className="space-y-1">
                        <p>職業背景：{scenario.parents[activeParentId].occupation}</p>
                        <p>個性特徵：{scenario.parents[activeParentId].personality}</p>
                        <p>說話風格：{scenario.parents[activeParentId].speechStyle}</p>
                        <p>教養方式：{scenario.parents[activeParentId].parentingStyle}</p>
                        <p>核心動機：{scenario.parents[activeParentId].coreMotivation}</p>
                        <p>家庭背景：{scenario.parents[activeParentId].background}</p>
                        <p>初始認知：{scenario.parents[activeParentId].initialKnowledge}</p>
                      </div>
                    </section>
                    <section className="space-y-2">
                      <p className="text-xs font-medium tracking-widest text-muted">目前對話印象</p>
                      <div className="space-y-1">
                        <p>對事件理解：{parentSession?.memory.events || '目前還沒有明確整理。'}</p>
                        <p>對老師印象：{parentSession?.memory.teacherImpression || '目前還沒有形成明確印象。'}</p>
                      </div>
                    </section>
                  </div>
                  <AlertDialogFooter><AlertDialogAction onClick={() => setIsParentInfoDialogOpen(false)}>我了解了</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <ConfirmNavigationDialog
                title={`重置 ${formatParentDisplayName(activeParentId)}？`}
                description={`這會把目前對話重置到 Phase ${currentPhase} 一開始，這個家長在本階段的訊息、任務與評分會清空。`}
                confirmLabel="重置" cancelLabel="取消" onConfirm={handleRestartCurrentChat}
                trigger={
                  <button type="button" title="重置目前對話" className="text-muted hover:text-black transition-colors">
                    <RotateCcw size={16} />
                  </button>
                }
              />
              {allMissionsDone && <ScoreEntryButton state="ready" phase={currentPhase} compact onConfirm={handleGoToScore} />}
            </>
          )}

          {/* Teacher coordination status */}
          {activeChatId === 'teacher' && teacherSession && (
            <div className="flex gap-1">
              {teacherSession.coordinationMissions.map(m => (
                <span key={m.id} className={cn('text-[10px] px-1.5 py-0.5 rounded-md border', m.completed ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-muted bg-gray-50 border-gray-200')}>
                  {m.label.slice(0, 6)}…{m.completed ? '✓' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mobile mission panel */}
        <div className="p-3 border-b border-gray-50 md:hidden space-y-2">
          {activeMissionPanel && (
            <MissionPanel
              key={activeMissionPanel.parentId}
              title={activeMissionPanel.title}
              missions={activeMissionPanel.missions}
              defaultOpen={false}
            />
          )}
        </div>

        {/* Phase indicator (parent chats only) */}
        {isViewingParent && currentPhase === 1 && (
          <div className="mx-4 mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 text-center">
            Phase 1：請傳送訊息通知家長，對方目前未上線
          </div>
        )}

        {/* Expert info banner */}
        {activeChatId === 'expert' && (
          <div className="mx-4 mt-3 px-4 py-2 bg-[#FFF1F1] border border-[#FFD2D3] rounded-lg text-xs text-[#B93A3E] text-center">
            資深老師會根據所有聊天室的最新內容回覆你，回應較詳細，請耐心等候。
          </div>
        )}

        {/* Messages */}
        <div className={cn('flex-1 px-4 py-4 space-y-1', isMessagesEmpty && !isLoading ? 'overflow-y-hidden' : 'overflow-y-auto')}>
          {isMessagesEmpty && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted text-center">
                {activeChatId === 'teacher'
                  ? '等待李老師的訊息…'
                  : activeChatId === 'expert'
                  ? '資深老師正在準備中…'
                  : currentPhase === 1
                  ? '傳送第一則訊息給家長，讓他們了解今天發生的事情。'
                  : '家長即將上線…'}
              </p>
            </div>
          )}
          {renderMessages()}
          {isLoading && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', activeChatId === 'teacher' ? 'bg-emerald-600' : activeChatId === 'expert' ? 'bg-accent' : 'bg-secondary')}>
                <span className="text-white text-sm">
                  {activeChatId === 'teacher' ? scenario.teacher!.persona.name.slice(0, 1) : activeChatId === 'expert' ? '顧' : scenario.parents[activeParentId].name.slice(0, 1)}
                </span>
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-soft">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat tip (parent chats only) */}
        {isViewingParent && (
          <ChatTip
            scenarioName={name}
            difficulty={difficulty}
            parentId={activeParentId}
            phase={currentPhase}
            messages={messages}
            padState={parentSession?.padState ?? { pleasure: 0, arousal: 0, dominance: 0 }}
          />
        )}

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
          placeholder={
            activeChatId === 'teacher'
              ? '傳訊息給李老師…'
              : activeChatId === 'expert'
              ? '向資深老師提問…'
              : '輸入訊息給家長…'
          }
        />
      </div>
    </div>
  )
}
