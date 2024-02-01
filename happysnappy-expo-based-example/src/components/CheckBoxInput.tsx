import { Text, StyleSheet, Pressable, Platform } from 'react-native'
import React from 'react'
import CheckBox from '@react-native-community/checkbox'

interface CheckBoxInputProps {
    value: boolean
    onValueChange: () => void
    boxType: string
    onCheckColor: string
    onFillColor: string
    tintColor: string
    hideBox: boolean
    text: string
}

const CheckBoxInput = ({
    value,
    onValueChange,
    boxType,
    onCheckColor,
    onFillColor,
    tintColor,
    hideBox,
    text
}: CheckBoxInputProps) => {
    return (
        <Pressable style={styles.checkBoxDiv} onPress={onValueChange} hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
            <CheckBox
                value={value}
                boxType={boxType}
                onCheckColor={onCheckColor}
                onFillColor={onFillColor}
                tintColor={tintColor}
                hideBox={hideBox}
                style={styles.checkBoxInput}
                onValueChange={
                    Platform.OS === 'android' ? onValueChange : undefined
                }
                tintColors={{ true: onFillColor }}
            />
            <Text style={styles.checkBoxText}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    checkBoxDiv: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '50%'
    },
    checkBoxInput: {
        height: 20,
        width: 20,
        borderWidth: 1
    },
    checkBoxText: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    }
})

export default CheckBoxInput
