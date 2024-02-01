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
import { useNavigation } from '@react-navigation/native'
import Routes from '@navigation/Routes'
import { AuthStackNavigationProp } from '@navigation/AuthStack'
import Divider from '@components/Divider'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useGeneratePin from '@hooks/api/resetPassword/useGeneratePin'

const ForgotPassword_Email = () => {
    const [email, setEmail] = useState('')
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const { width } = useWindowDimensions()
    const { generatePin } = useGeneratePin()
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
                Na tvoj korisnički mail ćemo poslati instrukciju za izmjenu
                lozinke
            </InterText>
            <Divider />

            <TextInput
                placeholder="EMAIL"
                value={email}
                onChangeText={setEmail}
                icon={<SvgIcons.Email />}
                placeholderTextColor={Colors.lesserBlack}
                fs={20}
            />

            <Divider />
            <RectangularButton
                size="small"
                title="Pošalji"
                onPress={async () => {
                    const pin = await generatePin(email)
                    if (pin.code === '0000') {
                        navigation.navigate(
                            Routes.AuthStack.ForgotPassword.Code,
                            {
                                email
                            }
                        )
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
    },
    row: {
        width: '100%',
        justifyContent: 'center'
    }
})
export default ForgotPassword_Email
