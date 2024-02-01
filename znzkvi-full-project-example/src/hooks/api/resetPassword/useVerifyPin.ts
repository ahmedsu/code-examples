import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from '../apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'

const useVerifyPin = () => {
    const showMessage = useShowMessageWithCondition()

    const { mutateAsync } = useMutation(
        QueryKeys.VERIFY_PIN,
        async ({ email, pin }: { email: string; pin: string }) => {
            const res = await apiRequest({
                url: 'auth/restart-password/verify-pin',
                method: 'post',
                data: { email, pin }
            })
            showMessage(res)
            return res.data
        }
    )
    return { verifyPin: mutateAsync }
}

export default useVerifyPin
