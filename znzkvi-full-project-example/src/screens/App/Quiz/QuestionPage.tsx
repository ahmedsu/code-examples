import React, { useState } from 'react'
import Divider from '@components/Divider'
import AnswerContainer from '@components/Quiz/AnswerContainer'
import QuestionContainer from '@components/Quiz/QuestionContainer'
import { View, StyleSheet } from 'react-native'
import { AnswersRel, CorrectAnswer, Question } from '@customTypes/IQuiz'
import Colors from '@constants/Colors'

interface Props {
    question: Question
    backgroundColor?: (typeof Colors)[keyof typeof Colors]
    onAnswer?: (answer: AnswersRel) => void
    isAnswerLocked: () => boolean
    blockUnblockAnswers: (val: boolean) => void
    beforeAnswer: () => void
}

const QuestionPage = ({
    question,
    backgroundColor,
    onAnswer,
    isAnswerLocked,
    blockUnblockAnswers,
    beforeAnswer
}: Props) => {
    const [answerBackgroundColor, setAnswerBackgroundColor] = useState<
        undefined | (typeof Colors)[keyof typeof Colors]
    >()
    const [answerLetter, setAnswerLetter] = useState<CorrectAnswer>()
    // const blockFurtherAnswers = useRef(false)
    return (
        <View style={localStyles.fullWidth}>
            <Divider size={20} />
            <QuestionContainer
                questionText={question.question}
                backgroundColor={backgroundColor}
            />
            {question.answers_rel.map(answer => {
                return (
                    <React.Fragment key={answer.order}>
                        <Divider size={20} />
                        <AnswerContainer
                            isAnswerLocked={isAnswerLocked}
                            backgroundColor={
                                answerLetter === answer.order
                                    ? answerBackgroundColor
                                    : backgroundColor
                            }
                            onPress={(selectedAnswer: CorrectAnswer) => {
                                //  if (blockFurtherAnswers.current) return
                                if (isAnswerLocked()) return
                                //obojiti jel tacan il netacan
                                //cekati 1 sekundu
                                //zapoceti novi tajmer
                                beforeAnswer()
                                setAnswerLetter(selectedAnswer)
                                setAnswerBackgroundColor(
                                    selectedAnswer === answer.order &&
                                        answer.correct
                                        ? Colors.lightGreen
                                        : Colors.red
                                )
                                blockUnblockAnswers(true)
                                //  blockFurtherAnswers.current = true
                                setTimeout(() => {
                                    onAnswer?.(
                                        question.answers_rel.find(
                                            e => e.order === selectedAnswer
                                        ) as AnswersRel
                                    )
                                }, 1000)
                            }}
                            isCorrectAnswer={!!answer.correct}
                            letter={answer.order}
                            title={answer.answer}
                        />
                    </React.Fragment>
                )
            })}
        </View>
    )
}

const localStyles = StyleSheet.create({
    fullWidth: {
        width: '100%'
    }
})
export default QuestionPage
