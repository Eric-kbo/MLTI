<script setup lang="ts">
import type { CalculatedResult } from '@/types/assessment'
import ResultCard from '@/components/ResultCard.vue'

defineProps<{
  result: CalculatedResult
}>()

defineEmits<{
  reset: []
}>()
</script>

<template>
  <ResultCard :result="result" @reset="$emit('reset')" />
</template>
