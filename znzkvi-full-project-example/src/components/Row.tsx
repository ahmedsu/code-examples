import { View, StyleSheet, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'

interface Props {
    style?: ViewStyle | ViewStyle[]
    children: ReactNode | ReactNode[]
}
const Row = ({ style, children }: Props) => {
    return (
        <View
            style={[
                localStyles.row,
                Array.isArray(style) ? [...style] : style
            ]}>
            {children}
        </View>
    )
}

const localStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        width: '100%'
    }
})
export default Row
