import { Order, SearchParams } from 'types/api'
import { api } from './baseQuery'

const orderWithTags = api.enhanceEndpoints({
    addTagTypes: ['Order'],
})

export const orderAPI = orderWithTags.injectEndpoints({
    endpoints: build => ({
        fetchOrders: build.query<Order.List, SearchParams>({
            query: params => ({
                url: '/order/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Order'],
        }),
        fetchOrder: build.query<Order.DTO, string>({
            query: id => `/order/${id}/`,
            providesTags: () => ['Order'],
        }),
        createOrder: build.mutation<unknown, Order.DTO>({
            query: data => ({
                url: '/order/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrder: build.mutation<unknown, Order.DTO>({
            query: data => ({
                url: `/order/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Order'],
        }),
        addOrderImage: build.mutation<
        { order: number, id: number, image: number }, 
        { order: number, image: number }>({
            query: data => ({
                url: '/order_image/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Order'],
        }),
        deleteOrderImage: build.mutation<unknown, { id: number }>({
            query: ({ id }) => ({
                url: `/order_image/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order'],
        }),

        activateOrder: build.mutation<unknown, { id: number, mileage: number }>({
            query: ({ id, mileage }) => ({
                url: `/order/${id}/activate/`,
                method: 'PUT',
                body: { mileage },
            }),
            invalidatesTags: ['Order'],
        }),
        cancelOrder: build.mutation<unknown, number>({
            query: id => ({
                url: `/order/${id}/cancel/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        finishOrder: build.mutation<unknown, { id: number, mileage: number }>({
            query: ({ id, mileage }) => ({
                url: `/order/${id}/finish/`,
                method: 'PUT',
                body: { mileage },
            }),
            invalidatesTags: ['Order'],
        }),
    }),
})

export const {
    useFetchOrdersQuery,
    useFetchOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useAddOrderImageMutation,
    useDeleteOrderImageMutation,
    useActivateOrderMutation,
    useCancelOrderMutation,
    useFinishOrderMutation
} = orderAPI
