'use client'

import { useState } from 'react'
import { ArrowLeft, Sparkles, Copy, Check, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Improvement {
  techniqueId: string
  techniqueName: string
  note: string
}

interface PolishResult {
  polished: string
  improvements: Improvement[]
  suggestions: string[]
}

export default function PolishTextPage() {
  const [draft, setDraft] = useState('')
  const [result, setResult] = useState<PolishResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handlePolish = async () => {
    if (!draft.trim() || isLoading) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/polish-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: draft.trim() }),
      })
      if (!res.ok) throw new Error('請求失敗')
      const data = await res.json() as PolishResult
      setResult(data)
    } catch {
      setError('潤飾失敗，請稍後再試。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result?.polished) return
    await navigator.clipboard.writeText(result.polished)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setResult(null)
    setDraft('')
    setError(null)
  }

  return (
    <main className="min-h-svh bg-background py-16 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          返回首頁
        </Link>

        <div className="mb-8">
          <p className="text-xs tracking-widest text-muted font-[var(--font-dm-sans)] uppercase mb-3">
            Message Polish
          </p>
          <h1 className="font-[var(--font-chiron)] text-4xl font-bold text-black mb-4">
            訊息潤飾小幫手
          </h1>
          <p className="text-base text-black/70 leading-relaxed">
            把想傳給家長的訊息草稿貼進來，AI 會幫你改寫成更溫暖、專業、不易引發誤會的版本，並說明運用了哪些溝通技巧。
          </p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-4">
          <label className="block text-xs text-muted mb-2 font-[var(--font-dm-sans)]">
            你的訊息草稿
          </label>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="把你想傳給家長的訊息貼在這裡…&#10;例如：「你孩子今天打人了，你要來學校一趟。」"
            disabled={isLoading}
            rows={5}
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm leading-relaxed outline-none focus:border-[#2A3D66] focus:ring-1 focus:ring-[#2A3D66]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted">{draft.length} 字</span>
            <div className="flex gap-2">
              {result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-black transition-colors px-3 py-2 rounded-lg border border-gray-200 hover:bg-background"
                >
                  <RotateCcw size={12} />
                  重新輸入
                </button>
              )}
              <button
                type="button"
                onClick={handlePolish}
                disabled={!draft.trim() || isLoading}
                className={cn(
                  'inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-colors',
                  draft.trim() && !isLoading
                    ? 'bg-[#2A3D66] text-white hover:bg-[#1e2d4f]'
                    : 'bg-gray-100 text-muted cursor-not-allowed',
                )}
              >
                <Sparkles size={14} className={isLoading ? 'animate-pulse' : ''} />
                {isLoading ? '潤飾中…' : '開始潤飾'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Polished message */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium tracking-widest text-muted font-[var(--font-dm-sans)] uppercase">
                  潤飾後的訊息
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-black transition-colors px-2.5 py-1 rounded-md border border-gray-200 hover:bg-background"
                >
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  {copied ? '已複製' : '複製'}
                </button>
              </div>
              <p className="text-sm text-black/80 leading-relaxed whitespace-pre-wrap bg-[#F5F8FF] rounded-lg px-4 py-3 border border-[#B6D0E2]/40">
                {result.polished}
              </p>
            </div>

            {/* Improvements */}
            {result.improvements.length > 0 && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <p className="text-xs font-medium tracking-widest text-muted font-[var(--font-dm-sans)] uppercase mb-4">
                  運用了哪些技巧
                </p>
                <div className="space-y-3">
                  {result.improvements.map((imp, i) => (
                    <Link
                      key={i}
                      href={`/docs/techniques/${imp.techniqueId.replace('T', '').padStart(2, '0')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg border border-background/40 bg-[#F5F8FF] px-4 py-3 transition-colors hover:bg-[#ECF3FF]"
                    >
                      <div className="flex gap-3">
                        <span className="shrink-0 self-start text-xs px-2 py-1 rounded-md bg-background/40 text-secondary font-medium">
                          {imp.techniqueId}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-black mb-0.5">{imp.techniqueName}</p>
                          <p className="text-xs text-black/60 leading-relaxed">{imp.note}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-xs font-medium tracking-widest text-amber-700 font-[var(--font-dm-sans)] uppercase mb-3">
                  額外建議
                </p>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-amber-800 leading-relaxed flex gap-2">
                      <span className="shrink-0 text-amber-400">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
