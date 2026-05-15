import type { AssessmentProgress, ResultCode } from '@/types/assessment'

const STORAGE_KEY = 'ai-brain-assessment-progress'

const defaultProgress: AssessmentProgress = {
  currentIndex: 0,
  answers: {},
  completed: false,
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeProgress(value: unknown): AssessmentProgress | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const progress = value as Partial<AssessmentProgress>
  const currentIndex = Number.isInteger(progress.currentIndex) ? Number(progress.currentIndex) : 0
  const answers = progress.answers && typeof progress.answers === 'object' ? progress.answers : {}
  const completed = Boolean(progress.completed)
  const resultCode = progress.resultCode as ResultCode | undefined

  return {
    currentIndex: Math.max(0, Math.min(currentIndex, 31)),
    answers,
    completed,
    resultCode,
  }
}

export function createDefaultProgress(): AssessmentProgress {
  return {
    ...defaultProgress,
    answers: {},
  }
}

export function loadProgress(): AssessmentProgress | null {
  if (!isBrowser()) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeProgress(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function saveProgress(progress: AssessmentProgress) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function clearProgress() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export function hasUnfinishedProgress(progress: AssessmentProgress | null) {
  return Boolean(progress && !progress.completed && Object.keys(progress.answers).length > 0)
}
