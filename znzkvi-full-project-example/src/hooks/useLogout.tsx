import * as Keychain from 'react-native-keychain'
import useAuthStore from '@zustand/auth/store'

const useLogout = () => {
    const { setTokenValues } = useAuthStore()
    const logout = async () => {
        await Keychain.resetGenericPassword()
        setTokenValues({ token: '', hasToken: false })
    }
    return logout
}

export default useLogout
