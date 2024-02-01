import Loader from 'components/Loader'
import { logOut } from 'helpers/userService'
import { useDispatch, useSelector } from './src/hooks/reduxHooks'
import Navigator from 'navigation'
import React, { useEffect, useState } from 'react'
import { AppState, StatusBar } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { restoreToken } from 'redux/actions/loginActions'
import store from 'redux/store'
import NetInfo from '@react-native-community/netinfo'
import { uploadPhotosInPending } from 'helpers/uploadService'
import FlashMessage from 'react-native-flash-message'
import * as Sentry from '@sentry/react-native'
import checkConnection from 'helpers/checkConnection'

Sentry.init({
    dsn: 'https://964c54f9370d4dc6a7eef93d3434ca88@o4503998947721216.ingest.sentry.io/4503998950866944',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0
})

interface StatusBarProps {
    backgroundColor: string
}

const MyStatusBar = ({ backgroundColor }: StatusBarProps) => {
    return (
        <StatusBar
            translucent
            backgroundColor={backgroundColor}
            barStyle="light-content"
        />
    )
}
const App = () => {
    const { autoProcessPendingQueue } = useSelector(state => state.settings)
    const isRememberMe = useSelector(state => state.login.isRememberMe)
    const [connected,setConnected] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        if (isRememberMe === false) {
            dispatch(restoreToken(null))
            logOut()
        }
    }, [isRememberMe])

    const handleAppStateChange = async (nextAppState: any) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
            if (store.getState().login.isSignout === true) {
                await EncryptedStorage.setItem('user_session', '')
            }
        }
    }

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state)=>setConnected(!!state.isConnected))
        AppState.addEventListener('change', handleAppStateChange)
        return () => {
            AppState.removeEventListener('change', handleAppStateChange)
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        if(connected && autoProcessPendingQueue)
        uploadPhotosInPending()
        
    }, [autoProcessPendingQueue,connected])

    return (
        <>
            <MyStatusBar backgroundColor="transparent" />
            <Navigator />
            <Loader />
            <FlashMessage position="top" />
        </>
    )
}

export default Sentry.wrap(App)
