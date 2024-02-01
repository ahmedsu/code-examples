import { Pressable } from 'react-native'
import React, { useState } from 'react'
import CountryPickerModal, { ICountry } from './CountryPickerModal'
import { SvgUri } from 'react-native-svg'

interface Props {
    selectedCountry: ICountry | null
    onChooseCountry: (country: ICountry) => void
}
const Flag = ({ selectedCountry, onChooseCountry }: Props) => {
    const [isVisible, setIsVisible] = useState(false)
    if (!selectedCountry) return null
    return (
        <>
            <Pressable onPress={() => setIsVisible(true)}>
                <SvgUri height={50} width={40} uri={selectedCountry.flag} />
            </Pressable>
            <CountryPickerModal
                isVisible={isVisible}
                onChooseCountry={onChooseCountry}
                setIsVisible={setIsVisible}
            />
        </>
    )
}

export default Flag
