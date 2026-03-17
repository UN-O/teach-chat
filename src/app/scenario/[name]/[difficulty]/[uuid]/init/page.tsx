'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useGameStore } from '@/store/game-store'
import type { ScenarioName, Difficulty, PlayerAvatar, EducationLevel, TeacherRole, PlayerProfile } from '@/types'
import { cn } from '@/lib/utils'

const PROFILE_STORAGE_KEY = 'teach-chat-player-profile'

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
  const [mobileStep, setMobileStep] = useState<0 | 1>(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (!raw) return

      const saved = JSON.parse(raw) as Partial<PlayerProfile>
      if (saved.avatar === 1 || saved.avatar === 2 || saved.avatar === 3 || saved.avatar === 4) {
        setAvatar(saved.avatar)
      }
      if (typeof saved.name === 'string') {
        setName(saved.name)
      }
      if (saved.educationLevel === 'elementary' || saved.educationLevel === 'middle') {
        setEducationLevel(saved.educationLevel)
      }
      if (saved.role === 'intern' || saved.role === 'parttime' || saved.role === 'substitute' || saved.role === 'full') {
        setRole(saved.role)
      }
    } catch {
      localStorage.removeItem(PROFILE_STORAGE_KEY)
    }
  }, [])

  const handleStart = () => {
    if (!name.trim()) return

    const player: PlayerProfile = { avatar, name: name.trim(), educationLevel, role }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(player))
    initSession(
      params.name as ScenarioName,
      params.difficulty as Difficulty,
      player,
    )
    router.push(`/scenario/${params.name}/${params.difficulty}/${params.uuid}/intro`)
  }

  return (
    <main className="h-svh overflow-y-auto bg-background flex flex-col items-center justify-center px-4 py-4 [@media(max-height:580px)]:py-2 sm:px-6 sm:py-10">
      {/* Mobile step indicator */}
      <div className="md:hidden flex gap-2 justify-center mb-3">
        {([0, 1] as const).map(i => (
          <div
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === mobileStep ? 'w-8 bg-[#2A3D66]' : i < mobileStep ? 'w-4 bg-[#2A3D66]/40' : 'w-4 bg-gray-200',
            )}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 [@media(max-height:580px)]:p-4 sm:p-8 md:p-10 w-full max-w-md">
        {/* Title */}
        <h1 className="font-[var(--font-chiron)] text-2xl font-bold text-black mb-2">
          <span className="md:hidden">{mobileStep === 0 ? '選擇角色與名稱' : '你的背景'}</span>
          <span className="hidden md:inline">設定你的角色</span>
        </h1>
        <p className="hidden md:block text-sm text-muted mb-5 sm:mb-8">選擇頭像並填入你的資料，開始練習前的準備。</p>

        {/* Step 0: Avatar + Name */}
        <div className={cn(mobileStep === 0 ? 'block' : 'hidden', 'md:block')}>
          {/* Avatar */}
          <div className="mb-4 sm:mb-6">
            <p className="text-xs text-muted mb-3 font-[var(--font-dm-sans)]">選擇頭像</p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setAvatar(a => (a === 1 ? 4 : (a - 1) as PlayerAvatar))}
                className="p-2 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-muted" />
              </button>
              <div className="relative aspect-square w-full max-w-28 [@media(max-height:580px)]:max-w-20 sm:max-w-48 md:max-w-64 rounded-2xl bg-background ring-2 ring-secondary overflow-hidden">
                <Image
                  src={avatarSrc[avatar]}
                  alt={`avatar ${avatar}`}
                  fill
                  sizes="(max-width: 640px) 7rem, (max-width: 768px) 12rem, 16rem"
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
          <div className="mb-4 sm:mb-6 md:mb-5">
            <label className="text-xs text-muted font-[var(--font-dm-sans)] block mb-2">你的名字</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="王老師"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[16px] md:text-sm outline-none focus:border-[#2A3D66] focus:ring-1 focus:ring-[#2A3D66]/20 transition-colors"
            />
          </div>
        </div>

        {/* Step 1: Background */}
        <div className={cn(mobileStep === 1 ? 'block' : 'hidden', 'md:block')}>
          {/* Education Level */}
          <div className="mb-4 sm:mb-6 md:mb-5">
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
          <div className="mb-4 sm:mb-6 md:mb-8">
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
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex items-center justify-between">
          {mobileStep === 0 ? (
            <span />
          ) : (
            <button
              type="button"
              onClick={() => setMobileStep(0)}
              className="text-sm text-muted hover:text-black transition-colors"
            >
              ← 返回
            </button>
          )}
          {mobileStep === 0 ? (
            <button
              type="button"
              onClick={() => setMobileStep(1)}
              className="px-5 py-2.5 bg-[#2A3D66] text-white rounded-xl text-sm font-medium hover:bg-[#1e2d4f] transition-colors"
            >
              下一步 →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              disabled={!name.trim()}
              className="px-5 py-2.5 bg-[#2A3D66] text-white rounded-xl text-sm font-medium hover:bg-[#1e2d4f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              確認，開始遊戲
            </button>
          )}
        </div>

        {/* Desktop submit button */}
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="hidden md:block w-full py-3.5 bg-[#2A3D66] text-white rounded-xl font-medium hover:bg-[#1e2d4f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          確認，開始遊戲
        </button>
      </div>
    </main>
  )
}
