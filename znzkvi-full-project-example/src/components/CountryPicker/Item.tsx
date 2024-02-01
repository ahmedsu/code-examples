import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Row from '@components/Row'
import Divider from '@components/Divider'
import { SvgUri } from 'react-native-svg'
import Text from '@components/Text'
import { ICountry } from './CountryPickerModal'
import Colors from '@constants/Colors'
import InterText from '@components/InterText'

interface Props {
    onPress?: () => void
    item: ICountry | null
    withIcon?: boolean
    fs?: number
    color?: string
    isPickerInSettings?: boolean
}
const Item = ({
    onPress,
    item,
    withIcon = false,
    fs = 18,
    color = Colors.black,
    isPickerInSettings
}: Props) => {
    if (!item) return null
    const { flag, name_ba, name } = item
    return (
        <Pressable style={localStyles.pressable} onPress={onPress}>
            <Row style={localStyles.container}>
                {withIcon && <SvgUri height="100%" width={40} uri={flag} />}

                {withIcon && <Divider horizontal />}
                {isPickerInSettings ? (
                    <InterText
                        fs={20}
                        color={Colors.white}
                        weight="bold"
                        noScaling>
                        {name_ba || name}
                    </InterText>
                ) : (
                    <Text
                        style={[
                            localStyles.textInput,
                            { marginBottom: -(fs / 6) },
                            { fontSize: fs, color }
                        ]}>
                        {name_ba || name}
                    </Text>
                )}
            </Row>
        </Pressable>
    )
}

const localStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    pressable: {
        width: '100%',
        height: 30
    },
    textInput: {
        letterSpacing: 1.3
    }
})
export default Item
