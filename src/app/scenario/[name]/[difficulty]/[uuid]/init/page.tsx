'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useGameStore } from '@/store/game-store'
import type { ScenarioName, Difficulty, PlayerAvatar, EducationLevel, TeacherRole, PlayerProfile } from '@/types'
import { cn } from '@/lib/utils'

const avatarSrc: Record<PlayerAvatar, string> = {
  1: '/images/avatars/1.svg',
  2: '/images/avatars/2.svg',
  3: '/images/avatars/3.svg',
  4: '/images/avatars/4.svg',
}

const educationOptions: { value: EducationLevel; label: string }[] = [
  { value: 'elementary', label: '國小' },
  { value: 'middle', label: '國中' },
]

const roleOptions: { value: TeacherRole; label: string }[] = [
  { value: 'intern', label: '實習老師' },
  { value: 'parttime', label: '兼課老師' },
  { value: 'substitute', label: '代課老師' },
  { value: 'full', label: '正式老師' },
]

export default function InitPage() {
  const params = useParams<{ name: string; difficulty: string; uuid: string }>()
  const router = useRouter()
  const initSession = useGameStore(s => s.initSession)

  const [avatar, setAvatar] = useState<PlayerAvatar>(1)
  const [name, setName] = useState('')
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('elementary')
  const [role, setRole] = useState<TeacherRole>('full')

  const handleStart = () => {
    if (!name.trim()) return

    const player: PlayerProfile = { avatar, name: name.trim(), educationLevel, role }
    initSession(
      params.name as ScenarioName,
      params.difficulty as Difficulty,
      player,
    )
    router.push(`/scenario/${params.name}/${params.difficulty}/${params.uuid}/intro`)
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 md:p-10 w-full max-w-md">
        <h1 className="font-[var(--font-chiron)] text-2xl font-bold text-black mb-2">
          設定你的角色
        </h1>
        <p className="text-sm text-muted mb-5 sm:mb-8">選擇頭像並填入你的資料，開始練習前的準備。</p>

        {/* Avatar */}
        <div className="mb-5 sm:mb-6">
          <p className="text-xs text-muted mb-3 font-[var(--font-dm-sans)]">選擇頭像</p>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setAvatar(a => (a === 1 ? 4 : (a - 1) as PlayerAvatar))}
              className="p-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-muted" />
            </button>
            <div className="relative aspect-square w-full max-w-48 sm:max-w-56 md:max-w-64 rounded-2xl bg-background ring-2 ring-secondary overflow-hidden">
              <Image
                src={avatarSrc[avatar]}
                alt={`avatar ${avatar}`}
                fill
                sizes="(max-width: 640px) calc(100vw - 10rem), 16rem"
                className="h-full w-full object-contain"
              />
            </div>
            <button
              onClick={() => setAvatar(a => (a === 4 ? 1 : (a + 1) as PlayerAvatar))}
              className="p-2 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-muted" />
            </button>
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {([1, 2, 3, 4] as PlayerAvatar[]).map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  avatar === a ? 'bg-secondary' : 'bg-gray-300',
                )}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-5 sm:mb-6">
          <label className="text-xs text-muted font-[var(--font-dm-sans)] block mb-2">你的名字</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="王老師"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2A3D66] focus:ring-1 focus:ring-[#2A3D66]/20 transition-colors"
          />
        </div>

        {/* Education Level */}
        <div className="mb-5 sm:mb-6">
          <p className="text-xs text-muted mb-3 font-[var(--font-dm-sans)]">教育場域</p>
          <div className="flex gap-2">
            {educationOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setEducationLevel(opt.value)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                  educationLevel === opt.value
                    ? 'bg-[#2A3D66] text-white'
                    : 'bg-background text-muted hover:text-black',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs text-muted mb-3 font-[var(--font-dm-sans)]">身份</p>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setRole(opt.value)}
                className={cn(
                  'py-2 rounded-lg text-sm font-medium transition-colors',
                  role === opt.value
                    ? 'bg-[#2A3D66] text-white'
                    : 'bg-background text-muted hover:text-black',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full py-3.5 bg-[#2A3D66] text-white rounded-xl font-medium hover:bg-[#1e2d4f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          確認，開始遊戲
        </button>
      </div>
    </main>
  )
}
