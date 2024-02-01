import colors from 'colors'
import Fonts from 'constants/Fonts'
import React, { FC } from 'react'
import { Text, StyleSheet, TextProps } from 'react-native'

const Title: FC<TextProps> = props => (
    <Text {...props} style={[localStyles.title, props.style]}>
        {props.children}
    </Text>
)

const localStyles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        color: colors.BLACK
    }
})
export default Title
