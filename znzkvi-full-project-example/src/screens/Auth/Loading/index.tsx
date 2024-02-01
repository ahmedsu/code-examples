import { View, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SvgIcons from '@assets/svgs/icons'
import Svgs from '@assets/svgs'
import Divider from '@components/Divider'
import Text from '@components/Text'
import Colors from '@constants/Colors'
import InterText from '@components/InterText'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import SplashScreen from 'react-native-splash-screen'
import useAuthStore from '@zustand/auth/store'
import * as Keychain from 'react-native-keychain'
import useLogin from '@hooks/api/useLogin'

const LoadingText = 'Loading...'.split('')
const Loading = () => {
    const { width } = useWindowDimensions()
    const [lettersLoaded, setLettersLoaded] = useState(0)
    const { setTokenValues } = useAuthStore()
    const { login } = useLogin()
    const lettersLoadedRef = useRef(lettersLoaded)
    lettersLoadedRef.current = lettersLoaded
    const logoSizeWithAspectRatio = useMemo(() => {
        return { width: (width - 40) * 0.9, height: (width - 40) * 0.9 }
    }, [width])

    const continueSession = useCallback(async () => {
        const keychainData = await Keychain.getGenericPassword()
        let res = null
        if (keychainData) {
            const { username, password } = keychainData
            res = await login({ username, password })
        } else {
            setTokenValues({ token: '', hasToken: false })
        }
        SplashScreen.hide()
        await new Promise(resolve => {
            const interval = setInterval(() => {
                if (lettersLoadedRef.current === LoadingText.length - 1) {
                    clearInterval(interval)
                    resolve(interval)
                } else setLettersLoaded(prev => prev + 1)
            }, 300)
        })

        if (res?.code === '0000') {
            setTokenValues({ token: res?.data?.api_token, hasToken: true })
        } else {
            setTokenValues({ token: '', hasToken: false })
        }
    }, [login, setTokenValues])

    useEffect(() => {
        continueSession()
    }, [continueSession])

    return (
        <View style={localStyles.container}>
            <SvgIcons.Logo
                width={logoSizeWithAspectRatio.width}
                height={logoSizeWithAspectRatio.height}
            />
            <View style={localStyles.verticalLine} />
            <View style={localStyles.svgContainer}>
                <Svgs.LoadingContainer
                    height={'100%'}
                    width={'100%'}
                    preserveAspectRatio="none"
                    style={{ ...StyleSheet.absoluteFillObject }}
                />
                <Text>
                    {LoadingText.map((letter, index) => (
                        <Text
                            key={index}
                            fs={64}
                            style={localStyles.marginBottom}
                            color={
                                lettersLoaded >= index
                                    ? Colors.white
                                    : Colors.black
                            }>
                            {letter}
                        </Text>
                    ))}
                </Text>
            </View>
            <Divider size={100} />
            <View style={localStyles.borderedTransparentContainer}>
                <View
                    style={[
                        localStyles.infoContainer,
                        localStyles.firstInfoContainer
                    ]}>
                    <InterText
                        color={Colors.white}
                        fs={16}
                        style={localStyles.textAlign}>
                        TV kviz ZNZKVI by Helem Nejse, Fondacija EKIPA i
                        Federalna TV.
                    </InterText>
                </View>
                <View
                    style={[
                        localStyles.infoContainer,
                        localStyles.secondInfoContainer
                    ]}>
                    <InterText
                        color={Colors.white}
                        fs={16}
                        style={localStyles.textAlign}>
                        Svakog četvrtka u 18:00 sati u programu Federalne
                        Televizije.
                    </InterText>
                </View>
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    marginBottom: {
        marginBottom: scaleByHeight(5)
    },
    svgContainer: {
        height: scaleByHeight(92),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    verticalLine: {
        height: scaleByHeight(51),
        width: 4,
        backgroundColor: Colors.lesserBlack
    },
    borderedTransparentContainer: {
        borderWidth: 4,
        borderColor: Colors.lesserBlack,
        borderRadius: scaleByHeight(15),
        width: '100%',
        height: scaleByHeight(100),
        alignItems: 'center'
    },
    infoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blue,
        width: '93%',
        height: scaleByHeight(70),
        borderColor: Colors.lesserBlack,
        borderWidth: 4,
        borderRadius: 8,
        paddingHorizontal: scaleByWidth(10)
    },
    textAlign: {
        textAlign: 'center'
    },
    firstInfoContainer: {
        top: scaleByHeight(-35),
        position: 'absolute'
    },
    secondInfoContainer: {
        bottom: scaleByHeight(-35),
        position: 'absolute'
    },
    centerRow: {
        alignItems: 'center'
    }
})
export default Loading
