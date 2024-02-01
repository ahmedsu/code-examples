import { View, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@constants/Colors'
import InterText from '@components/InterText'
import { scaleByWidth } from '@constants/Scaling'

interface Props {
    questionText: string
    backgroundColor?: (typeof Colors)[keyof typeof Colors]
}
const QuestionContainer = ({
    questionText,
    backgroundColor = Colors.blue
}: Props) => {
    return (
        <View style={[localStyles.container, { backgroundColor }]}>
            <InterText shouldScaleByWidth>{questionText}</InterText>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        minHeight: scaleByWidth(180),
        width: '100%',
        backgroundColor: Colors.blue,
        paddingVertical: 10,
        paddingHorizontal: 7,
        borderRadius: 8,
        borderWidth: 3
    }
})
export default QuestionContainer
