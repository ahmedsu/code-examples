import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '.';
import sagaAccumulator from './sagas';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Midlewares
const sagaMiddleware = createSagaMiddleware({
  onError: ErrorUtils.getGlobalHandler(),
});

const middlewares = [sagaMiddleware];

// Persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middlewares)));

// Create persistor
export const persistor = persistStore(store);

// Start sagas
store.runSaga = sagaMiddleware.run;
sagaAccumulator.forEach((saga) => sagaMiddleware.run(saga));

export default store;
