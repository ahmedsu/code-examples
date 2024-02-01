import colors from 'colors'
import React from 'react'
import { View, StyleSheet } from 'react-native'

interface Props {
    maxSteps: number
    currentStep: number
}
const Dots = ({ maxSteps, currentStep }: Props) => {
    return (
        <View style={localStyles.container}>
            {new Array(maxSteps).fill(0).map((_, i) => (
                <View
                    style={[
                        localStyles.dot,
                        currentStep === i && localStyles.isActive
                    ]}
                />
            ))}
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
    },
    dot: {
        height: 6,
        width: 6,
        borderRadius: 3,
        backgroundColor: '#DEDEDE'
    },
    isActive: {
        backgroundColor: colors.BLACK
    }
})
export default Dots
