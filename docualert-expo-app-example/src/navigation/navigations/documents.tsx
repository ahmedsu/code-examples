import { createStackNavigator } from '@react-navigation/stack'

import { Documents, Edit } from '@/screens'
import { NAVIGATION_NAMES } from '@/constants'

const DocumentStack = createStackNavigator()

export const DocumentsNavigation = () => {
  return (
    <DocumentStack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <DocumentStack.Screen
        name={NAVIGATION_NAMES.DOCUMENTS}
        component={Documents}
      />
      <DocumentStack.Screen name={NAVIGATION_NAMES.EDIT} component={Edit} />
    </DocumentStack.Navigator>
  )
}
