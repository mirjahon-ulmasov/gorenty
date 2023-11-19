import { BranchPayment, PaymentLog } from 'types/branch-payment'
import { ID } from 'types/index'
import { api } from './baseQuery'

const branchPaymentWithTags = api.enhanceEndpoints({
    addTagTypes: ['BranchPayment'],
})

interface SearchParams {
    branch?: ID
    payment?: ID
    payment_exclude?: ID
    branch_exclude?: ID
}

export const branchPaymentAPI = branchPaymentWithTags.injectEndpoints({
    endpoints: build => ({
        fetchBranchPayments: build.query<BranchPayment.List, SearchParams>({
            query: () => ({
                url: '/branch_payment/',
                method: 'GET',
            }),
            providesTags: () => ['BranchPayment'],
        }),
        fetchBranchPayment: build.query<BranchPayment.DTO, ID>({
            query: id => `/branch_payment/${id}/`,
            providesTags: () => ['BranchPayment'],
        }),
        createBranchPayment: build.mutation<unknown, BranchPayment.DTOUpload>({
            query: data => ({
                url: '/branch_payment/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPayment'],
        }),

        // -------------- Customer --------------
        customerIncome: build.mutation<unknown, PaymentLog.Customer>({
            query: data => ({
                url: '/branch_payment_log/customer_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        customerOutcome: build.mutation<unknown, PaymentLog.Customer>({
            query: data => ({
                url: '/branch_payment_log/customer_outcome/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        // updateBranch: build.mutation<unknown, Branch.DTO>({
        //     query: data => ({
        //         url: `/branch/${data.id}/`,
        //         method: 'PUT',
        //         body: data,
        //     }),
        //     invalidatesTags: ['Branch'],
        // }),

        // addBranchImage: build.mutation<
        // { branch: number, id: number, image: number }, 
        // { branch: number, image: number }>({
        //     query: data => ({
        //         url: '/branch_image/',
        //         method: 'POST',
        //         body: data,
        //     }),
        // }),
        // deleteBranchImage: build.mutation<unknown, { id: number }>({
        //     query: ({ id }) => ({
        //         url: `/branch_image/${id}/`,
        //         method: 'DELETE',
        //     }),
        // })
    }),
})

export const {
    useFetchBranchPaymentQuery,
    useFetchBranchPaymentsQuery,
    useCreateBranchPaymentMutation,

    useCustomerIncomeMutation,
    useCustomerOutcomeMutation
} = branchPaymentAPI
