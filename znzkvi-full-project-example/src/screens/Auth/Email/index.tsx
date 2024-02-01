import { StyleSheet, useWindowDimensions, View } from 'react-native'
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
import { useNavigation } from '@react-navigation/native'
import Routes from '@navigation/Routes'
import { AuthStackNavigationProp } from '@navigation/AuthStack'
import Divider from '@components/Divider'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useCheckEmail from '@hooks/api/useCheckEmail'

const Email = () => {
    const [email, setEmail] = useState('')
    const { checkEmail } = useCheckEmail()
    const [, setError] = useState('')
    const [password, setPassword] = useState('')
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const { width } = useWindowDimensions()
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
            <InterText
                color={Colors.white}
                fs={24}
                style={localStyles.textAlignCenter}>
                Započni registraciju.
            </InterText>
            <Divider />
            <View style={localStyles.fullWidth}>
                <TextInput
                    placeholder="EMAIL"
                    value={email}
                    onChangeText={setEmail}
                    icon={<SvgIcons.Email />}
                    placeholderTextColor={Colors.lesserBlack}
                    fs={20}
                />
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
            </View>
            <Divider />
            <RectangularButton
                title="Pošalji"
                size="small"
                onPress={async () => {
                    const res = await checkEmail({ email, password })

                    if (res?.code !== '0000') {
                        setError(res?.message)
                        return
                    }
                    // if (!Defaults.PASSWORD_REGEX.test(password)) {
                    //     setError(
                    //         'Password mora sadržati najmanje 8 karaktera, jedno veliko slovo, jedno malo slovo i jedan broj.'
                    //     )
                    //     return
                    // }
                    setError('')
                    navigation.navigate(Routes.AuthStack.Register, {
                        email,
                        password
                    })
                }}
            />
            {/* <Divider /> */}
            <Row style={localStyles.centerRow}>
                <InterText fs={13}>Posjedujem profil.</InterText>
                <Divider horizontal size={5} />
                <UnderlinedButton
                    fs={13}
                    title="Prijavi se"
                    color={Colors.white}
                    onPress={() => {
                        navigation.navigate(Routes.AuthStack.Login)
                    }}
                />
            </Row>
            <Divider />
            <InterText fs={12} style={localStyles.textAlignCenter}>
                Registracijom potvrđujem da sam upoznat i saglasan sa uslovima
                korištenja i pravilima o privatnosti.
            </InterText>
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
    centerRow: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center'
    },
    fullWidth: {
        width: '100%'
    }
})
export default Email
