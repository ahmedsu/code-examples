/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import React from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import store from './src/redux/store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'



const persistor = persistStore(store)

const MainApp = () => (
    <NavigationContainer>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <App />
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    </NavigationContainer>
)

AppRegistry.registerComponent(appName, () => MainApp)