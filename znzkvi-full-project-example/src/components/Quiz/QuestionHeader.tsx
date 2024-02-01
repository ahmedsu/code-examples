import { View, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import Colors from '@constants/Colors'
import Row from '../Row'
import { scaleByHeight } from '@constants/Scaling'
import Text from '../Text'
import Divider from '@components/Divider'

interface Props {
    icon: ReactNode
    title: string
    numberOfQuestions: number
    currentQuestion: number
    backgroundColor?: string
}
const QuestionHeader = ({
    icon,
    title,
    numberOfQuestions,
    currentQuestion,
    backgroundColor = Colors.lightBlue
}: Props) => {
    return (
        <View style={[localStyles.container, { backgroundColor }]}>
            <Row style={localStyles.innerContainer}>
                {icon}
                <Divider horizontal size={10} />
                <Row
                    style={[localStyles.flexOne, localStyles.contentContainer]}>
                    <Text fs={24} style={localStyles.width77} letterSpacing={2}>
                        {title}
                    </Text>
                    <Text fs={38}>
                        {currentQuestion}/{numberOfQuestions}
                    </Text>
                </Row>
            </Row>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: scaleByHeight(90),
        backgroundColor: Colors.lightBlue,
        borderRadius: 8,
        padding: scaleByHeight(5),
        borderColor: Colors.black,
        borderWidth: 3
    },
    innerContainer: {
        height: '100%',
        width: '100%',
        padding: scaleByHeight(10),
        alignItems: 'center'
    },
    flexOne: {
        flex: 1,
        width: '100%'
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    width77: {
        width: '77%'
    }
})
export default QuestionHeader
