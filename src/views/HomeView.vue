<script setup lang="ts">
import { dimensions } from '@/data/dimensions'

defineProps<{
  hasProgress: boolean
  answerCount: number
}>()

defineEmits<{
  start: []
  resume: []
}>()
</script>

<template>
  <main class="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-10">
    <section>
      <div class="trend-chip mb-6">
        <span class="h-2 w-2 rounded-full bg-[#6b8f86]"></span>
        大众向 · AI时代 · 32道选择题
      </div>

      <h1 class="font-display text-5xl font-bold leading-[0.95] tracking-[-0.05em] text-[#1f2e2b] sm:text-6xl lg:text-7xl">
        AI时代<br />脑力测评
      </h1>
      <p class="mt-5 max-w-xl text-2xl font-bold leading-tight text-[#345f57] sm:text-3xl">
        你的大脑会被 AI 如何放大？
      </p>
      <p class="mt-6 max-w-2xl text-lg leading-9 text-[#667673]">
        这不是智商测试，也不是性格测试。它会通过 32 道简单选择题，帮你了解自己在 AI 时代的信息方式、思考方式、AI 使用方式和输出方式。
      </p>

      <div class="mt-8 space-y-4 rounded-[2rem] border border-[#1f2e2b]/8 bg-white/80 p-6 text-[#667673] shadow-card backdrop-blur-xl">
        <p>AI 正在放大每个人的脑力。</p>
        <p>过去，一个人的理解力、判断力、抽象力，很难在短时间内变成结果。但现在，AI 把脑力直接接入了生产力系统。</p>
        <p>这套测评会帮你看见：你如何思考、如何行动，以及你会被 AI 如何放大。</p>
      </div>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          class="trend-button"
          @click="$emit('start')"
        >
          开始测评
        </button>
        <button
          v-if="hasProgress"
          type="button"
          class="trend-button-secondary"
          @click="$emit('resume')"
        >
          继续上次测评（已答 {{ answerCount }} 题）
        </button>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <article
        v-for="dimension in dimensions"
        :key="dimension.key"
        class="group rounded-[1.75rem] border border-[#1f2e2b]/8 bg-white/82 p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-[#6b8f86]/35"
      >
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
          <span class="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#6b8f86]">{{ dimension.subtitle }}</span>
        </div>
        <h2 class="text-xl font-bold text-[#1f2e2b]">{{ dimension.title }}</h2>
        <p class="mt-3 text-sm leading-7 text-[#667673]">{{ dimension.description }}</p>
      </article>
    </section>
  </main>
</template>
