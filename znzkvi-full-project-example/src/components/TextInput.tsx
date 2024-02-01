import { StyleSheet, TextInput as NativeTextInput, View } from 'react-native'
import React, { ReactNode } from 'react'
import Colors from '@constants/Colors'
import Divider from './Divider'
//MIGHT NEED TO SCALE THIS COMPONENT
interface Props {
    icon?: ReactNode
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    placeholderTextColor?: (typeof Colors)[keyof typeof Colors]
    fs?: number
    color?: (typeof Colors)[keyof typeof Colors]
    secureTextEntry?: boolean
}
const TextInput = ({
    value,
    onChangeText,
    icon,
    placeholder,
    placeholderTextColor,
    fs = 18,
    color = Colors.black,
    secureTextEntry = false
}: Props) => {
    //  const [togglePassword, setTogglePassword] = useState(false)
    return (
        <View style={localStyles.container}>
            {icon && icon}
            {icon && <Divider horizontal />}
            <NativeTextInput
                secureTextEntry={secureTextEntry /*&& !togglePassword*/}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={
                    placeholderTextColor || Colors.placeholderGray
                }
                style={[
                    localStyles.textInput,
                    //  { marginBottom: -(fs / 6) },
                    !!icon && localStyles.hasIconWidth,
                    { fontSize: fs, color }
                ]}
            />
            {/* {secureTextEntry && (
                <Pressable onPress={() => setTogglePassword(!togglePassword)}>
                    <Ionicon
                        name={togglePassword ? 'eye-off' : 'eye'}
                        color={Colors.lesserBlack}
                    />
                </Pressable>
            )} */}
        </View>
    )
}

const localStyles = StyleSheet.create({
    textInput: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        fontFamily: 'Inter-Bold', //Platform.OS === 'ios' ? 'QuirelTypeface' : 'Quirel',
        letterSpacing: 1.3
    },
    hasIconWidth: {
        flex: 1
    },
    container: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.black,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: Colors.dirtyWhite,
        paddingHorizontal: 10
    }
})
export default TextInput
