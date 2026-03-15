'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { getScenarioConfig, scenarioMeta } from '@/data/scenarios'
import type { ScenarioName, Difficulty } from '@/types'

export default function ScenarioIntroPage() {
  const params = useParams<{ name: string }>()
  const router = useRouter()
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('basic')

  const name = params.name as ScenarioName
  const meta = scenarioMeta[name]

  if (!meta) return null

  const scenario = getScenarioConfig(name, selectedDifficulty)

  const handleStart = () => {
    const uuid = crypto.randomUUID()
    router.push(`/scenario/${name}/${selectedDifficulty}/${uuid}/init`)
  }

  return (
    <main className="min-h-svh bg-background py-16 px-6 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => router.push('/scenario')}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            返回情境列表
          </button>

          <div className="mb-8">
            <p className="text-xs tracking-widest text-muted font-[var(--font-dm-sans)] uppercase mb-3">
              情境模擬
            </p>
            <h1 className="font-[var(--font-chiron)] text-4xl font-bold text-black mb-4">
              {meta.title}
            </h1>
            <p className="text-base text-black/70 leading-relaxed max-w-[55ch]">
              {meta.description}
            </p>
          </div>
        </div>

        <div className="mb-8 mx-auto max-w-3xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-4xl">
            <Image
              src={meta.image}
              alt={`${meta.title}情境主圖`}
              fill
              sizes="(min-width: 1280px) 80rem, 100vw"
              className="block h-full w-full object-cover scale-x-[1.06]"
              priority
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl">

        {/* Difficulty Tabs */}
        <div className="flex gap-2 mb-6">
          {(['basic', 'advanced'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === d
                  ? 'bg-[#2A3D66] text-white'
                  : 'bg-white text-muted hover:text-black'
              }`}
            >
              {d === 'basic' ? '初階' : '進階'}
            </button>
          ))}
        </div>

        {/* Scenario Card */}
        <div className="bg-white rounded-xl p-8 shadow-soft mb-6">
          <h2 className="font-[var(--font-chiron)] text-xl font-bold text-black mb-4">
            {scenario.title}
          </h2>

          <div className="mb-6">
            <p className="text-xs text-muted mb-2 font-[var(--font-dm-sans)]">劇情簡介</p>
            <p className="text-sm text-black/80 leading-relaxed">{scenario.storyLine}</p>
          </div>

          <div className="mb-6">
            <p className="text-xs text-muted mb-3 font-[var(--font-dm-sans)]">練習技巧</p>
            <div className="flex flex-wrap gap-2">
              {scenario.techniques.map(t => (
                <span
                  key={t.id}
                  className="text-xs px-2.5 py-1 rounded-md bg-[#B6D0E2]/30 text-[#2A3D66]"
                >
                  #{t.id} {t.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted mb-3 font-[var(--font-dm-sans)]">互動對象</p>
            <div className={`grid gap-4 ${scenario.parentIds.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {scenario.parentIds.map(parentId => {
                const parent = scenario.parents[parentId]
                return (
                  <div key={parentId} className="bg-background rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-[#2A3D66] flex items-center justify-center mb-2">
                      <span className="text-white text-base font-medium">{parent.name.slice(0, 1)}</span>
                    </div>
                    <p className="text-sm font-medium text-black">{parent.name}</p>
                    <p className="text-xs text-muted leading-relaxed mt-0.5">{parent.occupation}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-[#2A3D66] text-white rounded-xl font-medium hover:bg-[#1e2d4f] transition-colors"
        >
          開始練習 →
        </button>
        </div>
      </div>
    </main>
  )
}
