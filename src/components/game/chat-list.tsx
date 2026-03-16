import { cn } from '@/lib/utils'
import type { ActiveChatId, ParentId, Message } from '@/types'

export interface ParentChatItem {
  type: 'parent'
  parentId: ParentId
  name: string
  avatar: string
  lastMessage: string
  unreadCount: number
  isOnline: boolean
  phase1Done: boolean
}

export interface TeacherChatItem {
  type: 'teacher'
  name: string
  lastMessage: string
  hasCoordinated: boolean
}

export interface ExpertChatItem {
  type: 'expert'
  name: string
  lastMessage: string
  unreadCount: number
}

export type ChatListItem = ParentChatItem | TeacherChatItem | ExpertChatItem

interface ChatListProps {
  items: ChatListItem[]
  activeChatId: ActiveChatId | null
  onSelectParent: (parentId: ParentId) => void
  onSelectTeacher: () => void
  onSelectExpert: () => void
}

function ParentAvatar({ name, isOnline }: { name: string; isOnline: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-[#2A3D66] flex items-center justify-center">
        <span className="text-white text-lg font-medium font-[var(--font-noto-tc)]">{name.slice(0, 1)}</span>
      </div>
      <div className={cn('absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white', isOnline ? 'bg-green-400' : 'bg-gray-300')} />
    </div>
  )
}

function TeacherAvatar() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
        <span className="text-white text-xs font-medium">同事</span>
      </div>
    </div>
  )
}

function ExpertAvatar() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-[#6B4F8A] flex items-center justify-center">
        <span className="text-white text-xs font-medium text-center leading-tight">資深<br/>老師</span>
      </div>
    </div>
  )
}

export function ChatList({ items, activeChatId, onSelectParent, onSelectTeacher, onSelectExpert }: ChatListProps) {
  return (
    <div className="flex flex-col bg-white h-full">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-muted">聊天室</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.map((item, i) => {
          if (item.type === 'parent') {
            const isActive = activeChatId === item.parentId
            return (
              <button
                key={item.parentId}
                onClick={() => onSelectParent(item.parentId)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left',
                  'border-b border-gray-50 transition-colors',
                  isActive ? 'bg-[#B6D0E2]/30' : 'hover:bg-gray-50',
                )}
              >
                <ParentAvatar name={item.name} isOnline={item.isOnline} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-black truncate">{item.name}</span>
                    {item.phase1Done && (
                      <span className="text-[10px] text-[#4A90E2] bg-[#4A90E2]/10 px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1">P1✓</span>
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
            )
          }

          if (item.type === 'teacher') {
            const isActive = activeChatId === 'teacher'
            return (
              <button
                key="teacher"
                onClick={onSelectTeacher}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left',
                  'border-b border-gray-50 transition-colors',
                  isActive ? 'bg-emerald-50' : 'hover:bg-gray-50',
                )}
              >
                <TeacherAvatar />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-black truncate">{item.name}</span>
                    {item.hasCoordinated && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1 border border-emerald-200">協調✓</span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">{item.lastMessage || '等待協調…'}</p>
                </div>
              </button>
            )
          }

          if (item.type === 'expert') {
            const isActive = activeChatId === 'expert'
            return (
              <button
                key="expert"
                onClick={onSelectExpert}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left',
                  'border-b border-gray-50 transition-colors',
                  isActive ? 'bg-purple-50' : 'hover:bg-gray-50',
                )}
              >
                <ExpertAvatar />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-black truncate">{item.name}</span>
                    <span className="text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1 border border-purple-200">資深顧問</span>
                  </div>
                  <p className="text-xs text-muted truncate">{item.lastMessage || '點擊開始諮詢'}</p>
                </div>
                {item.unreadCount > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6B4F8A] flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">{item.unreadCount}</span>
                  </div>
                )}
              </button>
            )
          }

          return null
        })}
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
