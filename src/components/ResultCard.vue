<script setup lang="ts">
import { computed } from 'vue'
import { dimensions } from '@/data/dimensions'
import type { CalculatedResult } from '@/types/assessment'
import DimensionScore from './DimensionScore.vue'

const props = defineProps<{
  result: CalculatedResult
}>()

defineEmits<{
  reset: []
}>()

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

const reportItems = computed(() => [
  {
    label: '你的优势',
    text: props.result.resultDetail.strengths,
    gradient: 'from-[#f3f6f4] to-[#edf1ee]',
  },
  {
    label: '潜在风险',
    text: props.result.resultDetail.risks,
    gradient: 'from-[#f7f6f1] to-[#f1efe8]',
  },
  {
    label: 'AI 使用建议',
    text: props.result.resultDetail.aiAdvice,
    gradient: 'from-[#eef3f0] to-[#e7eeea]',
  },
  {
    label: '成长建议',
    text: props.result.resultDetail.growthAdvice,
    gradient: 'from-[#f4f5f2] to-[#ecefea]',
  },
])
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-5 pb-16 pt-4 sm:px-8">
    <div class="glass-card overflow-hidden rounded-[2rem]">
      <div class="relative p-6 sm:p-10 lg:p-12">
        <div class="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#d9e4de]/70 blur-3xl"></div>
        <div class="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#e7ece8]/70 blur-3xl"></div>

        <div class="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p class="mb-4 inline-flex rounded-full border border-[#1f2e2b]/8 bg-[#eff4f1] px-4 py-2 text-sm font-semibold text-[#4f7068]">
              你的 AI 时代脑力画像
            </p>
            <div class="flex flex-wrap items-end gap-4">
              <h1 class="font-display text-6xl font-bold tracking-[-0.06em] text-[#1f2e2b] sm:text-7xl">
                {{ result.code }}
              </h1>
              <div class="pb-2">
                <p class="text-3xl font-bold text-[#345f57]">{{ result.resultDetail.name }}</p>
                <p class="mt-2 text-[#667673]">AI 会放大你的判断、思考与行动方式</p>
              </div>
            </div>
            <p class="mt-7 max-w-2xl text-lg leading-9 text-[#556562]">
              {{ result.resultDetail.summary }}
            </p>
          </div>

          <aside class="rounded-[1.75rem] border border-[#1f2e2b]/8 bg-[#fcfcf8]/92 p-6 shadow-card">
            <div class="mb-5 flex items-center justify-between">
              <span class="text-sm font-semibold text-[#667673]">分享卡片预览</span>
              <span class="rounded-full bg-[#eff4f1] px-3 py-1 text-xs text-[#4f7068]">第一版</span>
            </div>
            <div class="rounded-[1.5rem] border border-[#d7dfda] bg-[#24544d] p-6">
                <p class="text-sm text-white/70">AI时代脑力测评</p>
                <p class="mt-8 font-display text-5xl font-bold tracking-[-0.05em] text-white">{{ result.code }}</p>
                <p class="mt-3 text-2xl font-bold text-[#d7e6e1]">{{ result.resultDetail.name }}</p>
                <p class="mt-5 text-sm leading-6 text-white/75">{{ result.resultDetail.summary }}</p>
                <div class="mt-8 grid grid-cols-4 gap-2 text-center text-xs font-semibold text-[#1f2e2b]">
                  <span
                    v-for="dimension in dimensionScores"
                    :key="dimension.key"
                    class="rounded-2xl bg-white px-2 py-3"
                  >
                    {{ dimension.leftScore >= dimension.rightScore ? dimension.leftLetter : dimension.rightLetter }}
                  </span>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <article
        v-for="item in reportItems"
        :key="item.label"
        class="rounded-[1.75rem] border border-[#1f2e2b]/8 bg-gradient-to-br p-6 shadow-card backdrop-blur-xl"
        :class="item.gradient"
      >
        <p class="text-sm font-semibold text-[#1f2e2b]">{{ item.label }}</p>
        <p class="mt-3 text-base leading-8 text-[#4f5d5a]">{{ item.text }}</p>
      </article>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-2">
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

    <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <button
        type="button"
        class="trend-button"
        @click="$emit('reset')"
      >
        重新测试
      </button>
      <p class="text-center text-sm text-[#667673]">当前版本仅展示分享卡片样式，暂不生成图片。</p>
    </div>
  </section>
</template>
