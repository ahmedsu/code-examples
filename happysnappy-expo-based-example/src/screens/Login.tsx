import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    ImageBackground,
    Platform,
    DeviceEventEmitter,
    Dimensions
} from 'react-native'

import React, { useState, useEffect, useMemo } from 'react'
import ColorTheme from '../colors'
import Orientation from 'react-native-orientation-locker'
import { authenticateUser } from 'helpers/restApi'
import { AuthTextInput, CheckBoxInput, Button, Divider } from 'components'
import { useDispatch, useSelector } from 'hooks/reduxHooks'
import { setIsLoading } from 'redux/actions/loadingActions'
import { setRememberMe } from 'redux/actions/loginActions'
import EncryptedStorage from 'react-native-encrypted-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react-native'
import {
    clearUploads,
    setNewFilteredFailedUploads,
    setNewFilteredPendingUploads,
    setNewFilteredSuccessfulUploads,
    setNewTotalFailedUploads,
    setNewTotalFailedUploadsWithoutUUID,
    setNewTotalPendingUploads,
    setNewTotalPendingUploadsWithoutUUID,
    setNewTotalSuccessfulUploads,
    setNewTotalSuccessfulUploadsWithoutUUID,
} from 'redux/actions/uploadActions'
import { showMessage } from 'react-native-flash-message'
import { setAutoProcessPendingQueue } from 'redux/actions/settingsActions'

const height = Dimensions.get('window').height

