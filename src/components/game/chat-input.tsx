'use client'

import { useEffect, useRef, type KeyboardEvent, type ChangeEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = '輸入訊息…',
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isComposingRef = useRef(false)
  const lastCompositionEndAtRef = useRef(0)
  const isMobileRef = useRef(false)

  useEffect(() => {
    isMobileRef.current = window.matchMedia('(pointer: coarse)').matches
  }, [])

  const resizeTextarea = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    resizeTextarea()
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    resizeTextarea()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // On mobile, let Enter create a newline naturally
    if (isMobileRef.current) return

    const nativeEvent = e.nativeEvent as KeyboardEvent<HTMLTextAreaElement>['nativeEvent'] & { isComposing?: boolean }
    const justEndedComposition = Date.now() - lastCompositionEndAtRef.current < 120

    // Prevent submit when user is selecting candidates in CJK IME.
    if (isComposingRef.current || nativeEvent.isComposing || nativeEvent.keyCode === 229 || justEndedComposition) {
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading && !disabled) {
        onSubmit()
      }
    }
  }

  const canSubmit = value.trim() && !isLoading && !disabled

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div
        className={cn(
          'flex items-end rounded-xl border border-gray-200 bg-white',
          'transition-colors focus-within:border-accent-alt focus-within:ring-1 focus-within:ring-accent-alt/20',
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            isComposingRef.current = true
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false
            lastCompositionEndAtRef.current = Date.now()
          }}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent px-4 py-3',
            'text-[16px] md:text-sm leading-relaxed outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed min-h-12',
            'overflow-hidden',
          )}
        />
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            'shrink-0 size-10 m-1.5 rounded-lg flex items-center justify-center',
            'transition-colors',
            canSubmit
              ? 'bg-accent-alt text-white hover:bg-[#3a7fd2]'
              : 'bg-gray-100 text-muted cursor-not-allowed',
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
