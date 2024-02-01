import colors from 'colors'
import React from 'react'
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { setBottomTabs } from 'redux/actions/bottomTabActions'
import store from 'redux/store'
import HomeIcon from '../assets/icons/home.svg'
import Briefcase from '../assets/icons/briefcase.svg'
import Cog from '../assets/icons/cog.svg'
import User from '../assets/icons/user.svg'
import { SAFE_TIMEOUT } from 'screens/CapturePhoto'
import { setTemplate } from 'redux/actions/templateActions'

const ICON_HEIGHT = 30
const ICON_WIDTH = 32
const CustomTab = ({ state, descriptors, navigation }: any) => {
    const getIcon = (isFocused: boolean, routeName?: string) => {
        switch (routeName) {
            case 'home':
                return (
                    <HomeIcon
                        height={ICON_HEIGHT}
                        width={ICON_WIDTH}
                        color={isFocused ? colors.WHITE : '#FFFFFF80'}
                    />
                )
            case 'settings':
                return (
                    <Cog
                        height={ICON_HEIGHT}
                        width={ICON_WIDTH}
                        color={isFocused ? colors.WHITE : '#FFFFFF80'}
                    />
                )
            case 'user':
                return (
                    <User
                        height={ICON_HEIGHT}
                        width={ICON_WIDTH}
                        color={isFocused ? colors.WHITE : '#FFFFFF80'}
                    />
                )
            case 'briefcase':
                return (
                    <Briefcase
                        height={ICON_HEIGHT}
                        width={ICON_WIDTH}
                        color={isFocused ? colors.WHITE : '#FFFFFF80'}
                    />
                )
            default:
                return (
                    <FeatherIcon
                        name={'camera'}
                        size={30}
                        color={
                            routeName === 'camera' || isFocused
                                ? colors.WHITE
                                : '#FFFFFF80'
                        }
                    />
                )
        }
    }
    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: '#45AEFF',
                height: Platform.OS === 'ios' ? 100 : 90,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            {state.routes.map(
                (route: { key: string | number; name: any }, index: any) => {
                    const { options } = descriptors[route.key]
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name

                    const isFocused = state.index === index

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key
                        })

                        if (!isFocused && !event.defaultPrevented) {
                            if (
                                route.name === 'CapturePhotoStack' &&
                                store.getState().template.template != ''
                            ) {
                                store.dispatch(setTemplate(null))
                                store.dispatch(setBottomTabs(false))
                                setTimeout(() => {
                                    navigation.navigate(route.name)
                                }, SAFE_TIMEOUT)
                            } else {
                                navigation.navigate(route.name)
                            }
                        }
                    }

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key
                        })
                    }

                    let routeName
                    if (route.name === 'Home') {
                        routeName = 'home'
                    } else if (route.name === 'CapturePhotoStack') {
                        routeName = 'camera'
                    } else if (route.name === 'SettingsStack') {
                        routeName = 'settings'
                    } else if (route.name === 'User') {
                        routeName = 'user'
                    } else if (route.name === 'TemplateSelectorStack') {
                        routeName = 'briefcase'
                    }

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={
                                isFocused ? { selected: true } : {}
                            }
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={
                                routeName === 'camera'
                                    ? localStyles.cameraIconContainerStyle
                                    : { flex: 1, alignItems: 'center' }
                            }>
                            {getIcon(isFocused, routeName)}
                        </TouchableOpacity>
                    )
                }
            )}
        </View>
    )
}

const localStyles = StyleSheet.create({
    cameraIconContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBBA00',
        width: 68,
        height: 68,
        borderRadius: 34,
        marginHorizontal: 10
    }
})
export default CustomTab
