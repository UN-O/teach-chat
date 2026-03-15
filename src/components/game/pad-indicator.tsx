import { cn } from '@/lib/utils'
import type { PADState } from '@/types'

interface PADIndicatorProps {
  pad: PADState
  className?: string
}

function getDotColor(value: number): string {
  if (value >= 2) return 'bg-green-400'
  if (value >= 0) return 'bg-yellow-400'
  if (value >= -2) return 'bg-orange-400'
  return 'bg-red-500'
}

export function PADIndicator({ pad, className }: PADIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)} title={`P:${pad.pleasure} A:${pad.arousal} D:${pad.dominance}`}>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted">P</span>
        <div className={cn('w-2 h-2 rounded-full', getDotColor(pad.pleasure))} />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted">A</span>
        <div className={cn('w-2 h-2 rounded-full', getDotColor(-pad.arousal))} />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted">D</span>
        <div className={cn('w-2 h-2 rounded-full', getDotColor(-pad.dominance))} />
      </div>
    </div>
  )
}
