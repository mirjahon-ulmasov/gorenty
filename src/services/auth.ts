import { Account } from "types/api";
import { api } from "./baseQuery";


export const authAPI = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<Account.DTO, Account.Credentials>({
            query: (credentials) => ({
                url: '/account/login/',
                method: 'POST',
                body: credentials
            })
        })
    })
})

export const { useLoginMutation } = authAPI