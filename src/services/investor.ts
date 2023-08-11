import { Investor, SearchParams } from 'types/api'
import { api } from './baseQuery'

const investorWithTags = api.enhanceEndpoints({
    addTagTypes: ['Investor'],
})

export const investorAPI = investorWithTags.injectEndpoints({
    endpoints: build => ({
        fetchInvestors: build.query<Investor.List, SearchParams>({
            query: params => ({
                url: '/investor/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Investor'],
        }),
        fetchInvestor: build.query<Investor.DTO, string>({
            query: id => `/investor/${id}/`,
            providesTags: () => ['Investor'],
        }),
        createInvestor: build.mutation<unknown, Investor.DTO>({
            query: data => ({
                url: '/investor/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Investor'],
        }),
        updateInvestor: build.mutation<unknown, Investor.DTO>({
            query: data => ({
                url: `/investor/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Investor'],
        }),
        addInvestorImage: build.mutation<
        { investor: number, id: number, image: number }, 
        { investor: number, image: number }>({
            query: data => ({
                url: '/investor_image/',
                method: 'POST',
                body: data,
            }),
            // TODO
            invalidatesTags: ['Investor'],
        }),
        deleteInvestorImage: build.mutation<unknown, { id: number }>({
            query: ({ id }) => ({
                url: `/investor_image/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Investor'],
        })
    }),
})

export const {
    useFetchInvestorsQuery,
    useFetchInvestorQuery,
    useCreateInvestorMutation,
    useUpdateInvestorMutation,
    useAddInvestorImageMutation,
    useDeleteInvestorImageMutation,
} = investorAPI
