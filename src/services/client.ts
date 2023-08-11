import { Client, SearchParams } from 'types/api'
import { api } from './baseQuery'

const clientWithTags = api.enhanceEndpoints({
    addTagTypes: ['Client'],
})

export const clientAPI = clientWithTags.injectEndpoints({
    endpoints: build => ({
        fetchClients: build.query<Client.List, SearchParams>({
            query: params => ({
                url: '/customer/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Client'],
        }),
        fetchClient: build.query<Client.DTO, string>({
            query: id => `/customer/${id}/`,
            providesTags: () => ['Client'],
        }),
        createClient: build.mutation<unknown, Client.DTO>({
            query: data => ({
                url: '/customer/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Client'],
        }),
        updateClient: build.mutation<unknown, Client.DTO>({
            query: data => ({
                url: `/customer/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Client'],
        }),

        addClientImage: build.mutation<
        { customer: number, id: number, image: number }, 
        { customer: number, image: number }>({
            query: data => ({
                url: '/customer_image/',
                method: 'POST',
                body: data,
            }),
        }),
        deleteClientImage: build.mutation<unknown, { id: number }>({
            query: ({ id }) => ({
                url: `/customer_image/${id}/`,
                method: 'DELETE',
            }),
        }),

        createClientRecord: build.mutation<Client.Record, Client.Record>({
            query: data => ({
                url: '/customer_record/',
                method: 'POST',
                body: data,
            }),
        }),
        updateClientRecord: build.mutation<Client.Record, Client.Record>({
            query: (data) => ({
                url: `/customer_record/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteClientRecord: build.mutation<unknown, number>({
            query: (id) => ({
                url: `/customer_record/${id}/`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    useFetchClientsQuery,
    useFetchClientQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useAddClientImageMutation,
    useDeleteClientImageMutation,
    useCreateClientRecordMutation,
    useUpdateClientRecordMutation,
    useDeleteClientRecordMutation
} = clientAPI
