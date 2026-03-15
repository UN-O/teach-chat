import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { scenarioMeta } from '@/data/scenarios'

export const metadata = {
  title: '情境列表 | 老師怎麼辦...?',
}

export default function ScenarioListPage() {
  const scenarios = Object.values(scenarioMeta)

  return (
    <main className="min-h-screen bg-background py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-widest text-muted font-[var(--font-dm-sans)] uppercase mb-3">
            情境訓練
          </p>
          <h1 className="font-[var(--font-chiron)] text-4xl md:text-5xl font-bold text-black mb-4">
            選擇你的挑戰
          </h1>
          <p className="text-base text-black/70 max-w-[55ch] leading-relaxed">
            每個情境都有初階和進階兩種難度。建議從初階開始練習，熟悉後再挑戰進階版。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map(scenario => (
            <Link
              key={scenario.name}
              href={`/scenario/${scenario.name}`}
              className="group block bg-white rounded-xl p-8 shadow-soft hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${scenario.color}15` }}
                >
                  {scenario.name === 'fight' ? '⚡' : '🫧'}
                </div>
                <div className="flex gap-1.5">
                  {scenario.difficulties.map(d => (
                    <span
                      key={d}
                      className="text-xs px-2 py-0.5 rounded-md bg-background text-muted"
                    >
                      {d === 'basic' ? '初階' : '進階'}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="font-[var(--font-chiron)] text-xl font-bold text-black mb-2 group-hover:text-[#2A3D66] transition-colors">
                {scenario.title}
              </h2>
              <p className="text-sm text-black/60 leading-relaxed mb-6 max-w-[40ch]">
                {scenario.description}
              </p>

              <div className="flex items-center text-sm font-medium text-[#4A90E2]">
                開始練習
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
