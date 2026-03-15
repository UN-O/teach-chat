'use client'

import { useRef, type KeyboardEvent, type ChangeEvent } from 'react'
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    // Auto-resize
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading && !disabled) {
        onSubmit()
      }
    }
  }

  return (
    <div className="flex items-end gap-2 p-4 bg-white border-t border-gray-100">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={1}
        className={cn(
          'flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5',
          'text-sm leading-relaxed outline-none transition-colors',
          'focus:border-[#4A90E2] focus:ring-1 focus:ring-[#4A90E2]/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'max-h-[120px] overflow-y-auto',
        )}
        style={{ height: '40px' }}
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading || disabled}
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          'transition-colors',
          value.trim() && !isLoading && !disabled
            ? 'bg-[#4A90E2] text-white hover:bg-[#3a7fd2]'
            : 'bg-gray-100 text-muted cursor-not-allowed',
        )}
      >
        <Send size={16} />
      </button>
    </div>
  )
}
