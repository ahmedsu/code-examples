import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'

const useLogin = () => {
    const showMessage = useShowMessageWithCondition()
    const { data, mutateAsync } = useMutation(
        QueryKeys.LOGIN,
        async ({
            username,
            password
        }: {
            username: string
            password: string
        }) => {
            const res = await apiRequest({
                url: 'auth',
                method: 'post',
                data: { username, password }
            })
            showMessage(res, false)
            return res.data
        }
    )
    return { data, login: mutateAsync }
}

export default useLogin
