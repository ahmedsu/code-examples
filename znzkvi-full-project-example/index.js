/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from 'react-query'
import { loadSounds } from '@helpers/loadSounds'
import * as Sentry from '@sentry/react-native'

Sentry.init({
    dsn: 'https://4dfe457e3adf4192f2b6e9d348479119@o4505903029616640.ingest.sentry.io/4505923895951360',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0
})

loadSounds()
const queryClient = new QueryClient()
const MainApp = Sentry.wrap(() => (
    <SafeAreaProvider>
        <NavigationContainer>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </NavigationContainer>
    </SafeAreaProvider>
))

AppRegistry.registerComponent(appName, () => MainApp)
