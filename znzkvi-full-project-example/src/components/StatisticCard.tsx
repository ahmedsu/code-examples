import { View, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@constants/Colors'
import Text from '@components/Text'
import Divider from './Divider'
interface Props {
    label: string
    value: string
    itemWidth: number
}
const StatisticCard = ({ label, value, itemWidth }: Props) => {
    return (
        <View style={[localStyles.container, { width: itemWidth }]}>
            <Text fs={52}>{value}</Text>
            <Divider />
            <Text fs={20} color={Colors.white}>
                {label}
            </Text>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        height: 100,
        width: '45%',
        borderColor: Colors.lesserBlack,
        borderWidth: 3,
        borderRadius: 8,
        backgroundColor: Colors.orange,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default StatisticCard
