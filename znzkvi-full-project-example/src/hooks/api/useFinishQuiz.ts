import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'
import useGlobalStore from '@zustand/global/store'

const useFinishQuiz = () => {
    const showMessage = useShowMessageWithCondition()
    const { setQuizActive } = useGlobalStore()

    const { data, mutateAsync } = useMutation(
        QueryKeys.FINISH_QUIZ,
        async ({
            api_token,
            quiz_id,
            questions
        }: {
            api_token: string | null
            quiz_id: number
            questions: string
            // questions: {
            //     [key: string]: {
            //         opened: 1 | 0
            //         answered: 1 | 0
            //         correct: 1 | 0
            //     }
            // }
        }) => {
            const res = await apiRequest({
                url: `quiz/finish-the-quiz?api_token=${api_token}&quiz_id=${quiz_id}&questions=${questions}`, //?api_token=${api_token}&quiz_id=${quiz_id}&questions=${questions}
                method: 'post',
                data: {
                    api_token,
                    quiz_id,
                    questions
                }
            })
            showMessage(res, false)
            setQuizActive(false)
            return res.data
        }
    )
    return { data, finishQuiz: mutateAsync }
}

export default useFinishQuiz
