import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Colors from '@constants/Colors'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

interface Props {
    isEnabled?: boolean
    setIsEnabled: (isEnabled?: boolean) => void
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const ReanimatedSwitch = ({ isEnabled = true, setIsEnabled }: Props) => {
    const animatedStyle = useAnimatedStyle(() => ({
        borderWidth: isEnabled ? withTiming(1) : withTiming(3),
        transform: [
            {
                scale: isEnabled ? withTiming(1.5) : withTiming(1)
            },
            {
                translateX: isEnabled ? withTiming(14) : withTiming(0)
            }
        ]
    }))
    const animatedPressableStyle = useAnimatedStyle(() => ({
        backgroundColor: isEnabled
            ? withTiming(Colors.lesserBlack)
            : withTiming(Colors.blue)
    }))
    return (
        <AnimatedPressable
            style={[localStyles.container, animatedPressableStyle]}
            onPress={() => {
                setIsEnabled(!isEnabled)
            }}>
            <Animated.View style={[localStyles.circle, animatedStyle]} />
        </AnimatedPressable>
    )
}

const localStyles = StyleSheet.create({
    container: {
        padding: 5,
        borderRadius: 30,
        width: 50,
        height: 30,
        borderColor: Colors.lesserBlack,
        borderWidth: 3,
        justifyContent: 'center'
    },
    circle: {
        borderRadius: 12,
        borderColor: Colors.lesserBlack,
        backgroundColor: Colors.blue,
        borderWidth: 3,
        height: 14,
        width: 14
    }
})
export default ReanimatedSwitch
