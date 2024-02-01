import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Row from '../Row'
import Divider from '../Divider'
import Colors from '@constants/Colors'
import InterText from '../InterText'
import { scaleByHeight } from '@constants/Scaling'
import { netacanOdg, tacanOdg } from '@helpers/loadSounds'
import useSettings from '@hooks/useSettings'
import { CorrectAnswer } from '@customTypes/IQuiz'

interface Props {
    letter: CorrectAnswer
    title: string
    onPress?: (letter: CorrectAnswer) => void
    isCorrectAnswer?: boolean
    backgroundColor?: (typeof Colors)[keyof typeof Colors]
    isAnswerLocked?: () => boolean
}
const AnswerContainer = ({
    letter,
    title,
    onPress,
    isCorrectAnswer,
    backgroundColor = Colors.blue,
    isAnswerLocked
}: Props) => {
    const { sounds } = useSettings()

    return (
        <Pressable
            style={localStyles.fullWidth}
            onPress={() => {
                if (sounds && !isAnswerLocked?.()) {
                    if (isCorrectAnswer) {
                        tacanOdg.stop(() => {
                            tacanOdg.play()
                        })
                    } else {
                        netacanOdg.stop(() => {
                            netacanOdg.play()
                        })
                    }
                }
                onPress?.(letter)
            }}>
            <Row style={[localStyles.container, { backgroundColor }]}>
                <InterText fs={20} weight="bold">
                    {letter}
                </InterText>
                <Divider horizontal />
                <InterText color={Colors.white} fs={16}>
                    {title}
                </InterText>
            </Row>
        </Pressable>
    )
}

const localStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        minHeight: scaleByHeight(52),
        width: '100%',
        backgroundColor: Colors.blue,
        paddingHorizontal: 7,
        borderWidth: 3,
        borderRadius: 8,
        borderColor: Colors.black
    },
    fullWidth: {
        width: '100%'
    }
})

export default AnswerContainer
