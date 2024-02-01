import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import React, { ReactNode, useMemo } from 'react'
import Colors from '@constants/Colors'
import Text from '@components/Text'
import { scaleByHeight } from '@constants/Scaling'
import { dugme } from '@helpers/loadSounds'
import useSettings from '@hooks/useSettings'

interface Props {
    icon?: ReactNode
    title: string
    size?: 'small' | 'large' | 'smaller'
    onPress?: () => void
    hasOwnSound?: boolean
    backgroundColor?: (typeof Colors)[keyof typeof Colors]
}
const RectangularButton = ({
    title,
    icon,
    size = 'large',
    onPress,
    hasOwnSound,
    backgroundColor = Colors.orange
}: Props) => {
    const { fontScale } = useWindowDimensions()
    const { sounds } = useSettings()
    const styles = useMemo(() => {
        return makeStyles(fontScale)
    }, [fontScale])
    return (
        <View
            style={[
                styles.viewContainer,
                size === 'small'
                    ? styles.height50
                    : size === 'smaller'
                    ? styles.height46
                    : styles.height72
            ]}>
            <Pressable
                style={({ pressed }) => [
                    styles.container,
                    pressed
                        ? { backgroundColor: `${backgroundColor}90` }
                        : { backgroundColor }
                ]}
                onPress={() => {
                    onPress?.()
                    if (!hasOwnSound && sounds) {
                        dugme.stop(() => {
                            dugme.play()
                        })
                    }
                }}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <Text fs={32}>{title}</Text>
            </Pressable>
        </View>
    )
}

const makeStyles = (fontScale: number) =>
    StyleSheet.create({
        iconContainer: {
            position: 'absolute',
            left: 20,
            height: '100%',
            justifyContent: 'center'
        },
        container: {
            backgroundColor: Colors.orange,
            width: '100%',
            height: '100%',
            borderRadius: scaleByHeight(10),
            borderColor: Colors.black,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center'
        },
        pressedColor: {
            backgroundColor: `${Colors.orange}90`
        },
        unpressedColor: {
            backgroundColor: Colors.orange
        },
        text: {
            color: Colors.black,
            fontSize: 20 / fontScale,
            fontWeight: 'bold'
        },
        viewContainer: {
            width: '100%',
            height: scaleByHeight(72),
            borderRadius: scaleByHeight(10),
            backgroundColor: Colors.dirtyWhite
        },
        height50: {
            height: scaleByHeight(55)
        },
        height72: {
            height: scaleByHeight(72)
        },
        height46: {
            height: scaleByHeight(50)
        }
    })
export default RectangularButton
