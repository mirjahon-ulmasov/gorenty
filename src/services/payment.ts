import { Payment } from 'types/payment'
import { api } from './baseQuery'
import { ID } from 'types/index'

const paymentWithTags = api.enhanceEndpoints({
    addTagTypes: ['Payment'],
})

export const paymentAPI = paymentWithTags.injectEndpoints({
    endpoints: build => ({
        // ------------- Payment -------------
        fetchPayments: build.query<Payment.List, void>({
            query: () => ({
                url: '/payment/',
                method: 'GET',
            }),
            providesTags: () => ['Payment'],
        }),
        fetchPayment: build.query<Payment.DTO, ID>({
            query: id => ({
                url: `/payment/${id}`,
                method: 'GET',
            }),
            providesTags: () => ['Payment'],
        }),
        createPayment: build.mutation<unknown, Payment.DTOUpload>({
            query: data => ({
                url: '/payment/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Payment'],
        }),
        updatePayment: build.mutation<unknown, Payment.DTOUpload>({
            query: data => ({
                url: `/payment/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Payment'],
        }),
    }),
})

export const {
    useFetchPaymentsQuery,
    useFetchPaymentQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
} = paymentAPI
