import React from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'

const TemplateScreen = ({ image, title, onPress }: any) => {
    return (
        <TouchableOpacity style={styles.main} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    style={styles.avatar}
                    source={require('../assets/Snapt-Logo-Portrait.png')}
                />
                <Text>{title}</Text>
            </View>
            <View style={styles.iconCircle}>
                <FeatherIcon name="arrow-right" size={20} color={'black'} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,

        borderRadius: 20,
        height: 80,

        shadowColor: '#0000001A',
        shadowOffset: {
            width: 0,
            height: 0.5
        },
        shadowOpacity: 0.1,
        shadowRadius: 0.5,

        elevation: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: 12
    },
    iconCircle: {
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1
    }
})

export default TemplateScreen
