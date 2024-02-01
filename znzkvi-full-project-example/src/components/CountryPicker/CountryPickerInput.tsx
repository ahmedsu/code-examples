import { StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '@constants/Colors'
import CountryPickerModal, { ICountry } from './CountryPickerModal'
import Item from './Item'

interface Props {
    selectedCountry: ICountry | null
    onChooseCountry: (country: ICountry) => void
    withIcon?: boolean
    isPickerInSettings?: boolean
    enabled?: boolean
}
const CountryPickerInput = ({
    selectedCountry,
    onChooseCountry,
    withIcon = true,
    isPickerInSettings = false,
    enabled = true
}: Props) => {
    const [isVisible, setIsVisible] = useState(false)
    return (
        <>
            <Pressable
                style={isPickerInSettings ? null : localStyles.container}
                onPress={enabled ? () => setIsVisible(true) : undefined}>
                <Item
                    item={selectedCountry}
                    onPress={enabled ? () => setIsVisible(true) : undefined}
                    withIcon={withIcon}
                    isPickerInSettings={isPickerInSettings}
                />
            </Pressable>
            <CountryPickerModal
                isVisible={isVisible}
                onChooseCountry={onChooseCountry}
                setIsVisible={setIsVisible}
            />
        </>
    )
}

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
    }
})

export default CountryPickerInput
