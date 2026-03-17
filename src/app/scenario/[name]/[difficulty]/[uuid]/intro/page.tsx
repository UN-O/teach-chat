'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { getScenarioConfig, getScenarioIntroSteps } from '@/data/scenarios'
import { useGameStore } from '@/store/game-store'
import type { ScenarioName, Difficulty } from '@/types'
import { cn } from '@/lib/utils'

export default function IntroPage() {
  const params = useParams<{ name: string; difficulty: string; uuid: string }>()
  const router = useRouter()
  const setGameState = useGameStore(s => s.setGameState)
  const session = useGameStore(s => s.session)

  const [step, setStep] = useState(0)
  const [eventFrameIndex, setEventFrameIndex] = useState(0)

  const name = params.name as ScenarioName
  const difficulty = params.difficulty as Difficulty
  const scenario = getScenarioConfig(name, difficulty)

  const playerName = session?.player.name ?? '老師'
  const playerAvatar = session?.player.avatar ?? 1

  const steps = getScenarioIntroSteps(name, difficulty, playerName, playerAvatar)

  const currentStep = steps[step]
  const isLast = step === steps.length - 1
  const isEventStep = (currentStep.frames?.length ?? 0) > 0
  const eventFrames = currentStep.frames ?? []
  const hasEventFrames = eventFrames.length > 0
  const currentEventFrame = hasEventFrames ? eventFrames[eventFrameIndex] : null
  const isEventLastFrame = hasEventFrames && eventFrameIndex === eventFrames.length - 1
  const currentImage = isEventStep ? currentEventFrame?.image : currentStep.image
  const currentContent = isEventStep && currentEventFrame ? currentEventFrame.caption : currentStep.content
  const hasStepImage = Boolean(currentImage)

  const handleNext = () => {
    if (isEventStep && hasEventFrames && !isEventLastFrame) {
      setEventFrameIndex(i => i + 1)
      return
    }

    if (isLast) {
      setGameState('interact')
      router.push(`/scenario/${params.name}/${params.difficulty}/${params.uuid}/chat`)
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <main className="h-svh overflow-y-auto bg-background flex flex-col items-center px-6 py-4 md:py-16 md:justify-center">
      <div className="w-full max-w-lg flex flex-col flex-1 md:flex-none">
        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-2 md:mb-10">
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
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 flex-1 min-h-0 md:flex-none md:min-h-[680px] md:max-h-[760px] flex flex-col">
          <h2 className="font-[var(--font-chiron)] text-xl font-bold text-black mb-5">
            {currentStep.label}
          </h2>

          {hasStepImage && (
            <div className="mb-4 md:mb-6">
              <div className="relative bg-background rounded-xl aspect-[4/5] w-full overflow-hidden flex items-center justify-center md:hidden">
                <Image
                  src={currentImage ?? ''}
                  alt={`${currentStep.label} 插圖`}
                  width={960}
                  height={540}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-x-3 bottom-3 bg-white rounded-lg px-4 py-3 shadow-md">
                  <div className="text-sm text-black/80 leading-relaxed whitespace-pre-line">
                    {currentContent.split('**').map((part, i) =>
                      i % 2 === 1
                        ? <strong key={i} className="font-semibold text-[#2A3D66]">{part}</strong>
                        : part
                    )}
                  </div>

                  {isEventStep && (
                    <p className="text-xs text-muted mt-2 text-right font-[var(--font-dm-sans)]">
                      事件分鏡 {eventFrameIndex + 1} / {eventFrames.length}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden md:flex bg-background rounded-xl aspect-[4/5] w-full overflow-hidden items-center justify-center md:max-w-[260px] md:mx-auto lg:max-w-[280px]">
                <Image
                  src={currentImage ?? ''}
                  alt={`${currentStep.label} 插圖`}
                  width={960}
                  height={540}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {isEventStep && (
                <p className="hidden md:block text-xs text-muted mt-2 text-right font-[var(--font-dm-sans)]">
                  事件分鏡 {eventFrameIndex + 1} / {eventFrames.length}
                </p>
              )}
            </div>
          )}

          <div className={cn(
            'text-sm text-black/80 leading-relaxed whitespace-pre-line flex-1 overflow-y-auto pr-1',
            hasStepImage && 'hidden md:block',
          )}>
            {currentContent.split('**').map((part, i) =>
              i % 2 === 1
                ? <strong key={i} className="font-semibold text-[#2A3D66]">{part}</strong>
                : part
            )}
          </div>

          <div className="flex items-center justify-between pt-4 mt-auto">
            {step > 0 ? (
              <button
                onClick={() => {
                  if (isEventStep && hasEventFrames && eventFrameIndex > 0) {
                    setEventFrameIndex(i => i - 1)
                    return
                  }

                  setStep(s => s - 1)
                }}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors"
              >
                上一步
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push(`/scenario/${params.name}`)}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors"
              >
                返回列表
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2A3D66] text-white rounded-lg text-sm font-medium hover:bg-[#1e2d4f] transition-colors"
            >
              {isLast ? '開始遊戲' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
