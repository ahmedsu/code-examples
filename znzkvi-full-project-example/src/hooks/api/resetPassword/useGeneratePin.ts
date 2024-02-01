import QueryKeys from '@constants/QueryKeys'
import { useMutation } from 'react-query'
import apiRequest from '../apiRequest'
import { useShowMessageWithCondition } from '@hooks/useShowMessage'

const useGeneratePin = () => {
    const showMessage = useShowMessageWithCondition()

    const { mutateAsync } = useMutation(
        QueryKeys.GENERATE_PIN,
        async (email: string) => {
            const res = await apiRequest({
                url: 'auth/restart-password/generate-pin',
                method: 'post',
                data: { email }
            })
            showMessage(res)
            return res.data
        }
    )
    return { generatePin: mutateAsync }
}

export default useGeneratePin
