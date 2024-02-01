import { StyleSheet, useWindowDimensions } from 'react-native'
import React, { useMemo, useState } from 'react'
import SvgIcons from '@assets/svgs/icons'
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
import ConfirmationCode from '@components/ConfirmationCode'
import useVerifyPin from '@hooks/api/resetPassword/useVerifyPin'

const ForgotPassword_Code = () => {
    const [code, setCode] = useState('')
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const { width } = useWindowDimensions()
    const route = useRoute<RouteProp<AuthStackParams, 'ForgotPassword_Code'>>()
    const navigation = useNavigation<AuthStackNavigationProp>()
    const { verifyPin } = useVerifyPin()
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
                Upiši šestocifreni kod:
            </InterText>
            <Divider />

            <ConfirmationCode value={code} setValue={setCode} />
            <Divider />
            <RectangularButton
                title="Pošalji"
                size="small"
                onPress={async () => {
                    const verified = await verifyPin({
                        email: route.params.email,
                        pin: code
                    })

                    if (verified.code === '0000') {
                        navigation.navigate(
                            Routes.AuthStack.ForgotPassword.Password,
                            { code, email: route.params.email }
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
export default ForgotPassword_Code
