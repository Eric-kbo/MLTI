<script setup lang="ts">
import { computed, ref } from 'vue'
import { dimensions } from '@/data/dimensions'
import { resultMap } from '@/data/results'
import type { CalculatedResult } from '@/types/assessment'
import DimensionScore from './DimensionScore.vue'
import PersonalityImage from './PersonalityImage.vue'

const props = defineProps<{
  result: CalculatedResult
}>()

defineEmits<{
  reset: []
}>()

const copyState = ref<'idle' | 'copied'>('idle')

function buildAIPrompt(): string {
  const d = props.result.resultDetail
  const scores = props.result.scores
  const dimText = dimensions.map((dim) => {
    const [l, r] = dim.letters
    const lScore = scores[l]
    const rScore = scores[r]
    const total = lScore + rScore
    const lPct = total > 0 ? Math.round((lScore / total) * 100) : 50
    return `${dim.title}：${l}(${lPct}%) vs ${r}(${100 - lPct}%)`
  }).join('，')

  return `我刚做了一个 MLTI（Machine Learning Thinking Indicator）脑力类型测评，这是一套评估人在AI时代思维模式和行动方式的体系，类似 MBTI 但聚焦于AI时代的脑力特征。

我的测评结果是：${d.code}（${d.name}）

四维度得分：${dimText}

类型特征描述：${d.summary}

核心关键词：${d.keywords.join('、')}

请你作为一位专业的认知心理学和AI应用专家，基于我的 MLTI 类型，帮我做一次深度解读：

1. 从认知科学角度，分析我这种思维模式在AI时代的独特价值是什么？为什么这种脑力组合是稀缺的？
2. 基于我的四维度得分，具体分析我最适合用AI做什么类型的事？给出3个最匹配我思维模式的AI使用场景。
3. 如果我想在未来6个月内最大化发挥我的脑力优势，你建议我怎么制定个人成长计划？
4. 我这种类型的人，在团队协作中通常扮演什么角色？什么样的人跟我最互补？

请给出具体、有深度的分析，不要泛泛而谈。结合AI时代的实际场景来回答。`
}

