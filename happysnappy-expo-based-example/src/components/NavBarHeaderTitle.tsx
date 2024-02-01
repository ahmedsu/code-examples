import React from 'react'
import {
    View,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const NavBarHeaderTitle = (props?: string) => {
    const navigation = useNavigation()
    return (
        <View
            style={[
                typeof props?.goBack === 'string' && props?.goBack != undefined
                    ? styles.containerWithArrow
                    : styles.container
            ]}>
            {typeof props?.goBack === 'string' && props?.goBack != undefined ? (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-back"
                        size={30}
                        color="#fff"
                        style={{ marginLeft: 10, marginRight: 10 }}
                    />
                </TouchableOpacity>
            ) : null}
            <View style={styles.headerTitleView}>
                <Image
                    resizeMode="contain"
                    source={require('../assets/Snapt-Logo-Landscape-White.png')}
                    style={styles.imageStyle}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#316d99',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerWithArrow: {
        backgroundColor: '#316d99',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: '37.5%'
    },
    headerTitleView: {
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS == 'ios' ? 0 : 12,
        paddingBottom: 7
    },
    imageStyle: {
        width: 100,
        height: 35
    }
})

export default NavBarHeaderTitle
