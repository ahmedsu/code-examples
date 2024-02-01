import React from 'react'
import {
    NativeStackNavigationProp,
    createNativeStackNavigator
} from '@react-navigation/native-stack'
import Email from '@screens/Auth/Email'
import Register from '@screens/Auth/Register'
import Routes from './Routes'
import Login from '@screens/Auth/Login'
import ForgotPassword_Email from '@screens/Auth/ForgotPassword/ForgotPassword_Email'
import { Platform } from 'react-native'
import ForgotPassword_Password from '@screens/Auth/ForgotPassword/ForgotPassword_Password'
import ForgotPassword_Code from '@screens/Auth/ForgotPassword/ForgotPassword_Code'

//eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AuthStackParams = {
    Email: undefined
    Register: { email: string; password: string }
    Login: undefined
    ForgotPassword_Email: undefined
    ForgotPassword_Code: { email: string }
    ForgotPassword_Password: { email: string; code: string }
}

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParams>
const Stack = createNativeStackNavigator<AuthStackParams>()

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: Platform.OS === 'android' ? 'simple_push' : 'none'
            }}>
            <Stack.Screen name={Routes.AuthStack.Email} component={Email} />
            <Stack.Screen
                name={Routes.AuthStack.Register}
                component={Register}
            />
            <Stack.Screen name={Routes.AuthStack.Login} component={Login} />
            <Stack.Screen
                name={Routes.AuthStack.ForgotPassword.Email}
                component={ForgotPassword_Email}
            />
            <Stack.Screen
                name={Routes.AuthStack.ForgotPassword.Code}
                component={ForgotPassword_Code}
            />
            <Stack.Screen
                name={Routes.AuthStack.ForgotPassword.Password}
                component={ForgotPassword_Password}
            />
        </Stack.Navigator>
    )
}

export default AuthStack
