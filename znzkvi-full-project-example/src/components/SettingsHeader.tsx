import { StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import Row from './Row'
import SquareButton from './SquareButton'
import Text from './Text'
import Divider from './Divider'

interface Props {
    icon: ReactNode
    title: string
}
const SettingsHeader = ({ icon, title }: Props) => {
    return (
        <>
            <Divider size={20} />
            <Row style={localStyles.centerItems}>
                <SquareButton icon={icon} />
                <Divider horizontal size={20} />
                <Text fs={52}>{title}</Text>
            </Row>
            <Divider size={40} />
        </>
    )
}

const localStyles = StyleSheet.create({
    centerItems: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default SettingsHeader
