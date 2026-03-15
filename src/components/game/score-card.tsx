import { cn } from '@/lib/utils'
import type { ScoreResult } from '@/types'

const scoreBadge: Record<number, { label: string; className: string }> = {
  4: { label: '優秀 4', className: 'bg-green-100 text-green-700' },
  3: { label: '達標 3', className: 'bg-yellow-100 text-yellow-700' },
  2: { label: '待改進 2', className: 'bg-orange-100 text-orange-700' },
  1: { label: '需重練 1', className: 'bg-red-100 text-red-700' },
}

interface ScoreCardProps {
  result: ScoreResult
}

export function ScoreCard({ result }: ScoreCardProps) {
  const badge = scoreBadge[result.score]

  return (
    <div className="bg-white rounded-xl p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs text-muted font-[var(--font-dm-sans)]">{result.techniqueId}</span>
          <h3 className="text-sm font-medium text-black mt-0.5">{result.techniqueName}</h3>
        </div>
        <span className={cn('text-xs px-2.5 py-1 rounded-md font-medium flex-shrink-0', badge.className)}>
          {badge.label}
        </span>
      </div>
      <p className="text-sm text-black leading-relaxed mb-2">{result.feedback}</p>
      {result.score < 4 && (
        <p className="text-xs text-[#4A90E2] leading-relaxed border-l-2 border-[#4A90E2]/30 pl-3">
          {result.suggestion}
        </p>
      )}
    </div>
  )
}

export function TotalScoreDisplay({
  scores,
  totalPossible,
}: {
  scores: ScoreResult[]
  totalPossible: number
}) {
  const earned = scores.reduce((sum, s) => sum + s.score, 0)
  const maxEarnable = scores.length * 4

  const percentage = maxEarnable > 0 ? Math.round((earned / maxEarnable) * 100) : 0

  const gradeLabel =
    percentage >= 85 ? '優秀' :
    percentage >= 70 ? '達標' :
    percentage >= 50 ? '待改進' :
    '需重練'

  const gradeClass =
    percentage >= 85 ? 'text-green-600' :
    percentage >= 70 ? 'text-yellow-600' :
    percentage >= 50 ? 'text-orange-600' :
    'text-red-600'

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft text-center">
      <p className="text-muted text-sm mb-1">本階段總分</p>
      <p className="text-4xl font-bold text-black font-[var(--font-dm-sans)] mb-1">
        {earned}
        <span className="text-lg text-muted font-normal">/{maxEarnable}</span>
      </p>
      <p className={cn('text-lg font-medium', gradeClass)}>{gradeLabel}</p>
    </div>
  )
}
