import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'

const useCheckEmail = () => {
    const showMessage = useShowMessageWithCondition()

    const { data, mutateAsync } = useMutation(
        QueryKeys.CHECK_EMAIL,
        async ({ email, password }: { email: string; password: string }) => {
            const res = await apiRequest({
                url: 'auth/check-email-password',
                method: 'post',
                data: { email, password }
            })
            showMessage(res)
            return res.data
        }
    )
    return { data, checkEmail: mutateAsync }
}

export default useCheckEmail
