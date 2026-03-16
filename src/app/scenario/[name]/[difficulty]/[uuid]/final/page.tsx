'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game-store'
import { ConfirmNavigationDialog } from '@/components/shared/confirm-navigation-dialog'
import { Button } from '@/components/ui/button'
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
  const lowScores = allScores.filter(s => s.score <= 2)

  const recommendedTechniques = lowScores.slice(0, 3).map(score => {
    const numericId = score.techniqueId.replace(/\D/g, '')
    const docId = numericId ? numericId.padStart(2, '0') : null
    const imageIndex = Number.parseInt(numericId, 10)
    const imageSrc = Number.isNaN(imageIndex)
      ? '/images/techniques/shared-cover.svg'
      : `/images/techniques/${imageIndex}.svg`

    return {
      ...score,
      href: docId ? `/docs/techniques/${docId}` : '/technique',
      imageSrc,
      imageAlt: `${score.techniqueName} 延伸閱讀封面`,
    }
  })

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
    <main className="min-h-svh bg-background py-16 px-6 md:px-16">
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
          <div className="space-y-3">
            {recommendedTechniques.map(s => (
              <Link
                key={s.techniqueId}
                href={s.href}
                className="group block overflow-hidden rounded-xl bg-white shadow-soft transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full bg-background/60">
                  <Image
                    src={s.imageSrc}
                    alt={s.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                </div>
                <div className="px-4 py-3 md:px-5 md:py-4">
                  <p className="text-[11px] tracking-wide text-muted font-[var(--font-dm-sans)] uppercase mb-1">
                    Recommended Reading
                  </p>
                  <p className="text-base font-medium text-black">
                    {s.techniqueId}：{s.techniqueName}
                  </p>
                  <p className="text-sm text-[#4A90E2] mt-1 group-hover:underline">
                    查看技巧文章 →
                  </p>
                </div>
              </Link>
            ))}
            {lowScores.length === 0 && (
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
          <ConfirmNavigationDialog
            title="重新開始這個情境？"
            description="重新開始會清除目前這一輪的練習 session，並回到情境入口。"
            confirmLabel="重新開始"
            onConfirm={handleRestart}
            trigger={
              <button
                type="button"
                className="w-full py-3.5 bg-white text-[#2A3D66] rounded-xl font-medium border border-[#2A3D66]/20 hover:bg-background transition-colors"
              >
                從頭重新開始
              </button>
            }
          />
          <button
            type="button"
            onClick={() => router.push('/scenario')}
            className="w-full py-3 text-muted text-sm hover:text-black transition-colors"
          >
            返回情境列表
          </button>
        </div>
          {/* Feedback floating button */}
          <div className="fixed right-4 bottom-6 md:right-8 md:bottom-8 z-50">
            <Button variant="secondary" asChild className="rounded-full p-3 shadow-md">
              <a
                href="https://forms.gle/zVYC78gu4ski3fXu6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="回饋表單"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#2A3D66]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v6a2 2 0 0 1-2 2H7l-4 2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6z" />
                </svg>
              </a>
            </Button>
          </div>
      </div>
    </main>
  )
}
