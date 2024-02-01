import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from '../apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'

const useGeneratePassword = () => {
    const showMessage = useShowMessageWithCondition()

    const { mutateAsync } = useMutation(
        QueryKeys.VERIFY_PIN,
        async ({
            email,
            pin,
            password
        }: {
            email: string
            pin: string
            password: string
        }) => {
            const res = await apiRequest({
                url: 'auth/restart-password/new-password',
                method: 'post',
                data: { email, pin, password }
            })
            showMessage(res)
            return res.data
        }
    )
    return { generatePassword: mutateAsync }
}

export default useGeneratePassword
