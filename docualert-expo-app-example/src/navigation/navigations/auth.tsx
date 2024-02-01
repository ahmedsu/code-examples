import { createStackNavigator } from '@react-navigation/stack'

import { LoginScreen, RegistrationScreen } from '@/screens'
import { NAVIGATION_NAMES } from '@/constants'

const DocumentStack = createStackNavigator()

export const AuthNavigation = () => {
  return (
    <DocumentStack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <DocumentStack.Screen
        name={NAVIGATION_NAMES.LOGIN}
        component={LoginScreen}
      />
      <DocumentStack.Screen
        name={NAVIGATION_NAMES.REGISTRATION}
        component={RegistrationScreen}
      />
    </DocumentStack.Navigator>
  )
}
