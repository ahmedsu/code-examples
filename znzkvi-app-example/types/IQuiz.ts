// Generated by https://quicktype.io

export interface Response {
    code: string
    message: string
    data: Data
}

export interface Data {
    quiz: Quiz
    total_questions: number
    timer: number
}

export interface Quiz {
    id: number
    date: string
    questions: Question[]
}

export interface Question {
    id: number
    question: string
    category: number
    correct_answer: CorrectAnswer
    answers_rel: AnswersRel[]
    set_rel: SetRel
}

export interface AnswersRel {
    question_id: number
    order: CorrectAnswer
    answer: string
    correct: number
}

export enum CorrectAnswer {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D'
}

export interface SetRel {
    quiz_id: number
    question_id: number
    question_no: number
    correct: number
}
