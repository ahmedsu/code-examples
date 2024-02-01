import { View, StyleSheet, BackHandler } from 'react-native'
import React, {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import QuestionHeader from '@components/Quiz/QuestionHeader'
import SvgIcons from '@assets/svgs/icons'
import RoundButton from '@components/RoundButton'
import Divider from '@components/Divider'
import CountdownContainer from '@components/Quiz/CountdownContainer'
import QuizBottomTab from '@components/Quiz/QuizBottomTab'
import { scaleByHeight } from '@constants/Scaling'
import QuestionPage from './QuestionPage'
import PagerView from 'react-native-pager-view'
import Container, { Background } from '@components/Container'
import useGlobalStore from '@zustand/global/store'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppStackNavigationProp, AppStackParams } from '@navigation/AppStack'
import selectCategoryData from '@helpers/selectCategoryBackground'
import Colors from '@constants/Colors'
import { AnswersRel } from '@customTypes/IQuiz'
import useFinishQuiz from '@hooks/api/useFinishQuiz'
import useAuthStore from '@zustand/auth/store'
import Routes from '@navigation/Routes'

const Quiz = () => {
    const { setQuizActive } = useGlobalStore()
    useLayoutEffect(() => {
        setQuizActive(true)
    }, [setQuizActive])
    const [answers, setAnswers] = useState<
        ((AnswersRel & { answered: boolean }) | null)[]
    >([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const route = useRoute<RouteProp<AppStackParams, 'Quiz'>>()
    const isLastQuestion = useMemo(
        () => currentQuestion >= 6,
        [currentQuestion]
    )
    const countdownRef = useRef<{
        rerunAnimation: () => void
        endFn: (shouldRunAnimation?: boolean) => void
        answerFn: () => void
        runAnimation: (cb: () => void) => void
        resetAnimation: () => void
        cancelAnimation: () => void
        pause: () => void
        unpause: () => void
    }>(null)
    const viewPagerRef = useRef<PagerView | null>(null)
    const { finishQuiz } = useFinishQuiz()
    const { token } = useAuthStore()
    const navigation = useNavigation<AppStackNavigationProp>()
    const blockAnswersAfterTimeFinish = useRef(false)
    const jelIstekloVrijeme = useRef(false)
    const [currentPageData, setCurrentPageData] = useState<{
        background: Background
        strongerBackground: (typeof Colors)[keyof typeof Colors]
        headerBackgroundColor: (typeof Colors)[keyof typeof Colors]
        title: string
        headerIcon: ReactNode
    } | null>({
        background: 'BlueBg',
        strongerBackground: Colors.blue,
        headerBackgroundColor: Colors.lightBlue,
        title: 'mentalno razgibavanje',
        headerIcon: (
            <SvgIcons.MentalnoRazgibavanje
                height={scaleByHeight(64)}
                width={scaleByHeight(64)}
            />
        )
    })
    const currentQuestionRef = useRef(currentQuestion)
    currentQuestionRef.current = currentQuestion
    const answersRef = useRef(answers)
    answersRef.current = answers
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                return true
            }
        )
        return () => backHandler.remove()
    }, [])

    const endQuizFn = useCallback(
        async (didUserQuit = false) => {
            const correctAnswers = answers.filter(e => e?.correct)

            const quiz_id = route.params.quizData?.data?.quiz?.id

            let newAnswers = [...answers]
            if (didUserQuit) {
                for (
                    let i = answers.length;
                    i <
                    Object.keys(route.params.quizData.data.quiz.questions)
                        .length;
                    i++
                ) {
                    newAnswers = [
                        ...newAnswers,
                        {
                            question_id:
                                route.params.quizData?.data?.quiz?.questions[i]
                                    .id,
                            answered: false,
                            opened: 0
                        }
                    ]
                }
            }
            const questionsForSend = newAnswers.reduce((acc, e) => {
                //@ts-ignore
                acc[`${e?.question_id}`] = {
                    opened: e?.opened ?? 1,
                    answered: e?.answered ? 1 : 0,
                    correct: e?.correct ? 1 : 0
                }
                return acc
            }, {})
            const obj = {
                quiz_id,
                api_token: token,
                questions: JSON.stringify(questionsForSend)
            }
            finishQuiz(obj)
            if (!didUserQuit) {
                navigation.navigate(Routes.AppStack.Success, {
                    correct_answers: correctAnswers.length
                })
            }
        },
        [
            answers,
            finishQuiz,
            navigation,
            route.params.quizData.data.quiz,
            token
        ]
    )

    useEffect(() => {
        if (answers.length === 7) {
            // const fn = async () => {
            //     const correctAnswers = answers.filter(e => e?.correct)

            //     const quiz_id = route.params.quizData?.data?.quiz?.id

            //     const obj = {
            //         quiz_id,
            //         api_token: token,
            //         questions: JSON.stringify(
            //             answers.reduce((acc, e) => {
            //                 //@ts-ignore
            //                 acc[`${e?.question_id}`] = {
            //                     opened: 1,
            //                     answered: e?.answered ? 1 : 0,
            //                     correct: e?.correct ? 1 : 0
            //                 }
            //                 return acc
            //             }, {})
            //         )
            //     }
            //     finishQuiz(obj)
            //     navigation.navigate(Routes.AppStack.Success, {
            //         correct_answers: correctAnswers.length
            //     })
            // }
            endQuizFn(false)
        }
    }, [endQuizFn, answers])

    const setNextQuestion = useCallback(() => {
        if (currentQuestionRef.current >= answersRef.current.length) {
            if (!blockAnswersAfterTimeFinish.current)
                setAnswers(prev => {
                    return [
                        ...prev,
                        {
                            question_id:
                                route.params.quizData?.data?.quiz?.questions[
                                    currentQuestionRef.current
                                ].id,
                            answered: false
                        }
                    ]
                })
        }

        if (currentQuestionRef.current >= 6) {
            return
        }
        blockAnswersAfterTimeFinish.current = true
        setCurrentPageData(
            selectCategoryData(
                route.params.quizData?.data?.quiz?.questions[
                    currentQuestionRef.current + 1 //GET CATEGORY FOR NEXT QUESTION
                ].category
            )
        )
        setCurrentQuestion(prev => prev + 1)
    }, [route.params.quizData?.data?.quiz])

    const setNextQuestionRef = useRef(setNextQuestion)
    setNextQuestionRef.current = setNextQuestion
    const setIstekloVrijeme = () => {
        jelIstekloVrijeme.current = true
        setNextQuestionRef.current()
    }
    const setVrijemeIstekloISljPitanjeRef = useRef(setIstekloVrijeme)
    setVrijemeIstekloISljPitanjeRef.current = setIstekloVrijeme
    useEffect(() => {
        viewPagerRef.current?.setPage(currentQuestion)
        countdownRef?.current?.runAnimation(
            setVrijemeIstekloISljPitanjeRef.current
        )
        setTimeout(() => {
            countdownRef.current?.unpause()
        }, 100) //This timeout works great
        setTimeout(() => {
            blockAnswersAfterTimeFinish.current = false
        }, 1000)
    }, [currentQuestion])

    const onAnswer = useCallback((answer: AnswersRel) => {
        if (blockAnswersAfterTimeFinish.current) {
            setAnswers(prev => {
                return [...prev, { ...answer, answered: true }]
            })
            //ovde ide kad je pitanje odgovoreno na vrijeme
            //viewPagerRef.current?.setPage(currentQuestion)
            countdownRef?.current?.resetAnimation()
            if (currentQuestionRef.current === answersRef.current.length) {
                countdownRef?.current?.runAnimation(setNextQuestionRef.current)
            } else setNextQuestionRef.current()
        } else if (!blockAnswersAfterTimeFinish.current) {
            // ovde ide kad istekne vrijeme
            countdownRef?.current?.runAnimation(setNextQuestionRef.current)
        }
        jelIstekloVrijeme.current = false
    }, [])
    const beforeAnswer = useCallback(() => {
        countdownRef.current?.pause()
    }, [])
    const unlockAnswers = () => {
        blockAnswersAfterTimeFinish.current = false
    }
    const blockUnblockAnswers = (answer: boolean) => {
        blockAnswersAfterTimeFinish.current = answer
    }
    const isAnswerLocked = () => blockAnswersAfterTimeFinish.current

    return (
        <Container
            style={localStyles.container}
            background={currentPageData?.background}
            childrenContainerStyle={localStyles.horizontalPadding}>
            <View style={localStyles.flexOne}>
                <QuestionHeader
                    backgroundColor={currentPageData?.headerBackgroundColor}
                    currentQuestion={currentQuestion + 1}
                    numberOfQuestions={7}
                    icon={<RoundButton icon={currentPageData?.headerIcon} />}
                    title={currentPageData?.title || 'mentalno razgibavanje'}
                />
                <PagerView
                    ref={viewPagerRef}
                    scrollEnabled={false}
                    style={localStyles.flexOne}
                    pageMargin={20}>
                    {Object.values(
                        route.params.quizData?.data?.quiz?.questions || []
                    ).map(question => {
                        return (
                            <View
                                style={localStyles.fullWidthHeight}
                                key={question.id}>
                                <QuestionPage
                                    blockUnblockAnswers={blockUnblockAnswers}
                                    isAnswerLocked={isAnswerLocked}
                                    beforeAnswer={beforeAnswer}
                                    onAnswer={onAnswer}
                                    question={question}
                                    backgroundColor={
                                        currentPageData?.strongerBackground
                                    }
                                />
                            </View>
                        )
                    })}
                </PagerView>
            </View>
            <CountdownContainer
                unlockAnswers={unlockAnswers}
                seconds={route.params.quizData?.data?.timer}
                ref={countdownRef}
                isLastQuestion={isLastQuestion}
                backgroundColor={currentPageData?.strongerBackground}
            />
            <Divider size={20} />
            <QuizBottomTab
                endQuizFn={endQuizFn}
                // pause={countdownRef.current?.pause}
                // unpause={countdownRef.current?.unpause}
            />
            <Divider size={20} />
        </Container>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        //  paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    flexOne: {
        flex: 1
    },
    contentContainerStyles: {
        flexGrow: 1
    },
    fullWidthHeight: {
        width: '100%',
        height: '100%'
    },
    horizontalPadding: {
        paddingHorizontal: 20
    }
})
export default Quiz
