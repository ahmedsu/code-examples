import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Routes from './Routes'
import Settings from 'screens/Settings'
import UploadListing from 'screens/UploadListing'
import UploadDetail from 'screens/UploadDetail'
import Stats from 'screens/Stats'

const Stack = createNativeStackNavigator()
const SettingsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
            component={Settings}
            name={Routes.SettingsStack.Settings}
        />
        <Stack.Screen
            component={UploadListing}
            name={Routes.SettingsStack.UploadListing}
        />
        <Stack.Screen
            component={UploadDetail}
            name={Routes.SettingsStack.UploadDetail}
        />

        <Stack.Screen component={Stats} name={Routes.SettingsStack.Stats} />
    </Stack.Navigator>
)

export default SettingsStack
