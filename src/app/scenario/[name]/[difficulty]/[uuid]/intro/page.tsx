'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getScenarioConfig } from '@/data/scenarios'
import { useGameStore } from '@/store/game-store'
import type { ScenarioName, Difficulty } from '@/types'
import { cn } from '@/lib/utils'

const introSteps = [
  { label: '事件發生', emoji: '⚡' },
  { label: '老師面對的挑戰', emoji: '😰' },
  { label: '你的任務', emoji: '📱' },
]

export default function IntroPage() {
  const params = useParams<{ name: string; difficulty: string; uuid: string }>()
  const router = useRouter()
  const setGameState = useGameStore(s => s.setGameState)
  const session = useGameStore(s => s.session)

  const [step, setStep] = useState(0)

  const name = params.name as ScenarioName
  const difficulty = params.difficulty as Difficulty
  const scenario = getScenarioConfig(name, difficulty)

  const playerName = session?.player.name ?? '老師'

  const steps = [
    {
      label: introSteps[0].label,
      emoji: introSteps[0].emoji,
      content: scenario.storyLine,
    },
    {
      label: introSteps[1].label,
      emoji: introSteps[1].emoji,
      content: `${playerName} 老師，放學前你需要透過 LINE 通知家長今天發生的事情。\n\n這不是一件容易的事——你需要讓家長知道發生了什麼，同時保持冷靜、不激化情緒、不在 LINE 上定責，還要給家長安心感。`,
    },
    {
      label: introSteps[2].label,
      emoji: introSteps[2].emoji,
      content: `本次訓練共分兩個關卡：\n\n**Phase 1**：你主動傳送首訊給家長。這個階段家長還沒回應，你需要把必要資訊都說清楚。\n\n**Phase 2**：家長開始回覆，你需要應對他們的問題和情緒。\n\n完成每個關卡後，系統會根據你的溝通技巧給你評分。加油！`,
    },
  ]

  const currentStep = steps[step]
  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      setGameState('interact')
      router.push(`/scenario/${params.name}/${params.difficulty}/${params.uuid}/chat`)
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-8 bg-[#2A3D66]' : i < step ? 'w-4 bg-[#2A3D66]/40' : 'w-4 bg-gray-200',
              )}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
          <div className="text-4xl mb-4">{currentStep.emoji}</div>
          <h2 className="font-[var(--font-chiron)] text-xl font-bold text-black mb-5">
            {currentStep.label}
          </h2>
          <div className="text-sm text-black/80 leading-relaxed whitespace-pre-line mb-8">
            {currentStep.content.split('**').map((part, i) =>
              i % 2 === 1
                ? <strong key={i} className="font-semibold text-[#2A3D66]">{part}</strong>
                : part
            )}
          </div>

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors"
              >
                <ArrowLeft size={14} />
                上一步
              </button>
            ) : (
              <button
                onClick={() => router.push(`/scenario/${params.name}`)}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors"
              >
                <ArrowLeft size={14} />
                返回列表
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2A3D66] text-white rounded-lg text-sm font-medium hover:bg-[#1e2d4f] transition-colors"
            >
              {isLast ? '開始遊戲' : '下一步'}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
