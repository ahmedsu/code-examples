import { StyleSheet, useWindowDimensions } from 'react-native'
import React, { useMemo, useState } from 'react'
import SvgIcons from '@assets/svgs/icons'
import TextInput from '@components/TextInput'
import RectangularButton from '@components/RectangularButton'
import Row from '@components/Row'
import UnderlinedButton from '@components/UnderlinedButton'
import ZnzkviBa from '@components/ZnzkviBa'
import InterText from '@components/InterText'
import useDrawerStore from '@zustand/drawerManagement/store'
import { selectSetCurrentDrawerTab } from '@zustand/drawerManagement/selectors'
import Colors from '@constants/Colors'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import Routes from '@navigation/Routes'
import { AuthStackNavigationProp, AuthStackParams } from '@navigation/AuthStack'
import Divider from '@components/Divider'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useGeneratePassword from '@hooks/api/resetPassword/useGeneratePassword'
import useAlertStore from '@zustand/alertManagement/store'

const ForgotPassword_Password = () => {
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [password, setPassword] = useState('')
    const { setMessageAndType } = useAlertStore()
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const { width } = useWindowDimensions()
    const navigation = useNavigation<AuthStackNavigationProp>()
    const route =
        useRoute<RouteProp<AuthStackParams, 'ForgotPassword_Password'>>()

    const logoSizeWithAspectRatio = useMemo(() => {
        return { width: (width - 40) * 0.9, height: (width - 40) * 0.9 }
    }, [width])
    const { generatePassword } = useGeneratePassword()
    return (
        <KeyboardAwareScrollView
            style={localStyles.container}
            contentContainerStyle={localStyles.contentContainerStyle}>
            <SvgIcons.Logo
                width={logoSizeWithAspectRatio.width}
                height={logoSizeWithAspectRatio.height}
            />
            <Divider />
            <InterText
                color={Colors.white}
                fs={24}
                style={localStyles.textAlignCenter}>
                Upišite vaš email i započnite registraciju.
            </InterText>
            <Divider />

            <TextInput
                secureTextEntry
                placeholder="PASSWORD"
                value={password}
                onChangeText={setPassword}
                icon={<SvgIcons.Password />}
                placeholderTextColor={Colors.lesserBlack}
                fs={20}
            />
            <TextInput
                secureTextEntry
                placeholder="PASSWORD"
                value={passwordRepeat}
                onChangeText={setPasswordRepeat}
                icon={<SvgIcons.Password />}
                placeholderTextColor={Colors.lesserBlack}
                fs={20}
            />
            <Divider />
            <RectangularButton
                size="small"
                title="Potvrdi"
                onPress={async () => {
                    if (password !== passwordRepeat) {
                        setMessageAndType(
                            'Greška',
                            'Šifre moraju biti iste',
                            'error'
                        )
                        return
                    }
                    const res = await generatePassword({
                        email: route.params.email,
                        pin: route.params.code,
                        password: password
                    })
                    if (res.code === '0000') {
                        navigation.navigate(Routes.AuthStack.Login)
                    }
                }}
            />

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
    }
})
export default ForgotPassword_Password
