import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@constants/Colors'
import InterText from './InterText'

interface Props {
    title: string
    onPress: () => void
    color?: (typeof Colors)[keyof typeof Colors]
    fs?: number
}
const UnderlinedButton = ({
    title,
    onPress,
    color = Colors.black,
    fs = 14
}: Props) => {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <InterText style={[localStyles.text, { color }]} fs={fs}>
                {title}
            </InterText>
        </Pressable>
    )
}

const localStyles = StyleSheet.create({
    text: {
        textDecorationLine: 'underline'
    }
})

export default UnderlinedButton
