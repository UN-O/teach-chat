import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { scenarioMeta } from '@/data/scenarios'

export const metadata = {
  title: '情境列表 | 老師怎麼辦...?',
}

export default function ScenarioListPage() {
  const scenarios = Object.values(scenarioMeta)

  return (
    <main className="min-h-screen bg-background py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {scenarios.map(scenario => (
            <Link
              key={scenario.name}
              href={`/scenario/${scenario.name}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={scenario.image}
                  alt={`${scenario.title}情境圖示`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="block h-full w-full object-cover scale-x-[1.06]"
                />
              </div>

              <div className="p-6 md:p-7">
                <div className="mb-3 flex gap-1.5">
                  {scenario.difficulties.map(d => (
                    <span
                      key={d}
                      className="text-xs px-2 py-0.5 rounded-md bg-background text-muted"
                    >
                      {d === 'basic' ? '初階' : '進階'}
                    </span>
                  ))}
                </div>

                <h2 className="font-[var(--font-chiron)] text-2xl font-bold text-black mb-3 group-hover:text-[#2A3D66] transition-colors">
                  {scenario.title}
                </h2>
                <p className="text-sm md:text-base text-black/65 leading-relaxed mb-7 max-w-[42ch]">
                  {scenario.description}
                </p>

                <div className="flex items-center text-sm font-medium text-[#4A90E2]">
                  開始練習
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
