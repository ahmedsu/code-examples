import { View, StyleSheet, Platform } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import PhoneInput from 'react-native-phone-input'
import Colors from '@constants/Colors'
import Flag from './CountryPicker/Flag'
import { ICountry } from './CountryPicker/CountryPickerModal'
import useGetCountries from '@hooks/api/useGetCountries'

interface Props {
    country: ICountry | null
    setCountry: (country: ICountry) => void
    setPhoneNumber: (phoneNumber: string) => void
}
const PhoneInputCustom = forwardRef(
    ({ country, setCountry, setPhoneNumber }: Props, ref) => {
        const phoneInputRef = useRef<PhoneInput>(null)
        const { data } = useGetCountries()

        const selectCountry = (countryVal: ICountry) => {
            phoneInputRef.current?.selectCountry(countryVal.code.toLowerCase())
            setCountry(countryVal)
        }
        const isPhoneNumberValid = () => {
            return phoneInputRef.current?.isValidNumber()
        }
        useImperativeHandle(ref, () => {
            isPhoneNumberValid
        })

        return (
            <View style={localStyles.container}>
                <PhoneInput
                    textStyle={localStyles.phoneText}
                    renderFlag={() => (
                        <Flag
                            selectedCountry={country}
                            onChooseCountry={selectCountry}
                        />
                    )}
                    onChangePhoneNumber={() => {
                        if (phoneInputRef.current?.getISOCode()) {
                            const countryData = data.data as ICountry[]

                            const obj = countryData.find(c => {
                                return (
                                    c.code.toLowerCase() ===
                                    phoneInputRef.current
                                        ?.getISOCode()
                                        .toLowerCase()
                                )
                            })
                            setPhoneNumber(phoneInputRef.current?.getValue())
                            if (obj) setCountry(obj)
                        }
                    }}
                    autoFormat
                    ref={phoneInputRef}
                    initialCountry={'ba'}
                    textProps={{
                        placeholder: 'Enter a phone number...'
                    }}
                />
            </View>
        )
    }
)

const localStyles = StyleSheet.create({
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
    },
    phoneText: {
        fontFamily: Platform.OS === 'ios' ? 'QuirelTypeface' : 'Quirel',
        color: Colors.lesserBlack,
        fontSize: 18
    },
    containerButtonStyle: {
        width: 30
    }
})
export default PhoneInputCustom
