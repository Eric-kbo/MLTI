import { resultMap } from '@/data/results'
import type {
  Answers,
  CalculatedResult,
  Question,
  ResultCode,
  Scores,
  ScoreLetter,
} from '@/types/assessment'

const initialScores: Scores = {
  F: 0,
  V: 0,
  S: 0,
  E: 0,
  G: 0,
  T: 0,
  P: 0,
  B: 0,
}

const tieBreakPairs: Array<readonly [ScoreLetter, ScoreLetter]> = [
  ['F', 'V'],
  ['S', 'E'],
  ['G', 'T'],
  ['P', 'B'],
]

function chooseLetter(scores: Scores, preferredOnTie: ScoreLetter, alternative: ScoreLetter) {
  // 平局时默认选择每组的前一个字母：F / S / G / P。
  // 如需修改平局策略，只需要调整 tieBreakPairs 中每组的顺序。
  return scores[preferredOnTie] >= scores[alternative] ? preferredOnTie : alternative
}

export function createEmptyScores(): Scores {
  return { ...initialScores }
}

export function calculateScores(answers: Answers, questions: Question[]): Scores {
  const scores = createEmptyScores()

  for (const question of questions) {
    const answer = answers[question.id]

    if (!answer) {
      continue
    }

    const scoreLetter = answer === 'A' ? question.scoreA : question.scoreB
    scores[scoreLetter] += 1
  }

  return scores
}

export function buildResultCode(scores: Scores): ResultCode {
  return tieBreakPairs
    .map(([preferredOnTie, alternative]) => chooseLetter(scores, preferredOnTie, alternative))
    .join('') as ResultCode
}

export function calculateResult(answers: Answers, questions: Question[]): CalculatedResult {
  const scores = calculateScores(answers, questions)
  const code = buildResultCode(scores)
  const resultDetail = resultMap[code]

  if (!resultDetail) {
    throw new Error(`未找到结果类型：${code}`)
  }

  return {
    code,
    scores,
    resultDetail,
  }
}
