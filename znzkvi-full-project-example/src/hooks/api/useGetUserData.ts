import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'
import useAuthStore from '@zustand/auth/store'
import { IUser } from '@customTypes/IUser'

const useGetUserData = () => {
    const showMessage = useShowMessageWithCondition()
    const { token } = useAuthStore()
    const { mutateAsync } = useMutation(
        QueryKeys.GET_USER_DATA,
        async (): Promise<{ data: IUser; code: string }> => {
            const res = await apiRequest({
                url: 'users/get-data',
                data: {
                    api_token: token
                },
                method: 'post'
            })
            showMessage(res, false)
            return res.data
        }
    )

    return { getUserData: mutateAsync }
}

export default useGetUserData
