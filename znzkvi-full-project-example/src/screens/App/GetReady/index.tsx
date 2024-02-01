import { View, StyleSheet } from 'react-native'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import Svgs from '@assets/svgs'
import SvgIcons from '@assets/svgs/icons'
import Animated, { SlideInDown, SlideOutUp } from 'react-native-reanimated'
import Colors from '@constants/Colors'
import InterText from '@components/InterText'
import ZnzkviBa from '@components/ZnzkviBa'
import { AppStackNavigationProp, AppStackParams } from '@navigation/AppStack'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import Routes from '@navigation/Routes'
import { odbrojavanje } from '@helpers/loadSounds'
import useSettings from '@hooks/useSettings'

const enteringConfig = SlideInDown.springify()
    .stiffness(200)
    .damping(10)
    .restDisplacementThreshold(0.8)
    .restSpeedThreshold(10)
const GetReady = () => {
    const [readyTimeout, setReadyTimeout] = useState(3)
    const navigation = useNavigation<AppStackNavigationProp>()
    const { sounds } = useSettings()
    const soundsRef = useRef(sounds)
    soundsRef.current = sounds
    const route = useRoute<RouteProp<AppStackParams, 'GetReady'>>()

    if (readyTimeout === 3 && sounds) {
        odbrojavanje.play()
    }
    useEffect(() => {
        if (readyTimeout === 0) {
            navigation.navigate(Routes.AppStack.Quiz, {
                quizData: route.params.quizData
            })
            return
        }
        const interval = setTimeout(() => {
            const curr = readyTimeout - 1
            setReadyTimeout(readyTimeout - 1)
            if (curr !== 0 && soundsRef.current) {
                odbrojavanje.stop(() => {
                    odbrojavanje.play()
                })
            }
        }, 1200)
        return () => clearTimeout(interval)
    }, [readyTimeout, navigation, route])
    const svgToShow = useMemo(() => {
        let component: ReactNode | null = null
        switch (readyTimeout) {
            case 3:
                component = (
                    <Animated.View
                        key={3}
                        entering={enteringConfig}
                        exiting={SlideOutUp}>
                        <SvgIcons.NumberThree />
                    </Animated.View>
                )
                break
            case 2:
                component = (
                    <Animated.View
                        key={2}
                        entering={enteringConfig}
                        exiting={SlideOutUp}>
                        <SvgIcons.NumberTwo />
                    </Animated.View>
                )
                break
            case 1:
                component = (
                    <Animated.View
                        key={1}
                        entering={enteringConfig}
                        exiting={SlideOutUp}>
                        <SvgIcons.NumberOne />
                    </Animated.View>
                )
                break
            default:
                component = (
                    <Animated.View
                        key={0}
                        entering={enteringConfig}
                        exiting={SlideOutUp}>
                        <SvgIcons.NumberZero />
                    </Animated.View>
                )
        }
        return component
    }, [readyTimeout])
    return (
        <View style={localStyles.container}>
            <Svgs.ZnzkviText />
            <View style={localStyles.svgContainer}>
                <Svgs.GetReadyCountdown
                    style={{ ...StyleSheet.absoluteFillObject }}
                />
                {svgToShow}
            </View>
            <View style={localStyles.infoContainer}>
                <InterText
                    color={Colors.white}
                    fs={24}
                    style={localStyles.textAlign}>
                    Spremi se, tvoj kviz uskoro počinje!
                </InterText>
            </View>

            <ZnzkviBa />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30
    },
    svgContainer: {
        height: 203,
        width: 235,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    zeroZIndex: {
        zIndex: 0
    },
    infoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blue,
        width: '100%',
        height: 70,
        borderColor: Colors.lesserBlack,
        borderWidth: 4,
        borderRadius: 8,
        paddingHorizontal: 10
    },
    textAlign: {
        textAlign: 'center'
    }
})
export default GetReady
