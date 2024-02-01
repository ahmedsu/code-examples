import React, { useRef } from 'react'
import {
    Dimensions,
    Image,
    ImageBackground,
    StatusBar,
    View,
    SafeAreaView,
    TouchableWithoutFeedback
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const height = Dimensions.get('window').height

export interface ContainerProps {
    children: React.ReactNode
    style?: any
}

const Container = ({ children, style }: ContainerProps) => {
    const scrollRef = useRef()
    const navigation = useNavigation()

    return (
        <ImageBackground
            source={require('../assets/background/background_image.png')}
            style={{
                flex: 1
            }}>
            <SafeAreaView />
            <View style={{ height: StatusBar.currentHeight }}></View>
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('Home' as never)}>
                <Image
                    style={{
                        marginLeft: 30,
                        marginVertical: 20,
                        width: 163,
                        height: 70
                    }}
                    resizeMode={'contain'}
                    source={require('../assets/logo/white_logo.png')}
                />
            </TouchableWithoutFeedback>

            <View
                style={[
                    {
                        flex: 1,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        paddingHorizontal: 30,
                        height: height,
                        overflow: 'hidden'
                    },
                    { ...style }
                ]}
                scrollViewRef={scrollRef}>
                {/* <Divider size={31} /> */}
                {children}
            </View>
        </ImageBackground>
    )
}

export default Container
