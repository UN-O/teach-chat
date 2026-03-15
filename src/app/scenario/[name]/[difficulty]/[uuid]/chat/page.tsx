'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Info, RotateCcw } from 'lucide-react'
import { useGameStore } from '@/store/game-store'
import { getScenarioConfig } from '@/data/scenarios'
import { ConfirmNavigationDialog } from '@/components/shared/confirm-navigation-dialog'
import { getInitialTriggerMessage, getMissionLabels } from '@/services/ScenarioService'
import { calculateTDelay } from '@/services/GameEngineService'
import { ChatBubble } from '@/components/game/chat-bubble'
import { ChatInput } from '@/components/game/chat-input'
import { ChatList, getLastMessage, getUnreadCount } from '@/components/game/chat-list'
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
import type { ScenarioName, Difficulty, ParentId, Message, MissionItem } from '@/types'
import { cn } from '@/lib/utils'

const CHECK_MISSION_DEBOUNCE = 2000  // 2s after last message
const CHECK_SEND_INTERVAL = 15000   // 15s
const SEND_GUARD_MS = 400
const DUPLICATE_CONTENT_GUARD_MS = 1500

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
  const setPhaseDone = useGameStore(s => s.setPhaseDone)
  const resetParentPhaseState = useGameStore(s => s.resetParentPhaseState)

  const [activeParentId, setActiveParentIdLocal] = useState<ParentId>('A')
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

  const currentPhase = session?.currentPhase ?? 1
  const parentSession = session?.parents[activeParentId]
  const messages = parentSession?.messages ?? []
  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when viewing chat
  useEffect(() => {
    if (parentSession && getUnreadCount(parentSession.messages) > 0) {
      markMessagesRead(activeParentId)
    }
  }, [activeParentId, parentSession, markMessagesRead])

  // Check if all current-phase missions are done across all parents
  useEffect(() => {
    if (!session) {
      setAllMissionsDone(false)
      return
    }

    const done = scenario.parentIds.every(pid => {
      const phaseMissions = currentPhase === 1
        ? session.parents[pid].phase1Missions
        : session.parents[pid].phase2Missions
      return phaseMissions.length > 0 && phaseMissions.every(m => m.completed)
    })

    setAllMissionsDone(done)
  }, [session, currentPhase, scenario])

  // Reset one-time phase2 auto trigger when session changes
  useEffect(() => {
    phase2AutoTriggerRef.current = { A: false, B: false }
  }, [session?.sessionId])

  // Phase 2: auto trigger once immediately when entering chat (per parent)
  useEffect(() => {
    if (currentPhase !== 2 || !session) return

    if (phase2AutoTriggerRef.current[activeParentId]) return

    const parent = session.parents[activeParentId]
    const phase2StartCount = parent.phase2StartSnapshot?.messages.length ?? 0
    const hasNewPhase2Messages = parent.messages.length > phase2StartCount

    if (hasNewPhase2Messages) {
      phase2AutoTriggerRef.current[activeParentId] = true
      return
    }

    phase2AutoTriggerRef.current[activeParentId] = true

    const runAutoTrigger = async () => {
      setParentOnline(activeParentId)
      updateLastCheckSend(activeParentId)

      try {
        const res = await fetch('/api/game/check-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioName: name,
            difficulty,
            parentId: activeParentId,
            phase: currentPhase,
            messages: parent.messages,
            padState: parent.padState,
            memory: parent.memory,
          }),
        })
        const data = await res.json() as { shouldSend: boolean; bubbles: string[] }

        if (data.bubbles.length > 0) {
          addPendingSeq(activeParentId, data.bubbles)
          return
        }
      } catch {
        // silently fail and fallback to deterministic trigger
      }

      const triggerMsg = getInitialTriggerMessage(scenario, activeParentId)
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: triggerMsg,
        timestamp: Date.now(),
      }
      addMessage(activeParentId, assistantMsg)
    }

    void runAutoTrigger()
  }, [
    currentPhase,
    session,
    activeParentId,
    name,
    difficulty,
    scenario,
    setParentOnline,
    updateLastCheckSend,
    addPendingSeq,
    addMessage,
  ])

  // Phase 2: Flush pending seq bubbles with 800ms gap
  useEffect(() => {
    if (currentPhase !== 2) return
    const seq = parentSession?.pendingSeq ?? []
    if (seq.length === 0) return

    const timer = setTimeout(() => {
      const bubble = flushNextBubble(activeParentId)
      if (bubble) {
        const msg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: bubble,
          timestamp: Date.now(),
        }
        addMessage(activeParentId, msg)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [currentPhase, parentSession?.pendingSeq, flushNextBubble, addMessage, activeParentId])

  // Phase 2: checkSend every 15s
  useEffect(() => {
    if (currentPhase !== 2 || !parentSession?.isOnline) return

    const runCheckSend = async () => {
      if (!session) return
      const arousal = parentSession.padState.arousal
      const probability = (arousal + 5) / 10
      if (Math.random() > probability) return

      updateLastCheckSend(activeParentId)

      try {
        const res = await fetch('/api/game/check-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioName: name,
            difficulty,
            parentId: activeParentId,
            phase: currentPhase,
            messages: parentSession.messages,
            padState: parentSession.padState,
            memory: parentSession.memory,
          }),
        })
        const data = await res.json() as { shouldSend: boolean; bubbles: string[] }
        if (data.shouldSend && data.bubbles.length > 0) {
          addPendingSeq(activeParentId, data.bubbles)
        }
      } catch {
        // silently fail
      }
    }

    checkSendIntervalRef.current = setInterval(runCheckSend, CHECK_SEND_INTERVAL)
    return () => {
      if (checkSendIntervalRef.current) clearInterval(checkSendIntervalRef.current)
    }
  }, [currentPhase, activeParentId, parentSession?.isOnline, session, name, difficulty, parentSession, updateLastCheckSend, addPendingSeq])

  // Background checkMission after teacher sends a message
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
        body: JSON.stringify({
          scenarioName: name,
          difficulty,
          parentId,
          phase: currentPhase,
          messages: msgs,
          currentMissions,
        }),
      })
      const data = await res.json() as { missions: MissionItem[] }
      updateMissions(parentId, currentPhase, data.missions)
    } catch {
      // silently fail
    } finally {
      setIsCheckingMission(false)
    }
  }, [isCheckingMission, session, currentPhase, name, difficulty, updateMissions])

  const handleSendMessage = async () => {
    const now = Date.now()
    if (isSubmittingRef.current) return
    if (now - lastSubmitAtRef.current < SEND_GUARD_MS) return
    if (!inputValue.trim() || isLoading || !session) return

    const content = inputValue.trim()
    const lastSubmitted = lastSubmittedContentRef.current
    if (
      lastSubmitted &&
      lastSubmitted.content === content &&
      lastSubmitted.parentId === activeParentId &&
      lastSubmitted.phase === currentPhase &&
      now - lastSubmitted.at < DUPLICATE_CONTENT_GUARD_MS
    ) {
      return
    }

    isSubmittingRef.current = true
    lastSubmitAtRef.current = now
    lastSubmittedContentRef.current = {
      content,
      at: now,
      parentId: activeParentId,
      phase: currentPhase,
    }
    setInputValue('')

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    addMessage(activeParentId, userMsg)

    // Schedule background mission check
    if (checkMissionTimerRef.current) clearTimeout(checkMissionTimerRef.current)
    checkMissionTimerRef.current = setTimeout(() => {
      const updatedMessages = [...messages, userMsg]
      triggerCheckMission(activeParentId, updatedMessages)
    }, CHECK_MISSION_DEBOUNCE)

    // Phase 2: Generate parent response
    if (currentPhase === 2 && parentSession?.isOnline) {
      setIsLoading(true)
      const tDelay = calculateTDelay(parentSession.padState.arousal)

      await new Promise(resolve => setTimeout(resolve, tDelay))

      try {
        const res = await fetch('/api/game/check-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioName: name,
            difficulty,
            parentId: activeParentId,
            phase: currentPhase,
            messages: [...messages, userMsg],
            padState: parentSession.padState,
            memory: parentSession.memory,
          }),
        })
        const data = await res.json() as { shouldSend: boolean; bubbles: string[] }
        if (data.bubbles.length > 0) {
          addPendingSeq(activeParentId, data.bubbles)
        }

        // Update PAD & memory in background
        fetch('/api/game/update-pad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioName: name,
            difficulty,
            parentId: activeParentId,
            currentPAD: parentSession.padState,
            currentMemory: parentSession.memory,
            messages: [...messages, userMsg],
          }),
        }).catch(() => {})
      } catch {
        // silently fail
      } finally {
        setIsLoading(false)
        isSubmittingRef.current = false
      }
      return
    }

    isSubmittingRef.current = false
  }

  const goToScorePage = () => {
    router.push(`/scenario/${name}/${difficulty}/${params.uuid}/score/phase${currentPhase}`)
  }

  const handleGoToScore = () => {
    scenario.parentIds.forEach(pid => {
      setPhaseDone(pid, currentPhase)
    })
    goToScorePage()
  }

  const handleDirectGoToScore = () => {
    goToScorePage()
  }

  const handleSelectParent = (parentId: ParentId) => {
    setActiveParentIdLocal(parentId)
    setActiveParent(parentId)
    setIsMobileChat(true)
  }

  const handleRestartCurrentChat = () => {
    if (checkMissionTimerRef.current) {
      clearTimeout(checkMissionTimerRef.current)
      checkMissionTimerRef.current = null
    }
    setInputValue('')
    setIsLoading(false)
    isSubmittingRef.current = false
    resetParentPhaseState(activeParentId, currentPhase)
  }

  const formatParentDisplayName = (parentId: ParentId) => {
    const parent = scenario.parents[parentId]
    return parent.childRelationLabel
      ? `${parent.name}（${parent.childRelationLabel}）`
      : parent.name
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

  const chatListItems = scenario.parentIds.map(pid => ({
    parentId: pid,
    name: formatParentDisplayName(pid),
    avatar: scenario.parents[pid].name.slice(0, 1),
    lastMessage: getLastMessage(session.parents[pid].messages),
    unreadCount: getUnreadCount(session.parents[pid].messages),
    isOnline: session.parents[pid].isOnline,
    phase1Done: session.parents[pid].phase1Done,
  }))

  const missionPanels = scenario.parentIds.map(pid => {
    const parentMissions = currentPhase === 1
      ? session.parents[pid].phase1Missions
      : session.parents[pid].phase2Missions
    const parentMissionLabels = getMissionLabels(scenario, pid, currentPhase)
    const items: MissionItem[] = parentMissions.length > 0
      ? parentMissions
      : parentMissionLabels.map(m => ({ ...m, completed: false }))

    return {
      parentId: pid,
      title: `${formatParentDisplayName(pid)} 任務`,
      missions: items,
    }
  })

  return (
    <div className="flex h-svh bg-background">
      {/* Desktop sidebar + Mobile list */}
      <div className={cn(
        'bg-white border-r border-gray-100 flex flex-col',
        'w-full md:w-72 md:shrink-0',
        isMobileChat ? 'hidden md:flex' : 'flex',
      )}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/scenario/${name}`)}
            className="text-muted hover:text-black transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-sm font-medium text-black">{scenario.title}</p>
            <p className="text-xs text-muted">Phase {currentPhase}</p>
          </div>
        </div>

        {/* Mission Panel */}
        <div className="p-3 border-b border-gray-50 space-y-2">
          {missionPanels.map(panel => (
            <MissionPanel
              key={panel.parentId}
              title={panel.title}
              missions={panel.missions}
            />
          ))}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            items={chatListItems}
            activeParentId={activeParentId}
            onSelect={handleSelectParent}
          />
        </div>

        <div className="p-3 border-t border-gray-100 space-y-2">
          <AlertDialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-background"
              >
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
              <AlertDialogFooter>
                <AlertDialogCancel>關閉</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <ScoreEntryButton
            state="direct"
            phase={currentPhase}
            onConfirm={handleDirectGoToScore}
          />
        </div>

        {/* Phase done button */}
        {allMissionsDone && (
          <div className="p-3 border-t border-gray-100">
            <ScoreEntryButton
              state="ready"
              phase={currentPhase}
              onConfirm={handleGoToScore}
            />
          </div>
        )}
      </div>

      {/* Chatroom */}
      <div className={cn(
        'flex-1 flex flex-col bg-[#E8EFF5]',
        !isMobileChat && 'hidden md:flex',
      )}>
        {/* Chat header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => setIsMobileChat(false)}
            className="md:hidden text-muted hover:text-black transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {scenario.parents[activeParentId].name.slice(0, 1)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-black">{formatParentDisplayName(activeParentId)}</p>
            <p className="text-xs text-muted">
              {parentSession?.isOnline ? '在線' : '未上線'}
            </p>
          </div>
          <AlertDialog open={isParentInfoDialogOpen} onOpenChange={setIsParentInfoDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                title="角色狀態與介紹"
                className="h-8 w-8 flex items-center justify-center rounded-md text-muted hover:text-black transition-colors"
              >
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
                    <p>
                      情緒狀態：
                      {getPadTone(parentSession?.padState.pleasure ?? 0, '較願意合作', '相對平穩', '偏低落或不悅')}
                      ・
                      {getPadTone(parentSession?.padState.arousal ?? 0, '情緒偏高', '情緒穩定', '較冷靜')}
                      ・
                      {getPadTone(parentSession?.padState.dominance ?? 0, '主導感較強', '互動普通', '較被動')}
                    </p>
                    <p>
                      PAD：P {parentSession?.padState.pleasure ?? 0} / A {parentSession?.padState.arousal ?? 0} / D {parentSession?.padState.dominance ?? 0}
                    </p>
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
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsParentInfoDialogOpen(false)}>我了解了</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <ConfirmNavigationDialog
            title={`重置 ${formatParentDisplayName(activeParentId)}？`}
            description={`這會把目前對話重置到 Phase ${currentPhase} 一開始，這個家長在本階段的訊息、任務與評分會清空。`}
            confirmLabel="重置"
            cancelLabel="取消"
            onConfirm={handleRestartCurrentChat}
            trigger={
              <button
                type="button"
                title="重置目前對話"
                className="text-muted hover:text-black transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            }
          />
          {allMissionsDone && (
            <ScoreEntryButton
              state="ready"
              phase={currentPhase}
              compact
              onConfirm={handleGoToScore}
            />
          )}
        </div>

        {/* Mobile mission panel */}
        <div className="p-3 border-b border-gray-50 md:hidden space-y-2">
          {missionPanels.map(panel => (
            <MissionPanel
              key={panel.parentId}
              title={panel.title}
              missions={panel.missions}
            />
          ))}
        </div>

        {/* Phase indicator */}
        {currentPhase === 1 && (
          <div className="mx-4 mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 text-center">
            Phase 1：請傳送首訊通知家長，對方目前未上線
          </div>
        )}

        {/* Messages */}
        <div
          className={cn(
            'flex-1 px-4 py-4 space-y-1',
            messages.length === 0 && !isLoading ? 'overflow-y-hidden' : 'overflow-y-auto',
          )}
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted text-center">
                {currentPhase === 1
                  ? '傳送第一則訊息給家長，讓他們了解今天發生的事情。'
                  : '家長即將上線…'}
              </p>
            </div>
          )}
          {messages.map(msg => (
            <ChatBubble
              key={msg.id}
              content={msg.content}
              role={msg.role}
              isRead={msg.isRead}
              timestamp={msg.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="text-white text-sm">{scenario.parents[activeParentId].name.slice(0, 1)}</span>
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

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
          placeholder="輸入訊息給家長…"
        />
      </div>
    </div>
  )
}
