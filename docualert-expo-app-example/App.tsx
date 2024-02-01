import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import { Navigation } from '@/navigation'
import { theme } from '@/theme'
import notifee, { AuthorizationStatus } from '@notifee/react-native'
import 'react-native-gesture-handler'
import '@/localization'
import * as RNLocalize from 'react-native-localize'
import { changeLanguage } from 'i18next'
import { useLanguageStore } from '@/store'

const App = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat-100': require('./assets/fonts/Montserrat-Thin.ttf'),
    'Montserrat-200': require('./assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-300': require('./assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-400': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-500': require('./assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-600': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-700': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-800': require('./assets/fonts/Montserrat-ExtraBold.ttf')
  })
  const { language } = useLanguageStore(state => state)

  useEffect(() => {
    changeLanguage(language ?? RNLocalize.getLocales()[0].languageCode)
  }, [])

  if (!fontsLoaded) {
    return null
  }

  async function requestUserPermission() {
    const settings = await notifee.requestPermission()

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission settings:', settings)
    } else {
      console.log('User declined permissions')
    }
  }

  requestUserPermission()

  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <Navigation />
      </NativeBaseProvider>
    </NavigationContainer>
  )
}

export default App
