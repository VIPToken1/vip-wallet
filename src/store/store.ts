import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import reducers from './reducers';

const persistConfig = {
  key: 'vip-token',
  storage: AsyncStorage
  // whitelist: ['crypto'],
  // whitelist: []
};

const middlewares = [thunk];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const composeByEnv = () =>
  composeWithDevTools({ trace: __DEV__ })(applyMiddleware(...middlewares));

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(persistedReducer, composeByEnv());

export const persistor = persistStore(store);
