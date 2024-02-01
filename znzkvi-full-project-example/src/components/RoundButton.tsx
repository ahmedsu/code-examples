import { View, StyleSheet, Pressable, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import Colors from '@constants/Colors'
import { scaleByHeight } from '@constants/Scaling'
import { dugme } from '@helpers/loadSounds'
import useSettings from '@hooks/useSettings'

interface Props {
    icon: ReactNode
    style?: ViewStyle | null
    innerStyle?: ViewStyle | null
    onPress?: () => void
    hasOwnSound?: boolean
}
const RoundButton = ({
    icon,
    style = null,
    innerStyle = null,
    onPress,
    hasOwnSound
}: Props) => {
    const { sounds } = useSettings()

    return (
        <View style={[localStyles.container, style]}>
            <Pressable
                style={[localStyles.button, innerStyle]}
                onPress={() => {
                    onPress?.()
                    if (!hasOwnSound && sounds) {
                        dugme.stop(() => {
                            dugme.play()
                        })
                    }
                }}>
                {icon}
            </Pressable>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        height: scaleByHeight(60),
        width: scaleByHeight(60),
        borderRadius: 60,
        backgroundColor: Colors.lesserBlack,
        borderWidth: 1,
        borderColor: Colors.lesserBlack
    },
    button: {
        height: scaleByHeight(60),
        width: scaleByHeight(60),
        borderRadius: 60,
        backgroundColor: Colors.orange,
        marginTop: scaleByHeight(-5),
        marginLeft: scaleByHeight(-5),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.lesserBlack
    }
})

export default RoundButton
