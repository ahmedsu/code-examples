import React from 'react'
import {
    Text,
    StyleSheet,
    TextProps,
    Dimensions,
    PixelRatio
} from 'react-native'

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

const CustomText = (props: any) => {
    return (
        <Text
            {...props}
            style={[
                styles.defaultStyle,
                props.style,
                props.fontSize ? { fontSize: props.fontSize - diff } : null
            ]}>
            {props.children}
        </Text>
    )
}

const styles = StyleSheet.create({
    // ... add your default style here
    defaultStyle: {
        fontFamily: 'Lato-Bold'
    }
})

export default CustomText
