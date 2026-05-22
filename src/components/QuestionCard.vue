<script setup lang="ts">
import { computed } from 'vue'
import { dimensions } from '@/data/dimensions'
import type { AnswerOption, Question } from '@/types/assessment'

const props = defineProps<{
  question: Question
  selectedAnswer?: AnswerOption
}>()

defineEmits<{
  select: [option: AnswerOption]
}>()

const dimensionMeta = computed(() => dimensions.find((d) => d.key === props.question.dimension))

function optionClass(option: AnswerOption) {
  const selected = props.selectedAnswer === option

  return [
    'group flex w-full items-start gap-4 rounded-[1.8rem] border p-5 text-left transition duration-200 sm:p-6',
    selected
      ? 'border-[#6b8f86]/50 bg-[#e8f1ec] shadow-[0_14px_30px_rgba(36,84,77,0.18)] scale-[1.01]'
      : 'border-[#1f2e2b]/8 bg-white/88 hover:-translate-y-0.5 hover:border-[#6b8f86]/35 hover:bg-[#f6f8f6] hover:shadow-md',
  ]
}
</script>

<template>
  <article class="glass-card rounded-[2rem] p-6 sm:p-8 lg:p-10">
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <span class="inline-flex rounded-full border border-[#1f2e2b]/8 bg-[#eff4f1] px-3 py-1 text-xs font-semibold text-[#4f7068]">
        第 {{ question.id }} 题
      </span>
      <span v-if="dimensionMeta" class="inline-flex items-center gap-2 rounded-full border border-[#6b8f86]/20 bg-white/80 px-3 py-1 text-xs font-semibold text-[#345f57]">
        <span class="h-1.5 w-1.5 rounded-full bg-[#6b8f86]"></span>
        测评维度：{{ dimensionMeta.title }}
      </span>
    </div>

    <h1 class="text-2xl font-bold leading-snug text-[#1f2e2b] sm:text-3xl">
      {{ question.question }}
    </h1>

    <div class="mt-8 grid gap-4">
      <button type="button" :class="optionClass('A')" @click="$emit('select', 'A')">
        <span
          class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] text-sm font-black ring-1 transition"
          :class="selectedAnswer === 'A' ? 'bg-[#24544d] text-white ring-[#24544d]' : 'bg-[#edf2ef] text-[#426259] ring-[#6b8f86]/14 group-hover:bg-[#e4ece7]'"
        >
          A
        </span>
        <span class="text-base leading-relaxed text-[#23332f] sm:text-lg">{{ question.optionA }}</span>
      </button>

      <button type="button" :class="optionClass('B')" @click="$emit('select', 'B')">
        <span
          class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] text-sm font-black ring-1 transition"
          :class="selectedAnswer === 'B' ? 'bg-[#24544d] text-white ring-[#24544d]' : 'bg-[#edf2ef] text-[#426259] ring-[#6b8f86]/14 group-hover:bg-[#e4ece7]'"
        >
          B
        </span>
        <span class="text-base leading-relaxed text-[#23332f] sm:text-lg">{{ question.optionB }}</span>
      </button>
    </div>

    <p class="mt-6 text-center text-xs text-[#8a9c98]">
      没有正确或错误的答案，凭直觉选择即可
    </p>
  </article>
</template>
