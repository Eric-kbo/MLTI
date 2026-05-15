<script setup lang="ts">
defineEmits<{
  goHome: []
}>()
</script>

<template>
  <header class="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
    <button
      type="button"
      class="group flex items-center gap-3 text-left"
      aria-label="返回首页"
      @click="$emit('goHome')"
    >
      <span
        class="flex h-11 w-11 items-center justify-center rounded-[1.2rem] border border-[#1f2e2b]/8 bg-[#24544d] text-lg font-black text-white shadow-[0_10px_24px_rgba(36,84,77,0.14)] transition group-hover:scale-105"
      >
        AI
      </span>
      <span>
        <span class="block font-display text-sm font-bold tracking-[0.28em] text-[#1f2e2b]">BRAIN TEST</span>
        <span class="block text-xs text-[#667673]">AI时代脑力测评</span>
      </span>
    </button>

    <div class="hidden items-center gap-2 rounded-full border border-[#1f2e2b]/8 bg-white/80 px-4 py-2 text-xs text-[#667673] shadow-sm sm:flex">
      <span class="h-2 w-2 rounded-full bg-[#6b8f86]"></span>
      32题 · 约5分钟 · 本地保存
    </div>
  </header>
</template>
