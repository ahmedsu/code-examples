import { View, StyleSheet, TextInput, Platform } from 'react-native'
import React, { ReactNode } from 'react'
import Divider from './Divider'
import Text from './Text'
import { scaleByHeight } from '@constants/Scaling'
import Colors from '@constants/Colors'

interface Props {
    label: string
    value?: string
    onChangeText?: (text: string) => void
    withHorizontalPadding?: boolean
    editMode?: boolean
    embedInputComponent?: ReactNode
}
const ProfileInfoRow = ({
    label = '',
    value = '',
    onChangeText,
    withHorizontalPadding,
    editMode = false,
    embedInputComponent = null
}: Props) => {
    return (
        <View
            style={[
                localStyles.container,
                withHorizontalPadding && localStyles.paddingHorizontal
            ]}>
            <Text fs={20} letterSpacing={2}>
                {label}
            </Text>
            <Divider horizontal size={5} />
            {embedInputComponent ? (
                embedInputComponent
            ) : (
                <TextInput
                    keyboardType="visible-password"
                    editable={editMode}
                    value={value}
                    onChangeText={onChangeText}
                    style={localStyles.textInputStyle}
                />
            )}
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Platform.OS === 'ios' ? scaleByHeight(15) : 0,
        height: Platform.OS === 'ios' ? 'auto' : 50
    },
    textInputStyle: {
        flex: 1,
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: Colors.white,
        textDecorationLine: 'none'
    },
    paddingHorizontal: {
        paddingHorizontal: 20
    }
})
export default ProfileInfoRow
