/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Account } from 'types/api';

const getInitState = () => {
    const user: Account.DTO | null = JSON.parse(localStorage.getItem('user') as string);
    const access_token = localStorage.getItem('access');
    const refresh_token = localStorage.getItem('refresh');

    return {
        user,
        access_token,
        refresh_token,
        isLoggedIn: !!user,
        lang: localStorage.getItem('i18nextLng') || 'ru',
        firebase_token: localStorage.getItem('firebase') || ''
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitState(),
    reducers: {
        setFirebaseToken: (state, action: PayloadAction<string>) => {
            state.firebase_token = action.payload
            localStorage.setItem('firebase', action.payload)
        },
        setCredentials: (state, action: PayloadAction<Account.DTO>) => {
            const user = action.payload;
            state.user = user;
            state.isLoggedIn = true;
            state.access_token = user.token.access;
            state.refresh_token = user.token.refresh;
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('access', user.token.access)
            localStorage.setItem('refresh', user.token.refresh)
        },
        setToken: (state, action: PayloadAction<{ access: string, refresh: string}>) => {
            const { access, refresh } = action.payload
            state.access_token = access
            state.refresh_token = refresh
            localStorage.setItem('access', access)
            localStorage.setItem('refresh', refresh)
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.access_token = null;
            state.refresh_token = null;
            localStorage.removeItem('user')
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
        },
    },
});

export const { setCredentials, setToken, logout, setFirebaseToken } = authSlice.actions;
export default authSlice.reducer;
