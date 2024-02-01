import { Text as RNText, Platform, StyleSheet, TextProps } from 'react-native'
import React from 'react'
import Colors from '@constants/Colors'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'

interface Props {
    fs?: number
    children?: TextProps['children']
    color?: (typeof Colors)[keyof typeof Colors]
    style?: TextProps['style']
    shouldScaleByWidth?: boolean
    letterSpacing?: number
    //  otherProps?: TextProps
}
const Text = ({
    fs = 24,
    children = '',
    color = Colors.lesserBlack,
    style,
    shouldScaleByWidth,
    letterSpacing = 4,
    ...otherProps
}: Props) => (
    <RNText
        style={[
            localStyles.text,
            {
                fontSize: shouldScaleByWidth
                    ? scaleByWidth(fs)
                    : scaleByHeight(fs),
                color,
                marginBottom: scaleByHeight(-(fs / 20)), //was fs/5
                letterSpacing
            }, // edit if it still isn't centered (this font for some reason has empty bottom space)
            style
        ]}
        {...otherProps}>
        {children}
    </RNText>
)

const localStyles = StyleSheet.create({
    text: {
        fontFamily: Platform.OS === 'ios' ? 'QuirelTypeface' : 'Quirel',
        fontSize: 40
    }
})
export default Text
