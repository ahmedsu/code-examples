import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'
import useAuthStore from '@zustand/auth/store'

const useDeleteAccount = () => {
    const showMessage = useShowMessageWithCondition()
    const { token } = useAuthStore()
    const { mutateAsync: deleteUser } = useMutation(
        QueryKeys.DELETE_ACCOUNT,
        async () => {
            const res = await apiRequest({
                url: 'users/delete',
                data: {
                    api_token: token
                },
                method: 'delete'
            })
            showMessage(res)
            return res.data
        }
    )

    return deleteUser
}

export default useDeleteAccount
