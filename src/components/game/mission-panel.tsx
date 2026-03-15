'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MissionItem } from '@/types'

interface MissionPanelProps {
  missions: MissionItem[]
  phase: 1 | 2
}

export function MissionPanel({ missions, phase }: MissionPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const completedCount = missions.filter(m => m.completed).length
  const allDone = completedCount === missions.length

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden border transition-colors',
        allDone ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white',
      )}
    >
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-black">
            Phase {phase} 任務
          </span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-md font-medium',
              allDone
                ? 'bg-green-100 text-green-700'
                : 'bg-[#B6D0E2]/50 text-[#2A3D66]',
            )}
          >
            {completedCount}/{missions.length}
          </span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-3 space-y-2">
          {missions.map(mission => (
            <div key={mission.id} className="flex items-start gap-2">
              {mission.completed
                ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                : <Circle size={16} className="text-gray-300 flex-shrink-0 mt-0.5" />
              }
              <span
                className={cn(
                  'text-xs leading-relaxed',
                  mission.completed ? 'text-green-700 line-through' : 'text-black',
                )}
              >
                {mission.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
