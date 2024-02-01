import { View, StyleSheet, Image, TextInput, Pressable } from 'react-native'
import React from 'react'

interface AuthTextInputProps {
    value: string
    placeholder: string
    onChangeText: () => void
    image: string | undefined
    secureTextEntry: boolean
    onRightIconPress?: () => void
}

const AuthTextInput = ({
    value,
    placeholder,
    onChangeText,
    image,
    secureTextEntry,
    onRightIconPress
}: AuthTextInputProps) => {
    return (
        <View style={styles.inputDiv}>
            <TextInput
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="gray"
            />
            <Pressable
                onPress={() => onRightIconPress?.()}
                style={styles.passIcon}>
                <Image source={image} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    inputDiv: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 20,
        paddingVertical: 10,
        flexDirection: 'row'
    },
    passIcon: {
        position: 'absolute',
        right: 40,
        top: 30
    },
    textInput: {
        width: '95%',
        height: 60,
        backgroundColor: '#F1F2F5',
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 15,
        color: '#1D1D1D',
        fontFamily: 'Poppins-Regular'
    }
})

export default AuthTextInput
