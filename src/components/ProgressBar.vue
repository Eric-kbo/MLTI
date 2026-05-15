<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

const percentage = computed(() => {
  if (props.total <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, (props.current / props.total) * 100))
})
</script>

<template>
  <div class="w-full" role="progressbar" :aria-valuenow="current" :aria-valuemin="0" :aria-valuemax="total">
    <div class="mb-3 flex items-center justify-between text-sm text-[#667673]">
      <span>当前进度</span>
      <span class="font-semibold text-[#1f2e2b]">{{ current }} / {{ total }}</span>
    </div>
    <div class="h-3 overflow-hidden rounded-full bg-[#e7ece8] p-0.5">
      <div
        class="h-full rounded-full bg-gradient-to-r from-[#86a89f] to-[#24544d] transition-all duration-500"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>
