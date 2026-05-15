<script setup lang="ts">
import type { AnswerOption, Question } from '@/types/assessment'
import ProgressBar from '@/components/ProgressBar.vue'
import QuestionCard from '@/components/QuestionCard.vue'

defineProps<{
  currentIndex: number
  total: number
  question: Question
  selectedAnswer?: AnswerOption
}>()

defineEmits<{
  select: [option: AnswerOption]
  previous: []
}>()
</script>

<template>
  <main class="mx-auto w-full max-w-4xl px-5 pb-16 pt-4 sm:px-8 sm:pt-8">
    <div class="mb-6 rounded-[1.5rem] border border-[#1f2e2b]/8 bg-white/82 p-5 shadow-card backdrop-blur-xl">
      <ProgressBar :current="currentIndex + 1" :total="total" />
    </div>

    <QuestionCard :question="question" :selected-answer="selectedAnswer" @select="$emit('select', $event)" />

    <div class="mt-6 flex items-center justify-between gap-4">
      <button
        type="button"
        class="rounded-full border border-[#1f2e2b]/10 bg-white/80 px-6 py-3 text-sm font-semibold text-[#23332f] shadow-sm transition hover:border-[#6b8f86]/28 hover:bg-[#f2f5f2] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#1f2e2b]/10 disabled:hover:bg-white/80"
        :disabled="currentIndex === 0"
        @click="$emit('previous')"
      >
        上一题
      </button>
      <p class="text-right text-sm text-[#667673]">
        点击选项后会自动进入下一题，可随时返回修改。
      </p>
    </div>
  </main>
</template>
