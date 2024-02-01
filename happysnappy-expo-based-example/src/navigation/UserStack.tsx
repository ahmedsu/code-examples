import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import User from 'screens/User'
import Routes from './Routes'

const Stack = createNativeStackNavigator()
const UserStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={User} name={Routes.UserStack.User} />
    </Stack.Navigator>
)

export default UserStack
