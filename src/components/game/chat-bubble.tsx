import { cn } from '@/lib/utils'

type BubbleColor = 'teacher' | 'expert'

interface ChatBubbleProps {
  content: string
  role: 'user' | 'assistant'
  isRead?: boolean
  timestamp?: number
  bubbleColor?: BubbleColor
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const assistantBubbleClass: Record<BubbleColor, string> = {
  teacher: 'bg-emerald-50 text-emerald-900 border border-emerald-100 shadow-none',
  expert: 'bg-purple-50 text-purple-900 border border-purple-100 shadow-none whitespace-pre-wrap',
}

export function ChatBubble({ content, role, isRead, timestamp, bubbleColor }: ChatBubbleProps) {
  const isUser = role === 'user'
  const assistantClass = bubbleColor
    ? assistantBubbleClass[bubbleColor]
    : 'bg-white text-black shadow-soft'

  return (
    <div className={cn('flex items-end gap-2 mb-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-[#4A90E2] text-white rounded-br-sm'
            : cn(assistantClass, 'rounded-bl-sm'),
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
