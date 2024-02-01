import AsyncStorage from '@react-native-async-storage/async-storage'
import { authenticateUser, getPhotosOnCloud } from 'helpers/restApi'
import { checkForLostImages } from 'helpers/uploadService'
import { logOut } from 'helpers/userService'
import { useDispatch, useSelector } from 'hooks/reduxHooks'
import React, { useCallback, useEffect, useState } from 'react'
import { DeviceEventEmitter, View } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { showMessage } from 'react-native-flash-message'
import Orientation from 'react-native-orientation-locker'
import SplashScreen from 'react-native-splash-screen'

import AuthStack from './AuthStack'
import TabNavigator from './TabNavigator'

const Navigator = () => {
    const userToken = useSelector(state => state.login.userToken)
    const [navigationToken, setNavigationToken] = useState<boolean | null>(
        false
    )

    const fetchToken = async () => {
        try {
            const session = await EncryptedStorage.getItem('user_session')

            if (session !== undefined && session) {
                const parsedSession = JSON.parse(session)
                const authenticated = await authenticateUser({
                    username: parsedSession?.username,
                    password: parsedSession?.password
                })
                if (authenticated) {
                    // restoreImagesToRedux(parsedSession?.username)
                    setNavigationToken(true)
                }
            }
        } catch (err) {
            showMessage({
                message: 'Please check your internet and try again.',
                type: 'danger'
            })
            await logOut(true)
            setNavigationToken(false)
        } finally {
            SplashScreen.hide()
        }
    }
    const onLogin = useCallback(() => {
        setNavigationToken(true)
    }, [])
    useEffect(() => {
        Orientation.lockToPortrait()
        DeviceEventEmitter.addListener('login', onLogin)
        fetchToken()
        return () => DeviceEventEmitter.removeAllListeners('login')
    }, [onLogin])
    useEffect(() => {
        if (navigationToken) checkForLostImages()
    }, [navigationToken])
    useEffect(() => {
        if (userToken === null) setNavigationToken(false)
    }, [userToken])
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {navigationToken ? <TabNavigator /> : <AuthStack />}
        </View>
    )
}

export default Navigator
