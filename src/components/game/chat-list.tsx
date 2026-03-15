import { cn } from '@/lib/utils'
import type { ParentId, Message } from '@/types'

interface ChatListItem {
  parentId: ParentId
  name: string
  avatar: string
  lastMessage: string
  unreadCount: number
  isOnline: boolean
  phase1Done: boolean
}

interface ChatListProps {
  items: ChatListItem[]
  activeParentId: ParentId | null
  onSelect: (parentId: ParentId) => void
}

function ParentAvatar({ name, isOnline }: { name: string; isOnline: boolean }) {
  const initials = name.slice(0, 1)
  return (
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-[#2A3D66] flex items-center justify-center">
        <span className="text-white text-lg font-medium font-[var(--font-noto-tc)]">{initials}</span>
      </div>
      <div
        className={cn(
          'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
          isOnline ? 'bg-green-400' : 'bg-gray-300',
        )}
      />
    </div>
  )
}

export function ChatList({ items, activeParentId, onSelect }: ChatListProps) {
  return (
    <div className="flex flex-col bg-white h-full">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-muted">聊天室</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.map(item => (
          <button
            key={item.parentId}
            onClick={() => onSelect(item.parentId)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3.5 text-left',
              'border-b border-gray-50 transition-colors',
              activeParentId === item.parentId
                ? 'bg-[#B6D0E2]/30'
                : 'hover:bg-gray-50',
            )}
          >
            <ParentAvatar name={item.name} isOnline={item.isOnline} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-medium text-black truncate">{item.name}</span>
                {item.phase1Done && (
                  <span className="text-[10px] text-[#4A90E2] bg-[#4A90E2]/10 px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1">
                    P1✓
                  </span>
                )}
              </div>
              <p className="text-xs text-muted truncate">{item.lastMessage || '尚未開始對話'}</p>
            </div>
            {item.unreadCount > 0 && (
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF5A5F] flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">{item.unreadCount}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export function getLastMessage(messages: Message[]): string {
  const last = messages[messages.length - 1]
  if (!last) return ''
  const prefix = last.role === 'user' ? '我：' : ''
  return prefix + last.content.substring(0, 30) + (last.content.length > 30 ? '…' : '')
}

export function getUnreadCount(messages: Message[]): number {
  return messages.filter(m => m.role === 'assistant' && !m.isRead).length
}
