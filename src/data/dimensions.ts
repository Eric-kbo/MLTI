import type { DimensionMeta } from '@/types/assessment'

export const dimensions: DimensionMeta[] = [
  {
    key: 'information',
    title: '信息方式',
    letters: ['F', 'V'],
    subtitle: 'Fact / Vision',
    description: '你更擅长从事实中得出结论，还是从变化中发现机会。',
  },
  {
    key: 'thinking',
    title: '思考方式',
    letters: ['S', 'E'],
    subtitle: 'Structure / Explore',
    description: '你是先搭结构，还是先探索可能。',
  },
  {
    key: 'aiUsage',
    title: 'AI 使用方式',
    letters: ['G', 'T'],
    subtitle: 'Guide / Tool',
    description: '你是在带着 AI 做事，还是有需要时使用 AI。',
  },
  {
    key: 'output',
    title: '输出方式',
    letters: ['P', 'B'],
    subtitle: 'Pace / Burst',
    description: '你是稳定复利型，还是高爆发型。',
  },
]
