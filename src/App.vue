<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { questions } from '@/data/questions'
import type { AnswerOption, Answers, ResultCode } from '@/types/assessment'
import { calculateResult } from '@/utils/scoring'
import { incrementOnComplete } from '@/utils/counter'
import {
  clearProgress,
  createDefaultProgress,
  hasUnfinishedProgress,
  loadProgress,
  saveProgress,
} from '@/utils/storage'
import HomeView from '@/views/HomeView.vue'
import ResultView from '@/views/ResultView.vue'
import TestView from '@/views/TestView.vue'

type ViewName = 'home' | 'test' | 'result' | 'analyzing'

const storedProgress = loadProgress()
const initialProgress = storedProgress ?? createDefaultProgress()
const hasCompletedStoredResult =
  initialProgress.completed && Object.keys(initialProgress.answers).length === questions.length

const currentView = ref<ViewName>(hasCompletedStoredResult ? 'result' : 'home')
const currentIndex = ref(initialProgress.currentIndex)
const answers = ref<Answers>({ ...initialProgress.answers })
const completed = ref(hasCompletedStoredResult)
const resultCode = ref<ResultCode | undefined>(initialProgress.resultCode)

const totalQuestions = questions.length
const answerCount = computed(() => Object.keys(answers.value).length)
const currentQuestion = computed(() => questions[currentIndex.value] ?? questions[0])
const selectedAnswer = computed(() => answers.value[currentQuestion.value.id])
const hasProgress = computed(() =>
  hasUnfinishedProgress({
    currentIndex: currentIndex.value,
    answers: answers.value,
    completed: completed.value,
    resultCode: resultCode.value,
  }),
)
const calculatedResult = computed(() => {
  if (!completed.value) {
    return null
  }

  return calculateResult(answers.value, questions)
})

function persistProgress() {
  saveProgress({
    currentIndex: currentIndex.value,
    answers: answers.value,
    completed: completed.value,
    resultCode: resultCode.value,
  })
}

function resetState() {
  currentIndex.value = 0
  answers.value = {}
  completed.value = false
  resultCode.value = undefined
}

function startTest() {
  clearProgress()
  resetState()
  currentView.value = 'test'
}

function resumeTest() {
  const latestProgress = loadProgress()

  if (latestProgress) {
    currentIndex.value = latestProgress.currentIndex
    answers.value = { ...latestProgress.answers }
    completed.value = latestProgress.completed
    resultCode.value = latestProgress.resultCode
  }

  currentView.value = completed.value ? 'result' : 'test'
}

function goHome() {
  currentView.value = 'home'
}

function goPrevious() {
  if (currentIndex.value === 0) {
    return
  }

  completed.value = false
  resultCode.value = undefined
  currentIndex.value -= 1
  currentView.value = 'test'
  persistProgress()
}

function selectAnswer(option: AnswerOption) {
  const question = currentQuestion.value
  const nextAnswers = {
    ...answers.value,
    [question.id]: option,
  }

  answers.value = nextAnswers

  if (currentIndex.value >= totalQuestions - 1) {
    const result = calculateResult(nextAnswers, questions)
    completed.value = true
    resultCode.value = result.code
    currentView.value = 'analyzing'
    persistProgress()
    incrementOnComplete()
    setTimeout(() => {
      currentView.value = 'result'
    }, 2500)
    return
  }

  completed.value = false
  resultCode.value = undefined
  currentIndex.value += 1
  persistProgress()
}

function restartTest() {
  clearProgress()
  resetState()
  currentView.value = 'test'
}
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-editorial-mesh text-[#1f2e2b]">
    <div class="pointer-events-none fixed inset-0 opacity-20 [background-image:linear-gradient(rgba(31,46,43,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(31,46,43,0.06)_1px,transparent_1px)] [background-size:52px_52px]"></div>
    <div class="pointer-events-none fixed -left-20 top-16 h-64 w-64 rounded-full bg-[#dfe8e2]/80 blur-3xl"></div>
    <div class="pointer-events-none fixed right-0 top-24 h-72 w-72 rounded-full bg-[#d3dfd8]/65 blur-3xl"></div>
    <div class="pointer-events-none fixed bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#e7eeea]/70 blur-3xl"></div>

    <div class="relative z-10">
      <AppHeader @go-home="goHome" />

      <Transition name="fade" mode="out-in">
        <HomeView
          v-if="currentView === 'home'"
          :has-progress="hasProgress"
          :answer-count="answerCount"
          @start="startTest"
          @resume="resumeTest"
        />
        <TestView
          v-else-if="currentView === 'test'"
          :current-index="currentIndex"
          :total="totalQuestions"
          :question="currentQuestion"
          :selected-answer="selectedAnswer"
          @select="selectAnswer"
          @previous="goPrevious"
        />
        <div v-else-if="currentView === 'analyzing'" class="flex min-h-[60vh] flex-col items-center justify-center px-5">
          <div class="text-center animate-fade-up">
            <div class="mx-auto mb-8 relative h-20 w-20">
              <div class="absolute inset-0 animate-spin rounded-full border-4 border-[#e7ece8] border-t-[#24544d]"></div>
              <div class="absolute inset-2 animate-spin rounded-full border-4 border-[#e7ece8] border-b-[#6b8f86]" style="animation-direction: reverse; animation-duration: 1.5s"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="font-display text-lg font-black text-[#24544d]">AI</span>
              </div>
            </div>
            <h2 class="font-display text-3xl font-bold text-[#1f2e2b] sm:text-4xl">正在生成你的 MLTI 画像</h2>
            <p class="mt-4 text-lg text-[#667673]">分析 4 个维度 · 匹配 16 种脑力类型...</p>
            <div class="mt-8 flex justify-center gap-2">
              <span class="h-2 w-2 animate-bounce rounded-full bg-[#24544d]" style="animation-delay: 0ms"></span>
              <span class="h-2 w-2 animate-bounce rounded-full bg-[#6b8f86]" style="animation-delay: 150ms"></span>
              <span class="h-2 w-2 animate-bounce rounded-full bg-[#9cb5ae]" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>
        <ResultView
          v-else-if="calculatedResult"
          :result="calculatedResult"
          @reset="restartTest"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 280ms ease, transform 280ms ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
