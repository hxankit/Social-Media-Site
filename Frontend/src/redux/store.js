import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './authSlice';
import postSlice from './postSlice'

// Persist configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    // whitelist: ['auth','post'], // Only persist the auth reducer
};

// Combine all reducers
const rootReducer = combineReducers({
    auth: authSlice,
    posts:postSlice
});

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
