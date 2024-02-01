import { create } from 'zustand'
import { IQuizData } from './types'
import { Response } from '@customTypes/IQuiz'

const useQuizStore = create<IQuizData>()(set => ({
    quizData: null,
    setQuizData: (val: Response | null) => {
        set({
            quizData: val
        })
    }
}))

export default useQuizStore
