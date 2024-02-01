import {
    Text,
    StyleSheet,
    Pressable,
    PressableProps,
    TextStyle,
    ViewStyle
} from 'react-native'
import React from 'react'

interface ButtonProps {
    onPress: () => void
    text?: string
    disabled?: boolean
    textStyle?: TextStyle | null
    viewStyle?: ViewStyle | null
}

const Button = (props: ButtonProps & PressableProps) => {
    return (
        <Pressable
            onPress={props.onPress}
            disabled={props.disabled}
            style={props.disabled ? [styles.disabledLoginBtn, props.viewStyle] : [styles.loginBtn, props.viewStyle]}>
            <Text style={[styles.loginBtnText, props.textStyle]}>
                {props?.text ? props.text : props.children}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    loginBtn: {
        width: '90%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45AEFF',
        height: 50
    },
    disabledLoginBtn: {
        width: '90%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b8daf5',
        height: 50,
        opacity: 50
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default Button
