import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'
import useAuthStore from '@zustand/auth/store'
import { Response } from '@customTypes/IQuiz'

const useCreateQuiz = () => {
    const showMessage = useShowMessageWithCondition()
    const { token } = useAuthStore()
    const { mutateAsync } = useMutation(
        QueryKeys.CREATE_QUIZ,
        async (): Promise<Response> => {
            const res = await apiRequest({
                url: `quiz/create-quiz?api_token=${token}`,
                method: 'post'
            })
            showMessage(res, false)
            return res.data
        }
    )
    return { createQuiz: mutateAsync }
}

export default useCreateQuiz
