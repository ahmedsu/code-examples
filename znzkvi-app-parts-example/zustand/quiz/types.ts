import { Response } from '@customTypes/IQuiz'

export interface IQuizData {
    quizData: Response | null
    setQuizData: (val: Response | null) => void
}
