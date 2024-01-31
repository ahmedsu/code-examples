import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {persistStore, persistReducer} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import rootReducer from './reducers'
import rootSaga from './sagas'
import ImmutablePersistenceTransform from './ImmutablePersistenceTransform'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'app',
        'auth',
        'user'
    ],
    blacklist: [
        'meal',
        'notification',
        'order',
        'shop'
    ],
    transforms: [ImmutablePersistenceTransform]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const sagaMiddleware = createSagaMiddleware()

const middlewares = [
    sagaMiddleware
]

const store = createStore(persistedReducer, applyMiddleware(...middlewares))

store.runSaga = sagaMiddleware.run

rootSaga(store)

export const persistor = persistStore(store)

export default store