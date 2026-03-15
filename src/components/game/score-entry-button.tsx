'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

type ScoreEntryButtonState = 'ready' | 'direct'

type ScoreEntryButtonProps = {
  state: ScoreEntryButtonState
  phase: 1 | 2
  compact?: boolean
  className?: string
  onConfirm: () => void
}

export function ScoreEntryButton({ state, phase, compact = false, className, onConfirm }: ScoreEntryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const label = state === 'ready'
    ? (compact ? '完成評分 →' : `Phase ${phase} 完成 → 進入評分`)
    : '直接評分'

  const baseClassName = compact
    ? 'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors'
    : 'w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'

  const stateClassName = state === 'ready'
    ? 'bg-secondary text-white hover:bg-[#1e2d4f]'
    : 'border border-gray-200 bg-white text-black hover:bg-background'

  if (state === 'ready') {
    return (
      <button
        type="button"
        onClick={onConfirm}
        className={cn(baseClassName, stateClassName, className)}
      >
        {label}
      </button>
    )
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className={cn(baseClassName, stateClassName, className)}
        >
          {label}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確認直接進入評分？</AlertDialogTitle>
          <AlertDialogDescription>
            你尚未完成所有任務，也可以先進入 Phase {phase} 評分。系統會用目前對話內容進行評分。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>先繼續練習</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsOpen(false)
              onConfirm()
            }}
          >
            直接評分
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}