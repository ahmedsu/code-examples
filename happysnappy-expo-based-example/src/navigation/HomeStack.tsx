import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Routes from './Routes'
import Home from 'screens/Home'

const Stack = createNativeStackNavigator()
const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Home} name={Routes.HomeStack.Home} />
    </Stack.Navigator>
)

export default HomeStack
