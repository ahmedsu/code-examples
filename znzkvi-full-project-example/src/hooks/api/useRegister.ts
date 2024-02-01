import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'

interface IUserAccount {
    name: string
    username: string
    email: string
    password: string
    phone: string
    city: string
    country?: number
}
const useRegister = () => {
    const showMessage = useShowMessageWithCondition()
    const { data, mutateAsync } = useMutation(
        QueryKeys.CREATE_ACCOUNT,
        async (userAccount: IUserAccount) => {
            const res = await apiRequest({
                url: 'auth/register',
                method: 'post',
                data: { ...userAccount }
            })
            showMessage(res)
            return res.data
        }
    )
    return { data, register: mutateAsync }
}

export default useRegister
