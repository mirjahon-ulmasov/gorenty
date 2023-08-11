import { Currency, PaymentCategory, SearchParams, TPosition } from 'types/api'
import { api } from './baseQuery'

const othersWithTags = api.enhanceEndpoints({
    addTagTypes: ['Currency', 'PaymentCategory'],
})

export const othersAPI = othersWithTags.injectEndpoints({
    endpoints: build => ({
        // ------------- Currency -------------
        fetchCurrencies: build.query<Currency.List, SearchParams>({
            query: params => ({
                url: '/currency/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Currency'],
            transformResponse(response: Currency.List) {
                return response.map(el => ({
                    ...el,
                    original: {
                        title: el.title,
                        ratio: el.ratio,
                    },
                }))
            },
        }),
        createCurrency: build.mutation<unknown, Currency.DTO>({
            query: data => ({
                url: '/currency/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Currency'],
        }),
        updateCurrency: build.mutation<unknown, Currency.DTO>({
            query: data => ({
                url: `/currency/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Currency'],
        }),

        // ------------- Payment Category -------------
        fetchPaymentCategories: build.query<PaymentCategory.List, SearchParams>(
            {
                query: params => ({
                    url: '/payment_category/',
                    method: 'GET',
                    params,
                }),
                providesTags: () => ['PaymentCategory'],
                transformResponse(response: PaymentCategory.List) {
                    return response.map(el => ({
                        ...el,
                        originalTitle: el.title,
                    }))
                },
            }
        ),
        createPaymentCategory: build.mutation<unknown, PaymentCategory.DTO>({
            query: data => ({
                url: '/payment_category/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['PaymentCategory'],
        }),
        updatePaymentCategory: build.mutation<unknown, PaymentCategory.DTO>({
            query: data => ({
                url: `/payment_category/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['PaymentCategory'],
        }),

        // ------------- Staff Position -------------
        fetchStaffPositions: build.query<TPosition[], SearchParams>({
            query: params => ({
                url: '/position/',
                method: 'GET',
                params,
            }),
        }),
    }),
})

export const {
    useFetchCurrenciesQuery,
    useCreateCurrencyMutation,
    useUpdateCurrencyMutation,
    useFetchPaymentCategoriesQuery,
    useCreatePaymentCategoryMutation,
    useUpdatePaymentCategoryMutation,
    useFetchStaffPositionsQuery,
} = othersAPI
