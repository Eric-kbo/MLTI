<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

const percentage = computed(() => {
  if (props.total <= 0) return 0
  return Math.min(100, Math.max(0, (props.current / props.total) * 100))
})

const encouragement = computed(() => {
  const pct = percentage.value
  if (pct <= 25) return '刚刚开始，凭直觉选就好'
  if (pct <= 50) return '进展顺利，继续保持'
  if (pct <= 75) return '已经过半了，马上就能看到结果'
  if (pct < 100) return '快完成了，最后几题！'
  return '完成！'
})
</script>

<template>
  <div class="w-full" role="progressbar" :aria-valuenow="current" :aria-valuemin="0" :aria-valuemax="total">
    <div class="mb-3 flex items-center justify-between">
      <span class="text-sm text-[#667673]">{{ encouragement }}</span>
      <span class="text-sm font-bold text-[#24544d]">{{ current }} / {{ total }}</span>
    </div>
    <div class="relative h-3 overflow-hidden rounded-full bg-[#e7ece8]">
      <div
        class="h-full rounded-full bg-gradient-to-r from-[#86a89f] to-[#24544d] transition-all duration-500 ease-out"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
    <div class="mt-2 flex justify-between text-xs text-[#8a9c98]">
      <span>信息方式</span>
      <span>思考方式</span>
      <span>AI使用</span>
      <span>输出方式</span>
    </div>
  </div>
</template>
