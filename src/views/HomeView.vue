<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dimensions } from '@/data/dimensions'
import { results } from '@/data/results'
import { getVisitorCount, formatCount } from '@/utils/counter'

defineProps<{
  hasProgress: boolean
  answerCount: number
}>()

defineEmits<{
  start: []
  resume: []
}>()

const visitorCount = ref('--')

onMounted(() => {
  const count = getVisitorCount()
  visitorCount.value = formatCount(count)
})
</script>

<template>
  <main class="mx-auto w-full max-w-6xl px-5 pb-16 pt-4 sm:px-8 lg:pt-10">
    <!-- Hero -->
    <section class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <div class="trend-chip mb-6">
          <span class="h-2 w-2 rounded-full bg-[#6b8f86] animate-pulse"></span>
          已有 <strong class="text-[#24544d]">{{ visitorCount }}</strong> 人完成测评
        </div>

        <h1 class="font-display text-5xl font-bold leading-[0.95] tracking-[-0.05em] text-[#1f2e2b] sm:text-6xl lg:text-7xl">
          MLTI<br /><span class="text-[#345f57]">脑力类型</span>
        </h1>
        <p class="mt-3 text-base text-[#667673]">Machine Learning Thinking Indicator</p>
        <p class="mt-5 max-w-xl text-2xl font-bold leading-tight text-[#345f57] sm:text-3xl">
          MBTI 看性格，MLTI 看脑力。
        </p>
        <p class="mt-6 max-w-2xl text-lg leading-9 text-[#667673]">
          这不是智商测试，也不是性格测试。32 道选择题，3 分钟时间，看见你在 AI 时代的<strong class="text-[#24544d]">独特脑力画像</strong>——你如何思考、如何行动、AI 会如何放大你。
        </p>

        <div class="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <div class="rounded-2xl border border-[#1f2e2b]/8 bg-white/80 p-4 text-center backdrop-blur">
            <div class="font-display text-3xl font-bold text-[#24544d]">16</div>
            <div class="mt-1 text-xs text-[#667673]">脑力类型</div>
          </div>
          <div class="rounded-2xl border border-[#1f2e2b]/8 bg-white/80 p-4 text-center backdrop-blur">
            <div class="font-display text-3xl font-bold text-[#24544d]">3<span class="text-base">分钟</span></div>
            <div class="mt-1 text-xs text-[#667673]">测评时长</div>
          </div>
          <div class="rounded-2xl border border-[#1f2e2b]/8 bg-white/80 p-4 text-center backdrop-blur">
            <div class="font-display text-3xl font-bold text-[#24544d]">4</div>
            <div class="mt-1 text-xs text-[#667673]">维度分析</div>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            class="trend-button"
            @click="$emit('start')"
          >
            🚀 开始测评
          </button>
          <button
            v-if="hasProgress"
            type="button"
            class="trend-button-secondary"
            @click="$emit('resume')"
          >
            继续上次（已答 {{ answerCount }} 题）
          </button>
        </div>

        <p class="mt-4 text-xs text-[#8a9c98]">免费 · 无需注册 · 测评结果可生成专属分享图</p>
      </div>

      <!-- Type Preview Grid -->
      <section class="hidden lg:grid grid-cols-4 gap-3">
        <div
          v-for="r in results"
          :key="r.code"
          class="aspect-square rounded-2xl border p-2 text-center transition hover:-translate-y-1 hover:shadow-lg cursor-default"
          :style="{ background: r.color.secondary, borderColor: r.color.accent + '40' }"
        >
          <div class="text-3xl mt-1">{{ r.emoji }}</div>
          <div class="mt-1 font-display text-sm font-black tracking-wider" :style="{ color: r.color.primary }">
            {{ r.code }}
          </div>
          <div class="mt-0.5 text-xs leading-tight text-[#4f5d5a] line-clamp-1">{{ r.name }}</div>
        </div>
      </section>
      <!-- Mobile: show fewer types -->
      <section class="grid grid-cols-4 gap-2 lg:hidden">
        <div
          v-for="r in results.slice(0, 8)"
          :key="r.code"
          class="rounded-2xl border p-2 text-center"
          :style="{ background: r.color.secondary, borderColor: r.color.accent + '40' }"
        >
          <div class="text-xl">{{ r.emoji }}</div>
          <div class="mt-0.5 font-display text-[11px] font-black tracking-wider" :style="{ color: r.color.primary }">
            {{ r.code }}
          </div>
        </div>
        <div class="col-span-4 text-center text-xs text-[#8a9c98] mt-1">
          共 16 种脑力类型，完成测评解锁你的专属画像
        </div>
      </section>
    </section>

    <!-- Dimensions Explained -->
    <section class="mt-16">
      <div class="mb-6 flex items-end justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#6b8f86]">FOUR DIMENSIONS</p>
          <h2 class="mt-2 font-display text-3xl font-bold text-[#1f2e2b] sm:text-4xl">从 4 个维度看见你的脑力</h2>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(dimension, idx) in dimensions"
          :key="dimension.key"
          class="group relative overflow-hidden rounded-[1.75rem] border border-[#1f2e2b]/8 bg-white/82 p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-[#6b8f86]/35"
        >
          <div class="absolute -right-6 -top-6 font-display text-7xl font-black text-[#1f2e2b]/5">0{{ idx + 1 }}</div>
          <div class="relative">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex gap-2">
                <span
                  v-for="letter in dimension.letters"
                  :key="letter"
                  class="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-[#f0f3f0] text-lg font-black text-[#1f2e2b] ring-1 ring-[#1f2e2b]/6"
                >
                  {{ letter }}
                </span>
              </div>
            </div>
            <span class="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#6b8f86]">{{ dimension.subtitle }}</span>
            <h3 class="mt-2 text-xl font-bold text-[#1f2e2b]">{{ dimension.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-[#667673]">{{ dimension.description }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- Why this test -->
    <section class="mt-16 rounded-[2rem] border border-[#1f2e2b]/8 bg-gradient-to-br from-[#f3f6f4] to-[#eef3f0] p-8 sm:p-12">
      <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#6b8f86]">WHY MLTI</p>
      <h2 class="mt-2 font-display text-3xl font-bold text-[#1f2e2b] sm:text-4xl">为什么你需要知道自己的 MLTI 类型？</h2>
      <div class="mt-6 grid gap-6 text-lg leading-9 text-[#4f5d5a] sm:grid-cols-2">
        <p>AI 正在重新定义"能力"。过去需要团队才能完成的事，现在一个人 + AI 就能做到。但关键是：<strong class="text-[#24544d]">你得知道自己的脑力是怎么运转的</strong>。</p>
        <p>MLTI 不是告诉你"你行不行"，而是告诉你<strong class="text-[#24544d]">"你的脑力会被 AI 如何放大"</strong>。知道自己的类型，才能找到最适合自己的 AI 使用方式。</p>
        <p>就像 MBTI 让你理解自己的性格，MLTI 让你理解自己在 AI 时代的竞争力模型。<strong class="text-[#24544d]">你的类型就是你的 AI 时代名片。</strong></p>
        <p>测完之后，把你的 MLTI 类型分享给朋友，看看你们是不是天生的思维搭子。很多人发现：<strong class="text-[#24544d]">最好的合作伙伴，往往是互补的 MLTI 类型</strong>。</p>
      </div>

      <button
        type="button"
        class="trend-button mt-8"
        @click="$emit('start')"
      >
        🚀 3 分钟测出你的 MLTI 类型
      </button>
    </section>
  </main>
</template>
