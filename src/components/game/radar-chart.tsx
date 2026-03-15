'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { ScoreResult } from '@/types'

interface RadarChartProps {
  scores: ScoreResult[]
  label?: string
}

export function SkillRadarChart({ scores, label = '技巧評分' }: RadarChartProps) {
  const data = scores.map(s => ({
    subject: s.techniqueId,
    fullName: s.techniqueName,
    score: s.score,
    fullMark: 4,
  }))

  if (data.length === 0) return null

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#808080', fontSize: 11, fontFamily: 'var(--font-dm-sans)' }}
          />
          <Radar
            name={label}
            dataKey="score"
            stroke="#4A90E2"
            fill="#4A90E2"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value, name, props) => [
              `${value}/4`,
              props.payload?.fullName ?? name,
            ]}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
