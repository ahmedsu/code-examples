import { StyleSheet, useWindowDimensions, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import SvgIcons from '@assets/svgs/icons'
import TextInput from '@components/TextInput'
import RectangularButton from '@components/RectangularButton'
import Row from '@components/Row'
import UnderlinedButton from '@components/UnderlinedButton'
import ZnzkviBa from '@components/ZnzkviBa'
import useDrawerStore from '@zustand/drawerManagement/store'
import { selectSetCurrentDrawerTab } from '@zustand/drawerManagement/selectors'
import Colors from '@constants/Colors'
import { useNavigation } from '@react-navigation/native'
import Routes from '@navigation/Routes'
import { AuthStackNavigationProp } from '@navigation/AuthStack'
import Divider from '@components/Divider'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useLogin from '@hooks/api/useLogin'
import useAuthStore from '@zustand/auth/store'
import * as Keychain from 'react-native-keychain'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const { width } = useWindowDimensions()
    const { login } = useLogin()
    const { setTokenValues } = useAuthStore()
    const navigation = useNavigation<AuthStackNavigationProp>()
    const logoSizeWithAspectRatio = useMemo(() => {
        return { width: (width - 40) * 0.9, height: (width - 40) * 0.9 }
    }, [width])

    return (
        <KeyboardAwareScrollView
            style={localStyles.container}
            contentContainerStyle={localStyles.contentContainerStyle}>
            <SvgIcons.Logo
                width={logoSizeWithAspectRatio.width}
                height={logoSizeWithAspectRatio.height}
            />
            <Divider />
            <View style={localStyles.fullWidth}>
                <TextInput
                    placeholder="USERNAME"
                    value={username}
                    onChangeText={setUsername}
                    icon={<SvgIcons.Email />}
                    placeholderTextColor={Colors.lesserBlack}
                    fs={20}
                />
                <Divider size={10} />
                <TextInput
                    secureTextEntry
                    placeholder="PASSWORD"
                    value={password}
                    onChangeText={setPassword}
                    icon={<SvgIcons.Password />}
                    placeholderTextColor={Colors.lesserBlack}
                    fs={20}
                />
            </View>
            <Divider />
            <RectangularButton
                size="small"
                title="Prijavi se"
                onPress={async () => {
                    const res = await login({ username, password })
                    if (res.code === '0000') {
                        await Keychain.setGenericPassword(username, password)
                        setTokenValues({
                            token: res?.data?.api_token,
                            hasToken: true
                        })
                    }
                }}
            />
            <Row style={localStyles.row}>
                <UnderlinedButton
                    color={Colors.white}
                    title="Zaboravili ste lozinku"
                    onPress={() => {
                        navigation.navigate(
                            Routes.AuthStack.ForgotPassword.Email
                        )
                    }}
                />
            </Row>

            <Divider />

            <Row style={localStyles.justifySpaceBetween}>
                <UnderlinedButton
                    onPress={() => {
                        setCurrentDrawerTab('privacy')
                    }}
                    title="Pravila privatnosti"
                />
                <UnderlinedButton
                    onPress={() => {
                        setCurrentDrawerTab('terms')
                    }}
                    title="Uslovi korištenja"
                />
            </Row>
            <ZnzkviBa />
        </KeyboardAwareScrollView>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'space-between',
        paddingHorizontal: 20
        //  alignItems: 'center'
    },
    justifySpaceBetween: {
        justifyContent: 'space-between'
    },
    textAlignCenter: {
        textAlign: 'center'
    },
    contentContainerStyle: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexGrow: 1
    },
    row: {
        width: '100%',
        justifyContent: 'center'
    },
    fullWidth: {
        width: '100%'
    }
})
export default Login
