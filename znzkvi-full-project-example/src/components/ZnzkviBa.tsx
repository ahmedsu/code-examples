import { View, Pressable, Linking, StyleSheet } from 'react-native'
import React from 'react'
import InterText from './InterText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ZnzkviBa = () => {
    const { bottom } = useSafeAreaInsets()
    const bottomHeight = bottom > 0 ? bottom : 20
    return (
        <View style={[localStyles.container, { height: bottomHeight }]}>
            <Pressable onPress={() => Linking.openURL('https://www.znzkvi.ba')}>
                <InterText>www.znzkvi.ba</InterText>
            </Pressable>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    }
})

export default ZnzkviBa
