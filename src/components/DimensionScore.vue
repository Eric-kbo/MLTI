<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  leftLetter: string
  rightLetter: string
  leftScore: number
  rightScore: number
}>()

const total = computed(() => props.leftScore + props.rightScore)
const leftPercent = computed(() => (total.value === 0 ? 50 : (props.leftScore / total.value) * 100))
const rightPercent = computed(() => 100 - leftPercent.value)
const winner = computed(() => (props.leftScore >= props.rightScore ? props.leftLetter : props.rightLetter))
const dominance = computed(() => Math.abs(leftPercent.value - 50))
const dominanceLabel = computed(() => {
  if (dominance.value < 10) return '轻微偏好'
  if (dominance.value < 25) return '明显偏好'
  return '强烈偏好'
})
</script>

<template>
  <section class="soft-card rounded-3xl p-5 sm:p-6">
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold text-[#1f2e2b]">{{ title }}</h3>
        <p class="mt-1 text-sm leading-6 text-[#667673]">{{ description }}</p>
      </div>
      <div class="flex flex-col items-center">
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#24544d] text-lg font-black text-white">{{ winner }}</span>
        <span class="mt-1 text-[10px] text-[#667673]">{{ dominanceLabel }}</span>
      </div>
    </div>

    <div class="mb-2 flex justify-between text-sm">
      <span class="font-semibold" :class="leftPercent >= 50 ? 'text-[#24544d]' : 'text-[#667673]'">
        {{ leftLetter }} · {{ Math.round(leftPercent) }}%
      </span>
      <span class="font-semibold" :class="rightPercent > 50 ? 'text-[#24544d]' : 'text-[#667673]'">
        {{ Math.round(rightPercent) }}% · {{ rightLetter }}
      </span>
    </div>
    <div class="flex h-4 overflow-hidden rounded-full bg-[#e7ece8]">
      <div
        class="rounded-l-full bg-gradient-to-r from-[#86a89f] to-[#24544d] transition-all duration-700 ease-out"
        :style="{ width: `${leftPercent}%` }"
      ></div>
      <div
        class="rounded-r-full bg-gradient-to-r from-[#b8c9c3] to-[#9cb5ae] transition-all duration-700 ease-out"
        :style="{ width: `${rightPercent}%` }"
      ></div>
    </div>
  </section>
</template>
