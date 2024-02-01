import useAlertStore from '@zustand/alertManagement/store'
import useLogout from './useLogout'

const useShowMessage = () => {
    const { setMessageAndType } = useAlertStore()
    return setMessageAndType
}

export const useShowMessageWithCondition = () => {
    const showMessage = useShowMessage()
    const logout = useLogout()
    const showMessageWithCondition = (
        res: {
            data: {
                message: string
                code: string
                data: { banned: number }
            }
        },
        shouldShowSuccess = true
    ) => {
        if (res?.data?.data?.banned === 1) {
            logout()
            setTimeout(() => {
                showMessage('greška', 'Vas nalog je banovan!', 'error')
            }, 500)
        }
        if (res?.data?.code === '1106') logout()
        if (res.data?.code !== '0000') {
            showMessage('greška', res.data.message, 'error')
        } else {
            if (shouldShowSuccess)
                showMessage('uspjeh', res.data.message, 'success')
        }
    }
    return showMessageWithCondition
}

export default useShowMessage
