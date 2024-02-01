import React from 'react'
import { Text, StyleSheet, Pressable, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface CameraHeaderProps {
    onPressBack: () => void
    flash?: boolean
    flashFunc?: () => void
    flashText?: string
    isViewLandscape?: boolean
    currentOrientation?: string
    isCamera?: boolean
}

const CameraHeader = ({
    onPressBack,
    flash,
    flashText,
    flashFunc,
    isViewLandscape,
    currentOrientation,
    isCamera
}: CameraHeaderProps) => {

    if (flashText === 'torch') {
        flashText = 'on'
    }


    if (flashText === 'torch') {
        flashText = 'on'
    }

    const landscapeStyle = useAnimatedStyle(() => {
        if (currentOrientation === 'LANDSCAPE-RIGHT') {
            
            return {
                transform: [{ rotate: withTiming('-90deg') }]
            }
        } else if (currentOrientation === 'LANDSCAPE-LEFT') {
            
            return {
                transform: [{ rotate: withTiming('90deg') }]
            }
        } else {
           
            return {
                transform: [{ rotate: withTiming('0deg') }]
            }
        }
    }, [currentOrientation])

    isCamera ? (flash = true) : null
    return (
        <View style={[styles.containerPortrait]}>
            <AnimatedPressable
                style={[landscapeStyle, styles.backIcon]}
                onPress={() => onPressBack()}>
                <Icon name="arrow-back-circle-outline" size={51} color="#fff" />
            </AnimatedPressable>
            {flash ? (
                <AnimatedPressable
                    style={[landscapeStyle, styles.flashButton]}
                    onPress={flashFunc}>
                    <View style={styles.flashContainerView}>
                        <Text style={styles.flipText}>{flashText}</Text>
                        <Icon name="flash" color="#fff" size={30} />
                    </View>
                </AnimatedPressable>
            ) : (
                <View></View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    rotateToRight: {
        transform: [{ rotate: '-90deg' }]
    },
    rotateToLeft: {
        transform: [{ rotate: '90deg' }]
    },
    iconsInPortrait: {
        transform: [{ rotate: '0deg' }]
    },
    containerPortrait: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        //paddingTop: 50,
        marginHorizontal: 20,
        position: 'absolute',
        width: '90%',
        top: 55,
        left: 0,
        zIndex: 3
    },
    // headerContainer: {
    //     position: 'absolute',
    //     top: 30,
    //     left: 0,
    //     height: 110,
    //     width: '100%',
    //     zIndex: 3,
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    backIcon: {},
    flashButton: {
        zIndex: 5,
        position: 'absolute',

        bottom: 20,
        right: 0
    },
    flashContainerView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    flipText: {
        color: 'white',
        fontSize: 15
    }
})

export default CameraHeader
