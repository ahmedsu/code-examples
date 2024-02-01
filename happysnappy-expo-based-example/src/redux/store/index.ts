import { createStore } from 'redux'
import rootReducer from '@redux/reducers'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['upload', 'user', 'settings', 'login'],
    stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer)
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
