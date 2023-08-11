import {
    BaseQueryApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query'
import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { logout, setToken } from 'store/reducers/authSlice'
import { RootState } from 'store/store'

export const API_BASE_URL: string = import.meta.env.VITE_BASE_URL

interface RefreshResponse {
    data : {
        access: string;
    }
}

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
        const { access_token } = (getState() as RootState).auth
        if (access_token) {
            headers.set('Authorization', `Bearer ${access_token}`)
            headers.set('Content-Type', 'application/json')
        }
    },
})

const baseQueryWithReauth = async (
    args: FetchArgs | string,
    api: BaseQueryApi,
    extraOptions: any
) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error?.status === 401) {
        console.log('sending refresh token')
        const { refresh_token } = (api.getState() as RootState).auth

        const refreshResult = await baseQuery(
            {
                url: '/account/refresh/',
                method: 'POST',
                body: { refresh: refresh_token },
            },
            api,
            extraOptions
        ) as RefreshResponse

        if (refreshResult.data) {
            api.dispatch(
                setToken({
                    access: refreshResult.data?.access,
                    refresh: refresh_token as string,
                })
            )
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    } 
    return result
}

export const api = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: _builder => ({}),
})
