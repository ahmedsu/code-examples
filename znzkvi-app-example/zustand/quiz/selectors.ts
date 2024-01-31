import { IQuizData } from './types'

export const selectQuizData = (state: IQuizData) => state.quizData

export const selectSetQuizData = (state: IQuizData) => state.setQuizData
