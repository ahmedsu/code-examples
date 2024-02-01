import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Routes from './Routes'
import TemplateSelector from 'screens/TemplateSelector'
import ProjectSelector from 'screens/ProjectSelector'

const Stack = createNativeStackNavigator()
const TemplateSelectorStack = () => (
    <Stack.Navigator
        initialRouteName={Routes.TemplateSelectorStack.ProjectSelector}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen
            component={ProjectSelector}
            name={Routes.TemplateSelectorStack.ProjectSelector}
        />
        <Stack.Screen
            component={TemplateSelector}
            name={Routes.TemplateSelectorStack.TemplateSelector}
        />
    </Stack.Navigator>
)

export default TemplateSelectorStack
