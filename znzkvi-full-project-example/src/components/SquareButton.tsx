import { View, Pressable, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import Colors from '@constants/Colors'
import { scaleByHeight } from '@constants/Scaling'
import { dugme } from '@helpers/loadSounds'
import useSettings from '@hooks/useSettings'
interface Props {
    icon: ReactNode
    backgroundColor?: string
    onPress?: () => void
    hasOwnSound?: boolean
}
const SquareButton = ({
    icon,
    backgroundColor,
    onPress,
    hasOwnSound
}: Props) => {
    const { sounds } = useSettings()

    return (
        <Pressable
            style={localStyles.container}
            onPress={() => {
                onPress?.()
                if (!hasOwnSound && sounds) {
                    dugme.stop(() => {
                        //this makes the sound play again even if the button is pressed too fast
                        dugme.play()
                    })
                }
            }}>
            <View
                style={[
                    localStyles.button,
                    !!backgroundColor && { backgroundColor }
                ]}>
                {icon}
            </View>
        </Pressable>
    )
}

const localStyles = StyleSheet.create({
    button: {
        height: scaleByHeight(50),
        width: scaleByHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.orange,
        borderRadius: scaleByHeight(10)
    },
    container: {
        backgroundColor: Colors.lesserBlack,
        borderRadius: scaleByHeight(10),
        height: scaleByHeight(61),
        width: scaleByHeight(61),
        paddingLeft: scaleByHeight(4),
        paddingTop: scaleByHeight(4),
        borderTopRightRadius: scaleByHeight(18),
        borderBottomLeftRadius: scaleByHeight(18),
        borderTopLeftRadius: scaleByHeight(15)
    }
})
export default SquareButton
