'use client'

import { useState, useCallback } from 'react'
import { Lightbulb, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScenarioName, Difficulty, ParentId, Phase, PADState, Message } from '@/types'

interface ChatTipProps {
  scenarioName: ScenarioName
  difficulty: Difficulty
  parentId: ParentId
  phase: Phase
  messages: Message[]
  padState: PADState
}

export function ChatTip({ scenarioName, difficulty, parentId, phase, messages, padState }: ChatTipProps) {
  const [tip, setTip] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchTip = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/game/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioName, difficulty, parentId, phase, messages, padState }),
      })
      const data = await res.json() as { direction: string }
      setTip(data.direction)
      setHasLoaded(true)
    } catch {
      // silently fail
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, scenarioName, difficulty, parentId, phase, messages, padState])

  if (!hasLoaded) {
    return (
      <div className="px-4 p-2">
        <button
          type="button"
          onClick={fetchTip}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-1.5 text-xs text-muted hover:text-[#2A3D66] transition-colors',
            isLoading && 'opacity-50 cursor-not-allowed',
          )}
        >
          <Lightbulb size={13} />
          {isLoading ? '思考中…' : '取得回覆建議'}
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 p-2">
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <Lightbulb size={13} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="flex-1 text-xs text-amber-800 leading-relaxed">{tip}</p>
        <button
          type="button"
          onClick={fetchTip}
          disabled={isLoading}
          title="重新產生建議"
          className={cn(
            'shrink-0 text-amber-400 hover:text-amber-600 transition-colors',
            isLoading && 'opacity-50 cursor-not-allowed',
          )}
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  )
}
