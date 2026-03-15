import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  content: string
  role: 'user' | 'assistant'
  isRead?: boolean
  timestamp?: number
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function ChatBubble({ content, role, isRead, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex items-end gap-2 mb-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-[#4A90E2] text-white rounded-br-sm'
            : 'bg-white text-black shadow-soft rounded-bl-sm',
        )}
      >
        {content}
      </div>
      <div className={cn('flex flex-col items-end gap-0.5', isUser ? 'items-end' : 'items-start')}>
        {timestamp && (
          <span className="text-[10px] text-muted">{formatTime(timestamp)}</span>
        )}
        {isUser && (
          <span className={cn('text-[10px]', isRead ? 'text-[#4A90E2]' : 'text-muted')}>
            {isRead ? '已讀' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
