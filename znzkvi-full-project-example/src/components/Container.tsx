import { View, StyleSheet, ViewStyle } from 'react-native'
import React, { ReactNode, memo, useMemo } from 'react'
import Colors from '@constants/Colors'
import Backgrounds from '@assets/svgs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type Background =
    | 'BlueBg'
    | 'GreenBg'
    | 'YellowBg'
    | 'OrangeBg'
    | 'GrayBg'
    | 'RedBg'
    | 'BrownBg'
interface Props {
    style?: ViewStyle
    childrenContainerStyle?: ViewStyle
    children: ReactNode | ReactNode[]
    background?: Background
    hideInset?: boolean
}

const Container = ({
    style,
    children,
    background,
    childrenContainerStyle,
    hideInset = false
}: Props) => {
    const insets = useSafeAreaInsets()
    const statusBarHeight = hideInset ? 0 : insets.top
    const Background = useMemo(() => {
        return background !== undefined ? Backgrounds[background] : null
    }, [background])
    return (
        <View style={[localStyles.container, style]}>
            {background && Background && (
                <Background
                    key={background}
                    width={'100%'}
                    height={'100%'}
                    style={localStyles.svgBackground}
                    preserveAspectRatio="none"
                />
            )}
            <View
                style={[
                    localStyles.childrenContainer,
                    { paddingTop: statusBarHeight },
                    childrenContainerStyle
                ]}>
                {children}
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.orange
    },
    svgBackground: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    childrenContainer: {
        flex: 1
    }
})
export default memo(Container)
