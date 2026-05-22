const COUNTER_KEY = 'mlti_total_count'
const COUNTED_KEY = 'mlti_user_counted'
const BASE_COUNT = 1024

function getStoredCount(): number {
  const stored = localStorage.getItem(COUNTER_KEY)
  return stored ? parseInt(stored, 10) : BASE_COUNT
}

function setStoredCount(n: number): void {
  localStorage.setItem(COUNTER_KEY, String(n))
}

function hasBeenCounted(): boolean {
  return localStorage.getItem(COUNTED_KEY) === '1'
}

function markCounted(): void {
  localStorage.setItem(COUNTED_KEY, '1')
}

export function getVisitorCount(): number {
  if (!hasBeenCounted()) {
    markCounted()
    const current = getStoredCount() + 1
    setStoredCount(current)
    return current
  }
  return getStoredCount()
}

export function incrementOnComplete(): void {
  const current = getStoredCount() + 1
  setStoredCount(current)
}

export function formatCount(n: number): string {
  if (n >= 10000) {
    return (n / 10000).toFixed(1) + ' 万'
  }
  return n.toLocaleString('zh-CN')
}

