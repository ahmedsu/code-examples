import React from 'react'
import {useTheme} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import stacks from './stacks'
import {Routes} from '@config'
import {useSelector} from 'react-redux'

const Stack = createStackNavigator()

export default () => {

    const {isFirstTime} = useSelector(({app}) => app)

    const {colors} = useTheme()

    const renderStacks = (item, index) => <Stack.Screen key={index} {...item} />

    return (
        <Stack.Navigator
            initialRouteName={Routes.login}
            screenOptions={{
                headerTintColor: colors.text,
                headerBackTitle: ' ',
                headerStyle: {
                    backgroundColor: colors.background,
                    elevation: 0,
                    shadowOffset: {
                        height: 0
                    }
                }
            }}
        >
            {stacks.map(renderStacks)}
        </Stack.Navigator>
    )
}