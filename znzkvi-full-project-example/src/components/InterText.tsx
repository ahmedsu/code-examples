import { Text as RNText, TextProps } from 'react-native'
import React, { useMemo } from 'react'
import Colors from '@constants/Colors'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'

interface Props {
    fs?: number
    children?: TextProps['children']
    weight?: 'regular' | 'bold' | 'extra-bold'
    style?: TextProps['style']
    color?: (typeof Colors)[keyof typeof Colors]
    shouldScaleByWidth?: boolean
    noScaling?: boolean
}
const getWeight = (weight: 'regular' | 'bold' | 'extra-bold') => {
    switch (weight) {
        case 'regular':
            return 'Inter'
        case 'bold':
            return 'Inter-Bold'
        case 'extra-bold':
            return 'Inter-ExtraBold'
    }
}
const InterText = ({
    fs = 14,
    children = '',
    weight = 'bold',
    style,
    color = Colors.black,
    shouldScaleByWidth,
    noScaling = false
}: Props) => {
    const fontFamily = useMemo(() => {
        return getWeight(weight)
    }, [weight])
    return (
        <RNText
            style={[
                {
                    fontSize: noScaling
                        ? fs
                        : shouldScaleByWidth
                        ? scaleByWidth(fs)
                        : scaleByHeight(fs),
                    fontFamily,
                    color
                },
                style
            ]}>
            {children}
        </RNText>
    )
}

export default InterText
