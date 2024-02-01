import { StyleSheet, FlatList } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import useGetCountries from '@hooks/api/useGetCountries'
import Item from './Item'
import Colors from '@constants/Colors'
import Divider from '@components/Divider'

export interface ICountry {
    name: string
    id: number
    name_ba: string | null
    code: string
    flag: string
    phone_code: string
}
interface Props {
    isVisible: boolean
    setIsVisible: (isVisible: boolean) => void
    onChooseCountry: (country: ICountry) => void
}
const CountryPickerModal = ({
    isVisible,
    setIsVisible,
    onChooseCountry
}: Props) => {
    const { data } = useGetCountries()

    const renderItem = ({ item }: { item: ICountry }) => {
        return (
            <Item
                item={item}
                onPress={() => {
                    onChooseCountry(item)
                    setIsVisible(false)
                }}
            />
        )
    }
    return (
        <Modal
            statusBarTranslucent
            isVisible={isVisible}
            style={localStyles.noMargin}
            hasBackdrop={false}>
            <Divider size={50} />
            <FlatList
                style={localStyles.flatList}
                contentContainerStyle={localStyles.flatListContainer}
                data={data?.data || []}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </Modal>
    )
}

const localStyles = StyleSheet.create({
    noMargin: {
        margin: 0,
        padding: 20,
        backgroundColor: Colors.dirtyWhite,
        flex: 1
    },
    flatList: {
        flex: 1
    },
    flatListContainer: {
        flexGrow: 1
    }
})
export default CountryPickerModal
