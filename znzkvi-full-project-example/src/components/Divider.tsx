import Colors from '@constants/Colors'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import React from 'react'
import { View } from 'react-native'

export interface DividerProps {
    size?: number
    horizontal?: boolean
    line?: boolean
}

const DEFAULT_DISTANCE = 10
const Divider = ({
    size = DEFAULT_DISTANCE,
    horizontal = false,
    line = false
}: DividerProps) => (
    <View
        style={[
            horizontal
                ? { width: scaleByWidth(size) }
                : { height: scaleByHeight(size) },
            line && { backgroundColor: Colors.lesserBlack }
        ]}
    />
)

export default Divider
