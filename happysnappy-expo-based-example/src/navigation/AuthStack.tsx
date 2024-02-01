import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Login from 'screens/Login'
import Routes from './Routes'

const Stack = createNativeStackNavigator()

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            options={{ headerShown: false, animation: 'none' }}
            component={Login}
            name={Routes.AuthStack.Login}
        />
    </Stack.Navigator>
)

export default AuthStack
