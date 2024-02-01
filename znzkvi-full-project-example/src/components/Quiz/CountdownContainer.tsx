import { View, StyleSheet } from 'react-native'
import React, { forwardRef, memo } from 'react'
import Colors from '@constants/Colors'
import Row from '../Row'
import Countdown from '../Countdown'
import Divider from '../Divider'
import Text from '@components/Text'

interface Props {
    backgroundColor?: (typeof Colors)[keyof typeof Colors]
    isLastQuestion?: boolean
    seconds: number
    unlockAnswers: () => void
}
const CountdownContainer = forwardRef(
    (
        {
            backgroundColor = Colors.blue,
            isLastQuestion,
            seconds,
            unlockAnswers
        }: Props,
        ref
    ) => {
        return (
            <View style={localStyles.backContainer}>
                <Row style={[localStyles.frontContainer, { backgroundColor }]}>
                    <Divider horizontal />
                    <Text fs={20}>Vrijeme:</Text>
                    <Divider horizontal />
                    <View style={localStyles.flexOne}>
                        <Countdown
                            unlockAnswers={unlockAnswers}
                            seconds={seconds}
                            ref={ref}
                            backgroundColor={backgroundColor}
                            isLastQuestion={isLastQuestion}
                        />
                    </View>
                    <Divider horizontal />
                </Row>
            </View>
        )
    }
)

const localStyles = StyleSheet.create({
    backContainer: {
        height: 35,
        width: '100%',
        borderRadius: 8,
        backgroundColor: Colors.lesserBlack,
        borderWidth: 3,
        borderColor: Colors.lesserBlack
    },
    frontContainer: {
        height: 34,
        width: '100%',
        borderRadius: 8,
        backgroundColor: Colors.blue,
        marginTop: -6,
        marginLeft: -5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.lesserBlack
    },
    flexOne: {
        flex: 1
    }
})

export default memo(CountdownContainer)
