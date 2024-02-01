import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from './apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'
import useAuthStore from '@zustand/auth/store'
import { IUser } from '@customTypes/IUser'

const useEditUserData = () => {
    const showMessage = useShowMessageWithCondition()
    const { token } = useAuthStore()
    const { mutateAsync } = useMutation(
        QueryKeys.EDIT_USER_DATA,
        async ({
            name,
            username,
            email,
            phone,
            city,
            country
        }: Partial<IUser>) => {
            const res = await apiRequest({
                url: 'users/update',
                data: {
                    api_token: token,
                    name,
                    username,
                    email,
                    phone,
                    city,
                    country
                },
                method: 'post'
            })
            showMessage(res)
            return res.data
        }
    )

    return { editUserData: mutateAsync }
}

export default useEditUserData