async function copyAIPrompt() {
  const text = buildAIPrompt()
  try {
    await navigator.clipboard.writeText(text)
    copyState.value = 'copied'
    setTimeout(() => (copyState.value = 'idle'), 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copyState.value = 'copied'
    setTimeout(() => (copyState.value = 'idle'), 2000)
  }
}

const compatibilityDetails = computed(() =>
  props.result.resultDetail.compatibility.map((code) => resultMap[code]).filter(Boolean),
)

const dimensionScores = computed(() =>
  dimensions.map((dimension) => {
    const [leftLetter, rightLetter] = dimension.letters
    return {
      ...dimension,
      leftLetter,
      rightLetter,
      leftScore: props.result.scores[leftLetter],
      rightScore: props.result.scores[rightLetter],
    }
  }),
)

const detail = computed(() => props.result.resultDetail)

const reportSections = computed(() => [
  {
    label: '你的核心优势',
    icon: '💪',
    items: detail.value.strengths,
    gradient: 'from-[#f3f6f4] to-[#edf1ee]',
    border: 'border-emerald-100',
  },
  {
    label: '潜在风险提醒',
    icon: '⚠️',
    items: detail.value.risks,
    gradient: 'from-[#f7f6f1] to-[#f1efe8]',
    border: 'border-amber-100',
  },
  {
    label: 'AI 协作策略',
    icon: '🤖',
    items: detail.value.aiAdvice,
    gradient: 'from-[#eef3f0] to-[#e7eeea]',
    border: 'border-teal-100',
  },
  {
    label: '成长行动建议',
    icon: '🌱',
    items: detail.value.growthAdvice,
    gradient: 'from-[#f4f5f2] to-[#ecefea]',
    border: 'border-green-100',
  },
])
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-5 pb-16 pt-4 sm:px-8">
    <!-- Hero Section -->
    <div class="glass-card overflow-hidden rounded-[2rem] animate-scale-in">
      <div class="relative p-6 sm:p-10">
        <div class="absolute -right-24 -top-20 h-72 w-72 rounded-full blur-3xl" :style="{ background: detail.color.secondary }"></div>
        <div class="absolute -bottom-28 -left-24 h-72 w-72 rounded-full blur-3xl" :style="{ background: detail.color.accent + '30' }"></div>

        <div class="relative text-center">
          <p class="mb-4 inline-flex rounded-full border border-[#1f2e2b]/8 bg-[#eff4f1] px-4 py-2 text-sm font-semibold text-[#4f7068]">
            你的 AI 时代脑力画像
          </p>
          <div class="mt-2 text-5xl sm:text-6xl">{{ detail.emoji }}</div>
          <h1 class="mt-4 font-display text-5xl font-bold tracking-[-0.06em] sm:text-7xl lg:text-8xl" :style="{ color: detail.color.primary }">
            {{ result.code }}
          </h1>
          <p class="mt-3 text-2xl font-bold text-[#1a1a1a] sm:text-3xl lg:text-4xl">{{ detail.name }}</p>
          <p class="mt-2 text-base text-[#666] sm:text-lg">{{ detail.tagline }}</p>
          <div class="mt-5 flex flex-wrap justify-center gap-2">
            <span
              v-for="kw in detail.keywords"
              :key="kw"
              class="rounded-full px-4 py-1.5 text-sm font-medium"
              :style="{ background: detail.color.secondary, color: detail.color.primary }"
            >{{ kw }}</span>
          </div>
          <p class="mx-auto mt-6 max-w-2xl text-lg leading-9 text-[#556562]">
            {{ detail.summary }}
          </p>
        </div>
      </div>
    </div>

    <!-- Personality Image - 独立区块 -->
    <div class="mt-6 rounded-[1.75rem] border border-[#1f2e2b]/8 bg-white/90 p-5 shadow-card backdrop-blur-xl sm:p-8 animate-fade-up-delay-1">
      <p class="mb-4 text-center text-sm font-semibold text-[#667673]">📸 长按保存，分享给朋友看看你的 MLTI 类型</p>
      <div class="mx-auto max-w-sm">
        <PersonalityImage :result="result" />
      </div>
    </div>

    <!-- Report Sections -->
    <div class="mt-6 grid gap-4 sm:grid-cols-2 animate-fade-up-delay-2">
      <article
        v-for="section in reportSections"
        :key="section.label"
        class="rounded-[1.75rem] border bg-gradient-to-br p-6 shadow-card backdrop-blur-xl"
        :class="[section.gradient, section.border]"
      >
        <p class="flex items-center gap-2 text-base font-semibold text-[#1f2e2b]">
          <span>{{ section.icon }}</span>
          {{ section.label }}
        </p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="(item, idx) in section.items"
            :key="idx"
            class="flex items-start gap-2.5 text-base leading-7 text-[#4f5d5a]"
          >
            <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" :style="{ background: detail.color.accent }"></span>
            {{ item }}
          </li>
        </ul>
      </article>
    </div>

    <!-- Dimension Scores -->
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <DimensionScore
        v-for="dimension in dimensionScores"
        :key="dimension.key"
        :title="dimension.title"
        :description="dimension.description"
        :left-letter="dimension.leftLetter"
        :right-letter="dimension.rightLetter"
        :left-score="dimension.leftScore"
        :right-score="dimension.rightScore"
      />
    </div>

    <!-- Compatibility -->
    <div class="mt-6 rounded-[1.75rem] border border-[#1f2e2b]/8 bg-white/80 p-6 shadow-card backdrop-blur-xl">
      <p class="flex items-center gap-2 text-base font-semibold text-[#1f2e2b]">
        <span>🤝</span>
        最佳协作类型
      </p>
      <p class="mt-2 text-sm text-[#667673]">这些类型与你的思维方式互补，是最佳的合作伙伴或思考搭子</p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div
          v-for="compat in compatibilityDetails"
          :key="compat.code"
          class="flex items-start gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md"
          :style="{ background: compat.color.secondary, borderColor: compat.color.accent + '40' }"
        >
          <div class="text-3xl">{{ compat.emoji }}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-2">
              <span class="font-display text-lg font-black tracking-wider" :style="{ color: compat.color.primary }">{{ compat.code }}</span>
              <span class="text-sm font-bold text-[#1f2e2b]">{{ compat.name }}</span>
            </div>
            <p class="mt-1 text-xs leading-5 text-[#4f5d5a] line-clamp-2">{{ compat.tagline }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Prompt Banner -->
    <div class="mt-6 rounded-[1.75rem] border p-6 sm:p-8 shadow-card" :style="{ background: detail.color.secondary, borderColor: detail.color.accent + '40' }">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-base font-semibold" :style="{ color: detail.color.primary }">🤖 让 AI 帮你深度解读</p>
          <p class="mt-1 text-sm text-[#4f5d5a]">让 AI 为你做一次深度脑力解读，发现更多隐藏优势</p>
        </div>
        <button
          type="button"
          class="rounded-full px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 shadow-md"
          :style="{ background: detail.color.primary }"
          @click="copyAIPrompt"
        >
          {{ copyState === 'copied' ? '✓ 已复制，去问 AI 吧' : '📋 复制内容问问 AI' }}
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <button type="button" class="trend-button-secondary" @click="$emit('reset')">
        重新测试
      </button>
    </div>
  </section>
</template>
