import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { api } from 'services/baseQuery'
import authReducer from './reducers/authSlice'

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: authReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        devTools: import.meta.env.MODE === 'development',
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(api.middleware),
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
