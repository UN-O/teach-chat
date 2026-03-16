import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type BubbleColor = 'teacher' | 'expert'
type UserBubbleColor = 'accent-alt' | 'accent'

interface ChatBubbleProps {
  content: string
  role: 'user' | 'assistant'
  isRead?: boolean
  timestamp?: number
  bubbleColor?: BubbleColor
  renderMarkdown?: boolean
  userBubbleColor?: UserBubbleColor
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
  expert: 'bg-[#FFF1F1] text-[#7A1F22] border border-[#FFD2D3] shadow-none whitespace-pre-wrap',
}

export function ChatBubble({ content, role, isRead, timestamp, bubbleColor, renderMarkdown, userBubbleColor = 'accent-alt' }: ChatBubbleProps) {
  const isUser = role === 'user'
  const assistantClass = bubbleColor
    ? assistantBubbleClass[bubbleColor]
    : 'bg-white text-black shadow-soft'
  const userClass = userBubbleColor === 'accent' ? 'bg-accent text-white rounded-br-sm' : 'bg-accent-alt text-white rounded-br-sm'
  const readStatusClass = userBubbleColor === 'accent' ? 'text-accent' : 'text-accent-alt'

  return (
    <div className={cn('flex items-end gap-2 mb-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? userClass
            : cn(assistantClass, 'rounded-bl-sm'),
        )}
      >
        {renderMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1.5">{children}</h3>,
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className="px-1 py-0.5 rounded bg-black/10 text-[0.9em]">{children}</code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          content
        )}
      </div>
      <div className={cn('flex flex-col items-end gap-0.5', isUser ? 'items-end' : 'items-start')}>
        {timestamp && (
          <span className="text-[10px] text-muted">{formatTime(timestamp)}</span>
        )}
        {isUser && (
          <span className={cn('text-[10px]', isRead ? readStatusClass : 'text-muted')}>
            {isRead ? '已讀' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
