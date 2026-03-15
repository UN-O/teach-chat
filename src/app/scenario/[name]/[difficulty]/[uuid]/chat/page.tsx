'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Info } from 'lucide-react'
import { useGameStore } from '@/store/game-store'
import { getScenarioConfig } from '@/data/scenarios'
import { getInitialTriggerMessage, getMissionLabels } from '@/services/ScenarioService'
import { calculateTDelay } from '@/services/GameEngineService'
import { ChatBubble } from '@/components/game/chat-bubble'
import { ChatInput } from '@/components/game/chat-input'
import { ChatList, getLastMessage, getUnreadCount } from '@/components/game/chat-list'
import { MissionPanel } from '@/components/game/mission-panel'
import type { ScenarioName, Difficulty, ParentId, Message, MissionItem } from '@/types'
import { cn } from '@/lib/utils'

const CHECK_MISSION_DEBOUNCE = 2000  // 2s after last message
const CHECK_SEND_INTERVAL = 15000   // 15s

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
  const setPhase = useGameStore(s => s.setPhase)
  const setPhaseDone = useGameStore(s => s.setPhaseDone)

  const [activeParentId, setActiveParentIdLocal] = useState<ParentId>('A')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileChat, setIsMobileChat] = useState(false)
  const [allMissionsDone, setAllMissionsDone] = useState(false)
  const [isCheckingMission, setIsCheckingMission] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const checkMissionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const checkSendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentPhase = session?.currentPhase ?? 1
  const parentSession = session?.parents[activeParentId]
  const messages = parentSession?.messages ?? []
  const missions: MissionItem[] = currentPhase === 1
    ? (parentSession?.phase1Missions ?? [])
    : (parentSession?.phase2Missions ?? [])

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

  // Check if all missions done
  useEffect(() => {
    const done = missions.length > 0 && missions.every(m => m.completed)
    setAllMissionsDone(done)
  }, [missions])

  // Phase 2: trigger initial message for each parent when they go online
  useEffect(() => {
    if (currentPhase !== 2 || !session) return

    const parent = session.parents[activeParentId]
    if (parent.isOnline || parent.messages.length > 0) return

    // Go online and send initial trigger message
    setParentOnline(activeParentId)
    const triggerMsg = getInitialTriggerMessage(scenario, activeParentId)
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: triggerMsg,
      timestamp: Date.now(),
    }
    addMessage(activeParentId, assistantMsg)
  }, [currentPhase, activeParentId, session, scenario, setParentOnline, addMessage])

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
    if (!inputValue.trim() || isLoading || !session) return

    const content = inputValue.trim()
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
      }
    }
  }

  const handleGoToScore = () => {
    setPhaseDone(activeParentId, currentPhase)
    router.push(`/scenario/${name}/${difficulty}/${params.uuid}/score/phase${currentPhase}`)
  }

  const handleSelectParent = (parentId: ParentId) => {
    setActiveParentIdLocal(parentId)
    setActiveParent(parentId)
    setIsMobileChat(true)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">找不到遊戲 session，請重新開始。</p>
      </div>
    )
  }

  const chatListItems = (['A', 'B'] as ParentId[]).map(pid => ({
    parentId: pid,
    name: scenario.parents[pid].name,
    avatar: scenario.parents[pid].name.slice(0, 1),
    lastMessage: getLastMessage(session.parents[pid].messages),
    unreadCount: getUnreadCount(session.parents[pid].messages),
    isOnline: session.parents[pid].isOnline,
    phase1Done: session.parents[pid].phase1Done,
  }))

  const missionLabels = getMissionLabels(scenario, activeParentId, currentPhase)
  const missionItems: MissionItem[] = missions.length > 0 ? missions : missionLabels.map(m => ({ ...m, completed: false }))

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar + Mobile list */}
      <div className={cn(
        'bg-white border-r border-gray-100 flex flex-col',
        'w-full md:w-72 md:flex-shrink-0',
        isMobileChat ? 'hidden md:flex' : 'flex',
      )}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <button
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
        <div className="p-3 border-b border-gray-50">
          <MissionPanel missions={missionItems} phase={currentPhase} />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            items={chatListItems}
            activeParentId={activeParentId}
            onSelect={handleSelectParent}
          />
        </div>

        {/* Phase done button */}
        {allMissionsDone && (
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={handleGoToScore}
              className="w-full py-2.5 bg-[#2A3D66] text-white rounded-lg text-sm font-medium hover:bg-[#1e2d4f] transition-colors"
            >
              Phase {currentPhase} 完成 → 進入評分
            </button>
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
          <div className="w-9 h-9 rounded-full bg-[#2A3D66] flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {scenario.parents[activeParentId].name.slice(0, 1)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-black">{scenario.parents[activeParentId].name}</p>
            <p className="text-xs text-muted">
              {parentSession?.isOnline ? '在線' : '未上線'}
            </p>
          </div>
          <button
            title="事件說明"
            className="text-muted hover:text-black transition-colors"
          >
            <Info size={18} />
          </button>
          {allMissionsDone && (
            <button
              onClick={handleGoToScore}
              className="px-3 py-1.5 bg-[#2A3D66] text-white rounded-lg text-xs font-medium hover:bg-[#1e2d4f] transition-colors"
            >
              完成評分 →
            </button>
          )}
        </div>

        {/* Phase indicator */}
        {currentPhase === 1 && (
          <div className="mx-4 mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 text-center">
            Phase 1：請傳送首訊通知家長，對方目前未上線
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
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
              <div className="w-9 h-9 rounded-full bg-[#2A3D66] flex items-center justify-center flex-shrink-0">
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
