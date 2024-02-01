import React from 'react'
import {
    NativeStackNavigationProp,
    createNativeStackNavigator
} from '@react-navigation/native-stack'
import Home from '@screens/App/Home'
import Profile from '@screens/App/Profile'
import Quiz from '@screens/App/Quiz'

import Statistics from '@screens/App/Statistics'
import Settings from '@screens/App/Settings'
import Success from '@screens/App/Success'
import GetReady from '@screens/App/GetReady'
import Routes from './Routes'
import { Platform } from 'react-native'
import { Response } from '@customTypes/IQuiz'

//eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppStackParams = {
    Home: undefined
    Profile: undefined
    Quiz: { quizData: Response }
    Settings: undefined
    Statistics: undefined
    Success: { correct_answers: number }
    GetReady: { quizData: Response }
}

export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParams>
const Stack = createNativeStackNavigator()

const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: Platform.OS === 'android' ? 'simple_push' : 'none'
            }}>
            <Stack.Screen name={Routes.AppStack.Home} component={Home} />
            <Stack.Screen name={Routes.AppStack.Profile} component={Profile} />
            <Stack.Screen
                name={Routes.AppStack.Quiz}
                component={Quiz}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen
                name={Routes.AppStack.Settings}
                component={Settings}
            />
            <Stack.Screen
                name={Routes.AppStack.Statistics}
                component={Statistics}
            />
            <Stack.Screen
                name={Routes.AppStack.Success}
                component={Success}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen
                name={Routes.AppStack.GetReady}
                component={GetReady}
            />
        </Stack.Navigator>
    )
}
export default AppStack
