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
</script>

<template>
  <section class="soft-card rounded-3xl p-5">
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 class="font-semibold text-[#1f2e2b]">{{ title }}</h3>
        <p class="mt-1 text-sm leading-6 text-[#667673]">{{ description }}</p>
      </div>
      <span class="rounded-full bg-[#24544d] px-3 py-1 text-sm font-bold text-white">{{ winner }}</span>
    </div>

    <div class="mb-2 flex justify-between text-sm text-[#667673]">
      <span>{{ leftLetter }} · {{ leftScore }}</span>
      <span>{{ rightLetter }} · {{ rightScore }}</span>
    </div>
    <div class="flex h-3 overflow-hidden rounded-full bg-[#e7ece8]">
      <div
        class="bg-[#9cb5ae] transition-all duration-500"
        :style="{ width: `${leftPercent}%` }"
      ></div>
      <div
        class="bg-[#24544d] transition-all duration-500"
        :style="{ width: `${rightPercent}%` }"
      ></div>
    </div>
  </section>
</template>
