<script setup lang="ts">
import type { AnswerOption, Question } from '@/types/assessment'

const props = defineProps<{
  question: Question
  selectedAnswer?: AnswerOption
}>()

defineEmits<{
  select: [option: AnswerOption]
}>()

function optionClass(option: AnswerOption) {
  const selected = props.selectedAnswer === option

  return [
    'group flex w-full items-start gap-4 rounded-[1.8rem] border p-5 text-left transition duration-200 sm:p-6',
    selected
      ? 'border-[#6b8f86]/35 bg-[#f1f5f2] shadow-[0_14px_30px_rgba(36,84,77,0.1)]'
      : 'border-[#1f2e2b]/8 bg-white/88 hover:-translate-y-0.5 hover:border-[#6b8f86]/28 hover:bg-[#f6f8f6]',
  ]
}
</script>

<template>
  <article class="glass-card rounded-[2rem] p-6 sm:p-8 lg:p-10">
    <div class="mb-7 inline-flex rounded-full border border-[#1f2e2b]/8 bg-[#eff4f1] px-3 py-1 text-xs font-semibold text-[#4f7068]">
      第 {{ question.id }} 题
    </div>

    <h1 class="text-2xl font-bold leading-snug text-[#1f2e2b] sm:text-3xl">
      {{ question.question }}
    </h1>

    <div class="mt-8 grid gap-4">
      <button type="button" :class="optionClass('A')" @click="$emit('select', 'A')">
        <span
          class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-[#edf2ef] text-sm font-black text-[#426259] ring-1 ring-[#6b8f86]/14 transition group-hover:bg-[#e4ece7]"
        >
          A
        </span>
        <span class="text-base leading-relaxed text-[#23332f] sm:text-lg">{{ question.optionA }}</span>
      </button>

      <button type="button" :class="optionClass('B')" @click="$emit('select', 'B')">
        <span
          class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-[#edf2ef] text-sm font-black text-[#426259] ring-1 ring-[#6b8f86]/14 transition group-hover:bg-[#e4ece7]"
        >
          B
        </span>
        <span class="text-base leading-relaxed text-[#23332f] sm:text-lg">{{ question.optionB }}</span>
      </button>
    </div>
  </article>
</template>
