import React, { useState } from 'react'
import { LayoutChangeEvent, View, Image } from 'react-native'
import ImageProgress from 'react-native-image-progress'

interface Props {
    ratio?: number
    source: {
        uri: string
    }
    onSizeChange?: (width: number, height: number) => void
}

const FullWidthImage = ({ ratio, source, onSizeChange }: Props) => {
    const [width, setWidth] = useState(0)

    const onLayout = (event: LayoutChangeEvent) => {
        const containerWidth = event.nativeEvent.layout.width
        let he = 0
        if (ratio) {
            he = containerWidth * ratio
        } else {
            Image.getSize(source.uri, (w, h) => {
                he = (containerWidth * h) / w
            })
        }

        setWidth(containerWidth)
        onSizeChange?.(containerWidth, he)
    }
    return (
        <View onLayout={onLayout}>
            <ImageProgress
                source={source}
                style={{
                    width,
                    height: 270
                }}
            />
        </View>
    )
}

export default FullWidthImage
