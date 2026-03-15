'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game-store'
import { getScenarioConfig } from '@/data/scenarios'
import { ScoreCard, TotalScoreDisplay } from '@/components/game/score-card'
import { SkillRadarChart } from '@/components/game/radar-chart'
import type { ScenarioName, Difficulty, ScoreResult } from '@/types'

export default function FinalPage() {
  const params = useParams<{ name: string; difficulty: string; uuid: string }>()
  const router = useRouter()
  const clearSession = useGameStore(s => s.clearSession)

  const name = params.name as ScenarioName
  const difficulty = params.difficulty as Difficulty
  const scenario = getScenarioConfig(name, difficulty)

  const session = useGameStore(s => s.session)

  const allScores: ScoreResult[] = [
    ...(session?.parents.A.phase1Scores ?? []),
    ...(session?.parents.A.phase2Scores ?? []),
  ]

  const totalEarned = allScores.reduce((sum, s) => sum + s.score, 0)
  const totalMax = allScores.length * 4

  const gradePercent = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0
  const gradeLabel =
    gradePercent >= 85 ? '優秀' :
    gradePercent >= 70 ? '達標' :
    gradePercent >= 50 ? '待改進' :
    '需重練'

  const gradeColor =
    gradePercent >= 85 ? '#22c55e' :
    gradePercent >= 70 ? '#eab308' :
    gradePercent >= 50 ? '#f97316' :
    '#ef4444'

  const handleRestart = () => {
    clearSession()
    router.push(`/scenario/${name}`)
  }

  return (
    <main className="min-h-screen bg-background py-16 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-widest text-muted font-[var(--font-dm-sans)] uppercase mb-2">
            最終成績
          </p>
          <h1 className="font-[var(--font-chiron)] text-3xl font-bold text-black mb-2">
            你完成了這個情境！
          </h1>
          <p className="text-sm text-muted">{scenario.title} — {difficulty === 'basic' ? '初階' : '進階'}</p>
        </div>

        {/* Total Score */}
        <div className="mb-6 bg-white rounded-xl p-8 shadow-soft text-center">
          <p className="text-muted text-sm mb-1">總分</p>
          <p className="text-5xl font-bold text-black font-[var(--font-dm-sans)] mb-2">
            {totalEarned}
            <span className="text-xl text-muted font-normal">/{totalMax}</span>
          </p>
          <span
            className="text-lg font-semibold"
            style={{ color: gradeColor }}
          >
            {gradeLabel}
          </span>
        </div>

        {/* Radar Chart */}
        {allScores.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
            <p className="text-sm font-medium text-black mb-4">技巧雷達圖</p>
            <SkillRadarChart scores={allScores} label="技巧評分" />
          </div>
        )}

        {/* All Score Cards */}
        {allScores.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-black mb-4">各技巧詳細建議</h2>
            <div className="space-y-4">
              {allScores.map((score, i) => (
                <ScoreCard key={`${score.techniqueId}-${i}`} result={score} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended reading */}
        <div className="bg-[#B6D0E2]/20 rounded-xl p-6 mb-8">
          <p className="text-sm font-medium text-[#2A3D66] mb-3">延伸閱讀</p>
          <div className="space-y-2">
            {allScores
              .filter(s => s.score <= 2)
              .slice(0, 3)
              .map(s => (
                <div key={s.techniqueId} className="text-xs text-black/70">
                  →{' '}
                  <a
                    href={`/technique`}
                    className="text-[#4A90E2] hover:underline"
                  >
                    {s.techniqueId}：{s.techniqueName}
                  </a>
                </div>
              ))}
            {allScores.filter(s => s.score <= 2).length === 0 && (
              <p className="text-xs text-muted">表現優秀！繼續挑戰更高難度的情境。</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/scenario/${name}/${difficulty}/${params.uuid}/chat`)}
            className="w-full py-3.5 bg-[#2A3D66] text-white rounded-xl font-medium hover:bg-[#1e2d4f] transition-colors"
          >
            從 Phase 2 重新練習
          </button>
          <button
            onClick={handleRestart}
            className="w-full py-3.5 bg-white text-[#2A3D66] rounded-xl font-medium border border-[#2A3D66]/20 hover:bg-background transition-colors"
          >
            從頭重新開始
          </button>
          <button
            onClick={() => router.push('/scenario')}
            className="w-full py-3 text-muted text-sm hover:text-black transition-colors"
          >
            返回情境列表
          </button>
        </div>
      </div>
    </main>
  )
}
