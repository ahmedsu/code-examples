import colors from 'colors'
import { useSelector } from 'hooks/reduxHooks'
import React from 'react'
import { View, Modal, StyleSheet, ActivityIndicator } from 'react-native'

const Loader = () => {
    const { isLoading } = useSelector(state => state.loading)
    if (isLoading)
        return (
            <Modal transparent animationType="fade" statusBarTranslucent>
                <View style={localStyles.container}>
                    <ActivityIndicator size="large" color={colors.WHITE} />
                </View>
            </Modal>
        )
    return null
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000080'
    }
})
export default Loader
