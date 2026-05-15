export type Dimension = 'information' | 'thinking' | 'aiUsage' | 'output'

export type InformationLetter = 'F' | 'V'
export type ThinkingLetter = 'S' | 'E'
export type AiUsageLetter = 'G' | 'T'
export type OutputLetter = 'P' | 'B'
export type ScoreLetter = InformationLetter | ThinkingLetter | AiUsageLetter | OutputLetter
export type ResultCode = `${InformationLetter}${ThinkingLetter}${AiUsageLetter}${OutputLetter}`

export type AnswerOption = 'A' | 'B'

export interface Question {
  id: number
  dimension: Dimension
  question: string
  optionA: string
  optionB: string
  scoreA: ScoreLetter
  scoreB: ScoreLetter
}

export type Answers = Record<number, AnswerOption>

export type Scores = Record<ScoreLetter, number>

export interface ResultDetail {
  code: ResultCode
  name: string
  summary: string
  strengths: string
  risks: string
  aiAdvice: string
  growthAdvice: string
}

export interface CalculatedResult {
  code: ResultCode
  scores: Scores
  resultDetail: ResultDetail
}

export interface AssessmentProgress {
  currentIndex: number
  answers: Answers
  completed: boolean
  resultCode?: ResultCode
}

export interface DimensionMeta {
  key: Dimension
  title: string
  letters: readonly [ScoreLetter, ScoreLetter]
  subtitle: string
  description: string
}
