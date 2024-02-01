import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TemplateSelectorStack from './TemplateSelectorStack'
import Routes from './Routes'
import CapturePhotoStack from './CapturePhotoStack'
import SettingsStack from './SettingsStack'
import UserStack from './UserStack'
import HomeStack from './HomeStack'
import CustomTab from 'components/CustomTab'

import { useSelector } from 'hooks/reduxHooks'
import { NavigationContainer } from '@react-navigation/native'

const BottomTabs = createBottomTabNavigator()

const TabNavigator = () => {
    const { bottomTabVisible } = useSelector(state => state.bottomTab)

    return (
        <BottomTabs.Navigator
            tabBar={props =>
                bottomTabVisible ? <CustomTab {...props} /> : null
            }
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    display: bottomTabVisible ? 'none' : undefined
                }
            }}
            initialRouteName={Routes.TabNavigator.Home}>
            <BottomTabs.Screen
                component={HomeStack}
                name={Routes.TabNavigator.Home}
            />
            <BottomTabs.Screen
                component={TemplateSelectorStack}
                name={Routes.TabNavigator.Templates}
            />
            <BottomTabs.Screen
                component={CapturePhotoStack}
                name={Routes.TabNavigator.Photo}
                options={{ unmountOnBlur: true }}
            />
            <BottomTabs.Screen
                component={SettingsStack}
                name={Routes.TabNavigator.Settings}
            />
            <BottomTabs.Screen
                component={UserStack}
                name={Routes.TabNavigator.User}
            />
        </BottomTabs.Navigator>
    )
}

export default TabNavigator
