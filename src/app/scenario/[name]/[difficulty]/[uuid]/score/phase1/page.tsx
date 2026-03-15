'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useGameStore } from '@/store/game-store'
import { ConfirmNavigationDialog } from '@/components/shared/confirm-navigation-dialog'
import { getScenarioConfig } from '@/data/scenarios'
import { ScoreCard, TotalScoreDisplay } from '@/components/game/score-card'
import { SkillRadarChart } from '@/components/game/radar-chart'
import type { ScenarioName, Difficulty, ParentId, ScoreResult } from '@/types'

export default function Phase1ScorePage() {
  const params = useParams<{ name: string; difficulty: string; uuid: string }>()
  const router = useRouter()

  const name = params.name as ScenarioName
  const difficulty = params.difficulty as Difficulty

  const session = useGameStore(s => s.session)
  const setPhaseScores = useGameStore(s => s.setPhaseScores)
  const setPhase = useGameStore(s => s.setPhase)
  const setParentOnline = useGameStore(s => s.setParentOnline)
  const resetParentPhaseState = useGameStore(s => s.resetParentPhaseState)

  const [scores, setScores] = useState<ScoreResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeParentForScore] = useState<ParentId>('A')

  const scenario = getScenarioConfig(name, difficulty)

  useEffect(() => {
    if (!session) return
    const existing = session.parents[activeParentForScore].phase1Scores
    if (existing.length > 0) {
      setScores(existing)
      setIsLoading(false)
      return
    }

    const messages = session.parents[activeParentForScore].messages
    if (messages.length === 0) {
      setIsLoading(false)
      return
    }

    fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioName: name,
        difficulty,
        parentId: activeParentForScore,
        phase: 1,
        messages,
      }),
    })
      .then(r => r.json() as Promise<{ scores: ScoreResult[] }>)
      .then(data => {
        setScores(data.scores)
        setPhaseScores(activeParentForScore, 1, data.scores)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [session, name, difficulty, activeParentForScore, setPhaseScores])

  const handleNextPhase = () => {
    setParentOnline('A')
    setParentOnline('B')
    setPhase(2)
    router.push(`/scenario/${name}/${difficulty}/${params.uuid}/chat`)
  }

  const handleRetryPhase1 = () => {
    resetParentPhaseState('A', 1)
    resetParentPhaseState('B', 1)
    setPhase(1)
    router.push(`/scenario/${name}/${difficulty}/${params.uuid}/chat`)
  }

  return (
    <main className="min-h-svh bg-background py-16 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">
        <ConfirmNavigationDialog
          title="回到聊天頁？"
          description="離開評分頁後，這次評分結果仍會保留，但你會先回到目前的對話流程。"
          confirmLabel="回到聊天"
          onConfirm={() => router.push(`/scenario/${name}/${difficulty}/${params.uuid}/chat`)}
          trigger={
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors mb-10"
            >
              <ArrowLeft size={14} />
              回到聊天
            </button>
          }
        />

        <div className="mb-8">
          <p className="text-xs tracking-widest text-muted font-(--font-dm-sans) uppercase mb-2">
            Phase 1 結算
          </p>
          <h1 className="font-(--font-chiron) text-3xl text-black">
            首訊通知評分
          </h1>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl p-10 shadow-soft text-center">
            <div className="flex justify-center gap-1.5 mb-3">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="text-sm text-muted">AI 正在評分中，請稍候…</p>
          </div>
        ) : scores.length > 0 ? (
          <>
            <div className="mb-6">
              <TotalScoreDisplay scores={scores} totalPossible={scenario.scoring.totalScore} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
              <SkillRadarChart scores={scores} label="Phase 1 技巧" />
            </div>

            <div className="space-y-4 mb-10">
              {scores.map(score => (
                <ScoreCard key={score.techniqueId} result={score} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-soft text-center text-muted text-sm mb-10">
            無法取得評分，請確認對話內容後重試。
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleNextPhase}
            className="w-full py-3.5 bg-secondary text-white rounded-xl font-medium hover:bg-[#1e2d4f] transition-colors"
          >
            進入 Phase 2 →
          </button>
          <button
            onClick={handleRetryPhase1}
            className="w-full py-3.5 bg-white text-secondary rounded-xl font-medium border border-secondary/20 hover:bg-background transition-colors"
          >
            再練一次 Phase 1
          </button>
          <button
            type="button"
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
