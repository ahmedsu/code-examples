import { View, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import Svgs from '@assets/svgs'
import SvgIcons from '@assets/svgs/icons'
import TextInput from '@components/TextInput'
import Divider from '@components/Divider'
import RectangularButton from '@components/RectangularButton'
import ZnzkviBa from '@components/ZnzkviBa'
import RoundButton from '@components/RoundButton'
import { scaleByHeight, scaleByWidth } from '@constants/Scaling'
import InterText from '@components/InterText'
import Colors from '@constants/Colors'
import useAuthStore from '@zustand/auth/store'
import useDrawerStore from '@zustand/drawerManagement/store'
import { selectSetCurrentDrawerTab } from '@zustand/drawerManagement/selectors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PhoneInputCustom from '@components/PhoneInput'
import { ICountry } from '@components/CountryPicker/CountryPickerModal'
import CountryPickerInput from '@components/CountryPicker/CountryPickerInput'
import Defaults from '@constants/Defaults'
import { RouteProp, useRoute } from '@react-navigation/native'
import { AuthStackParams } from '@navigation/AuthStack'
import useRegister from '@hooks/api/useRegister'
import * as Keychain from 'react-native-keychain'

const Register = () => {
    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [username, setUsername] = useState('')
    const [country, setCountry] = useState<ICountry | null>(Defaults.BOSNIA)
    const [phoneCountry, setPhoneCountry] = useState<ICountry | null>(
        Defaults.BOSNIA
    )
    const [phoneNumber, setPhoneNumber] = useState('')
    const { register } = useRegister()
    const route = useRoute<RouteProp<AuthStackParams, 'Register'>>()
    const setCurrentDrawerTab = useDrawerStore(selectSetCurrentDrawerTab)
    const phoneRef = useRef<{ isPhoneNumberValid: () => boolean }>(null)
    const { setTokenValues } = useAuthStore()

    return (
        <KeyboardAwareScrollView
            style={localStyles.container}
            contentContainerStyle={localStyles.contentContainer}>
            <View style={localStyles.flexOne}>
                <Divider size={5} />
                <View style={[localStyles.fullWidth, localStyles.flexEnd]}>
                    <RoundButton
                        onPress={() => setCurrentDrawerTab('main')}
                        icon={
                            <SvgIcons.BurgerMenu
                                width={scaleByHeight(36)}
                                height={scaleByHeight(26)}
                            />
                        }
                    />
                </View>
                <View style={[localStyles.fullWidth, localStyles.center]}>
                    <Svgs.ZnzkviText
                        width={scaleByWidth(221)}
                        height={scaleByHeight(81)}
                    />
                </View>
                <Divider size={15} />
                <InterText
                    fs={24}
                    color={Colors.white}
                    weight="bold"
                    style={localStyles.cetnerText}>
                    Završi registraciju i{'\n'} zaigraj ZNZKVI!
                </InterText>
                <Divider size={15} />
                {/* <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                />
                <Divider size={15} /> */}

                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ime i prezime"
                />
                <Divider size={15} />

                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                />
                <Divider size={15} />
                <TextInput
                    value={city}
                    onChangeText={setCity}
                    placeholder="Grad"
                />
                <Divider size={15} />

                {/* <TextInput
                    value={country}
                    onChangeText={setCountry}
                    placeholder="Drzava"
                /> */}
                {/* <CountryPickerCustom
                    setCountryName={setCountryName}
                    countryName={countryName}
                /> */}
                <CountryPickerInput
                    selectedCountry={country}
                    onChooseCountry={setCountry}
                />
                <Divider size={15} />

                {/* <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Telefon"
                /> */}
                <PhoneInputCustom
                    ref={phoneRef}
                    country={phoneCountry}
                    setCountry={setPhoneCountry}
                    setPhoneNumber={setPhoneNumber}
                />
                <Divider size={15} />

                <RectangularButton
                    size="small"
                    title="Pošalji"
                    onPress={async () => {
                        const res = await register({
                            name,
                            city,
                            country: country?.id,
                            email: route.params.email,
                            username,
                            password: route.params.password,
                            phone: phoneNumber
                        })
                        if (res.code === '0000') {
                            await Keychain.setGenericPassword(
                                username,
                                route.params.password
                            )
                            setTokenValues({
                                token: res?.data?.api_token,
                                hasToken: true
                            })
                        }
                        //  setTokenValues({ token: '', hasToken: true })
                    }}
                />
            </View>
            <ZnzkviBa />
        </KeyboardAwareScrollView>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    contentContainer: {
        flexGrow: 1
    },
    fullWidth: {
        width: '100%'
    },
    flexOne: {
        flex: 1
    },
    flexEnd: {
        alignItems: 'flex-end'
    },
    center: {
        alignItems: 'center'
    },
    cetnerText: {
        textAlign: 'center'
    }
})
export default Register