const Login = () => {
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isBusyLoading, setIsBusyLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const isRememberMe = useSelector(state => state.login.isRememberMe)
    const dispatch = useDispatch()

    const retrieveUserSession = async () => {
        try {
            const session = await EncryptedStorage.getItem('user_session')

            if (session !== undefined) {
                // Congrats! You've just retrieved your first value!
                const parsedSession = JSON.parse(session)

                setUsername(parsedSession?.username)
                setPassword(parsedSession?.password)
            }
        } catch (error) {
            // There was an error on the native side

            dispatch(setRememberMe(false))
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const restoreImagesToRedux = async (username: any) => {
        try {
            dispatch(clearUploads())
            const value = await AsyncStorage.getItem(`@${username}`)
            if (value === null) {
                return
            }
            const jsonData = JSON.parse(value)

            if (value !== null) {
                dispatch(
                    setNewFilteredSuccessfulUploads(
                        jsonData?.filteredSuccessful
                    )
                )
                dispatch(setNewFilteredFailedUploads(jsonData?.filteredFailed))
                dispatch(
                    setNewFilteredPendingUploads(jsonData?.filteredPending)
                )

                dispatch(
                    setNewTotalSuccessfulUploads(jsonData?.totalSuccessful)
                )
                dispatch(setNewTotalFailedUploads(jsonData?.totalFailed))
                dispatch(setNewTotalPendingUploads(jsonData?.totalPending))
                dispatch(
                    setNewTotalSuccessfulUploadsWithoutUUID(
                        jsonData?.totalSuccessfulWithoutUUID
                    )
                )
                dispatch(
                    setNewTotalFailedUploadsWithoutUUID(
                        jsonData?.totalFailedWithoutUUID
                    )
                )
                dispatch(
                    setNewTotalPendingUploadsWithoutUUID(
                        jsonData?.totalPendingWithoutUUID
                    )
                )
                dispatch(setAutoProcessPendingQueue(jsonData?.autoPending))
            }
        } catch (e) {
            // error reading value
        }
    }

    useEffect(() => {
        Orientation.lockToPortrait()

        if (isRememberMe) {
            retrieveUserSession()
        }
    }, [])

    const storeUserSession = async () => {
        try {
            await EncryptedStorage.setItem(
                'user_session',
                JSON.stringify({
                    password: password,
                    username: username
                })
            )

            // Congrats! You've just stored your first value!
        } catch (error) {
            // There was an error on the native side
        }
    }

    const onLoginPress = (usr?: string, pw?: string) => {
        // this.setState({ isBusyLoading: true }); TODO: Add a loader
        const user = usr ?? username
        const pass = pw ?? password

        dispatch(setIsLoading(true))
        authenticateUser({ username: user, password: pass })
            .then(async authenticated => {
                if (authenticated) {
                    if (isRememberMe) {
                        await storeUserSession()
                    }
                    await restoreImagesToRedux(username)
                    DeviceEventEmitter.emit('login')
                    Sentry.setUser({ email: user })
                }
            })
            .catch(error => {
                //   this.setState({ isBusyLoading: false })

                setTimeout(() => {
                    showMessage({
                        message: 'Wrong credentials entered, please try again.',
                        type: 'danger'
                    })
                }, 1500)
            })
            .finally(() => {
                dispatch(setIsLoading(false))
            })
    }

    let loginButton = <Button text={'Log In'} onPress={() => onLoginPress()} />

    if (isBusyLoading) {
        loginButton = (
            <View style={styles.loginButton}>
                <ActivityIndicator />
            </View>
        )
    }
    const isIOS = useMemo(() => Platform.OS === 'ios', [])
    return (
        <ImageBackground
            style={styles.loginScreenDiv}
            source={require('../assets/background/background_image.png')}>
            {/* <Image
                source={require('../assets/background/background_image.png')}
                style={styles.backgroundImage}
            /> */}

            <View style={styles.logoDiv}>
                <Image
                    source={require('../assets/logo/white_logo.png')}
                    style={styles.logoImage}
                />
            </View>

            <KeyboardAvoidingView
                style={styles.bottomSheetModalDiv}
                enabled={isIOS}
                behavior={'padding'}>
                <Text style={styles.bottomSheetTitle}>Log In</Text>
                <Text style={styles.bottomSheetText}>
                    Fill in your details below to log in.
                </Text>
                <View style={styles.bottomSheetInputDiv}>
                    <AuthTextInput
                        value={username}
                        placeholder={'Email address'}
                        onChangeText={(text: string) =>
                            setUsername(text.replace(/\s+/g, ''))
                        }
                        image={undefined}
                        secureTextEntry={false}
                    />
                    <AuthTextInput
                        value={password}
                        placeholder={'Password'}
                        onChangeText={(text: string) => setPassword(text)}
                        image={require('../assets/icons/pass-eye.png')}
                        onRightIconPress={() => {
                            setShowPassword(prev => !prev)
                        }}
                        secureTextEntry={showPassword ? false : true}
                    />
                </View>

                <View style={styles.bottomSheetConditionDiv}>
                    <CheckBoxInput
                        value={isRememberMe}
                        onValueChange={() => {
                            dispatch(setRememberMe(!isRememberMe))
                        }}
                        boxType={'square'}
                        onCheckColor={'#fff'}
                        onFillColor={'#45AEFF'}
                        tintColor={'#111'}
                        hideBox={false}
                        text={'Remember me'}
                    />
                    {/*<Pressable
                        onPress={() => {
                            crashlytics().crash()
                        }}>
                        <Text style={styles.forgotPassTxt}>
                            Forgot password?
                        </Text>
                    </Pressable>*/}
                </View>
                <View style={styles.bottomSheetBtnDiv}>{loginButton}</View>
                <Divider size={isIOS ? 40 : 20} />
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    loginScreenDiv: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    backgroundImage: {
        width: '100%',
        height: '100%'
    },
    backgroundImageDiv: {
        width: '100%',
        height: '100%'
    },
    logoDiv: {
        width: 250,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: height < 600 ? 10 : '15%'
    },
    logoImage: {
        width: 240,
        height: 100
    },
    bottomSheetModalDiv: {
        width: '100%',
        backgroundColor: '#fff',
        //   bottom: 0,
        // position: 'absolute',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20
    },
    bottomSheetTitle: {
        color: '#111',
        fontSize: 25,
        fontWeight: '700',
        marginLeft: 20,
        marginTop: 20,
        fontFamily: 'Poppins-Regular'
    },
    bottomSheetText: {
        color: '#111',
        fontSize: 15,
        fontWeight: '400',
        marginLeft: 20,
        marginTop: 5,
        fontFamily: 'Poppins-Regular'
    },
    bottomSheetInputDiv: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 10
    },
    bottomSheetConditionDiv: {
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
        flexDirection: 'row'
    },
    bottomSheetBtnDiv: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    forgotPassTxt: {
        textDecorationLine: 'underline',
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },
    loginButton: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorTheme.PRIMARY_COLOR_1,
        paddingTop: 6,
        paddingRight: 4,
        paddingBottom: 6,
        paddingLeft: 4,
        borderRadius: 6
    }
})

export default Login
