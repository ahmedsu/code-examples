import { View, StyleSheet } from 'react-native'
import React, {
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useRef
} from 'react'
import Animated, {
    Easing,
    cancelAnimation,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import Colors from '@constants/Colors'
import { netacanOdg } from '@helpers/loadSounds'
import useSettings from '@hooks/useSettings'
import { withPause } from 'react-native-redash'

interface Props {
    backgroundColor?: (typeof Colors)[keyof typeof Colors]
    isLastQuestion?: boolean
    seconds: number
    unlockAnswers: () => void
}
const Countdown = forwardRef(
    (
        {
            backgroundColor = Colors.blue,
            isLastQuestion = false,
            seconds,
            unlockAnswers
        }: Props,
        ref
    ) => {
        const currentTime = useSharedValue(100)
        const { sounds } = useSettings()
        const soundsRef = useRef(sounds)
        soundsRef.current = sounds
        const isLastQuestionRef = useRef(isLastQuestion)
        isLastQuestionRef.current = isLastQuestion
        const SECONDS = useRef(seconds)
        SECONDS.current = seconds
        const paused = useSharedValue(false)

        useImperativeHandle(ref, () => {
            return {
                cancelAnimation: () => {
                    cancelAnimation(currentTime)
                },
                pause: () => {
                    paused.value = true
                },
                unpause: () => {
                    paused.value = false
                },
                resetAnimation,
                // answerFn,
                runAnimation
            }
        })
        const resetAnimation = useCallback(() => {
            cancelAnimation(currentTime)
            currentTime.value = 100
        }, [currentTime])
        const unlockAnswersRef = useRef(unlockAnswers)
        unlockAnswersRef.current = unlockAnswers
        const playNetacanOdg = () => netacanOdg.play()
        const runAnimation = useCallback(
            (cb: () => void) => {
                currentTime.value = withPause(
                    withTiming(
                        0,
                        {
                            duration: SECONDS.current * 1000,
                            easing: Easing.linear
                        },
                        isEndedSuccessfully => {
                            if (!isEndedSuccessfully) return
                            if (soundsRef.current) runOnJS(playNetacanOdg)()
                            currentTime.value = 100
                            runOnJS(cb)()
                        }
                    ),
                    paused
                )
                setTimeout(() => {
                    unlockAnswersRef.current()
                }, 1000)
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        )
        //@ts-ignore
        const animatedStyle = useAnimatedStyle(() => {
            // eslint-disable-next-line no-console
            console.log(currentTime.value) //THIS LINE FIXED ANIMATION ISSUE ON FIRST QUESTION, FOR SOME SPECIFIC PHONES (redmi)
            //I Don't know how, I don't know why, yesterday you told me bout the blue blue sky
            return {
                //@ts-ignore
                width: currentTime.value + '%'
            }
        })
        return (
            <View style={[localStyles.container, { backgroundColor }]}>
                <Animated.View
                    style={[localStyles.animatedViewStyle, animatedStyle]}
                />
            </View>
        )
    }
)

const localStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: 20,
        borderColor: Colors.black,
        borderWidth: 3
    },
    animatedViewStyle: {
        height: '100%',
        backgroundColor: Colors.white
    }
})
export default memo(Countdown)
