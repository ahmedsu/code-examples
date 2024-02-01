import React, { FC } from 'react'
import { Text, PixelRatio, Dimensions } from 'react-native'

const { height } = Dimensions.get('screen')
const { height: windowHeight } = Dimensions.get('window')
const dpPerPx = PixelRatio.getPixelSizeForLayoutSize(height) / windowHeight

const normalize = () => {
  if (dpPerPx > 2.7) return 0
  else if (dpPerPx > 2) return 2
  else if (dpPerPx > 1.4) return 4
  return 6
}
const diff = normalize()

const fontSizes = {
  header48: 48,
  header25: 25,
  h1: 24,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,
  body13: 13,
  body12: 12,
  body11: 11,
  body10: 10
}
const typographies = {
  default: 'Montserrat-400',
  bold: 'Montserrat-700',
  semiBold: 'Montserrat-600',
  medium: 'Montserrat-500',
  regular: 'Montserrat-400'
}

const colors = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#182e75'
}

interface CustomTextProps {
  children: React.ReactNode
  fontSize?: keyof typeof fontSizes
  color?: keyof typeof colors
  typography?: keyof typeof typographies
  style?: object
  center?: boolean
  otherProps?: object
  underlined?: boolean
  onPress?: () => void
}

export const CustomText: FC<CustomTextProps> = ({
  children,
  fontSize = 'h6',
  color = 'black',
  typography = 'default',
  style = null,
  center = false,
  otherProps = null,
  underlined = false,
  onPress
}) => {
  return (
    <Text
      {...otherProps}
      onPress={onPress}
      style={[
        {
          fontSize: fontSizes[fontSize] - diff,
          color: colors[color],
          fontFamily: typographies[typography],
          textAlign: center ? 'center' : 'left',
          textDecorationLine: underlined ? 'underline' : 'none'
        },
        style != null && Array.isArray(style) ? [...style] : { ...style }
      ]}>
      {children}
    </Text>
  )
}
