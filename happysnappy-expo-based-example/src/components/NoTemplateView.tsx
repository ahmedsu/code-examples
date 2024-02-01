import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import Button from './Button'
import Container from './Container'
import Divider from './Divider'
import ExpandableView from './ExpandableView'
import Title from './Title'

interface Props {
    onPress: () => void
}
const NoTemplateView = ({ onPress }: Props) => {
    return (
        <Container>
            <Divider size={30} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={localStyles.alignCenter}>
                    <Title>
                        Select a project template
                    </Title>
                    <Title>
                        before scanning the QR code
                    </Title>
                </View>
                <Divider size={30} />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: '60%', alignItems: 'center' }}>
                        <Button onPress={onPress} text="Select Project" />
                    </View>
                </View>
                <Divider size={30} />
                <ExpandableView />
            </ScrollView>
        </Container>
    )
}

const localStyles = StyleSheet.create({
    alignCenter: {
        alignItems: 'center'
    }
})
export default NoTemplateView
