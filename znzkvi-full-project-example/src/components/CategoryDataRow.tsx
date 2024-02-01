import { Platform, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import Row from './Row'
import Divider from './Divider'
import Text from './Text'

interface Props {
    icon: ReactNode
    title: string
    percentage: string
}

const CategoryDataRow = ({ icon, title, percentage }: Props) => {
    return (
        <Row style={localStyles.container}>
            <Row style={localStyles.alignCenter}>
                {icon}
                <Divider horizontal />
                <Text fs={22} letterSpacing={1.2} style={localStyles.breakLine}>
                    {title}
                </Text>
            </Row>
            <Text fs={30} letterSpacing={1.2}>
                {percentage}
            </Text>
        </Row>
    )
}

const localStyles = StyleSheet.create({
    container: {
        height: Platform.OS === 'android' ? 60 : 70,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    alignCenter: {
        alignItems: 'center',
        width: '77%'
    },
    breakLine: {
        flexWrap: 'wrap',
        flex: 1
    }
})
export default CategoryDataRow
