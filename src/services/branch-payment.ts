import { BranchPayment, PaymentLog } from 'types/branch-payment'
import { ID, PAYMENT_METHOD } from 'types/index'
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

interface SearchParamsPaymentLogs {
    object_index?: ID
    created_at?: string
    branch?: ID
    creator?: ID
    payment?: ID
    branch_payment?: ID
    customer?: ID
    investor?: ID
    order?: ID
    staff?: ID
    vehicle?: ID
    debt?: ID
    payment_category?: ID
    payment_type?: PAYMENT_METHOD
    state?: ID
}

export const branchPaymentAPI = branchPaymentWithTags.injectEndpoints({
    endpoints: build => ({
        fetchBranchPayments: build.query<BranchPayment.List, SearchParams>({
            query: params => ({
                url: '/branch_payment/',
                method: 'GET',
                params
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

        // -------------- Payment Logs --------------
        fetchPaymentLogs: build.query<PaymentLog.List, SearchParamsPaymentLogs>({
            query: params => ({
                url: '/branch_payment_log/',
                method: 'GET',
                params
            }),
            providesTags: () => ['BranchPayment'],
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

        // -------------- Investor --------------
        investorIncome: build.mutation<unknown, PaymentLog.Investor>({
            query: data => ({
                url: '/branch_payment_log/investor_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        investorOutcome: build.mutation<unknown, PaymentLog.Investor>({
            query: data => ({
                url: '/branch_payment_log/investor_outcome/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),

        // -------------- Staff --------------
        staffIncome: build.mutation<unknown, PaymentLog.Staff>({
            query: data => ({
                url: '/branch_payment_log/staff_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        staffOutcome: build.mutation<unknown, PaymentLog.Staff>({
            query: data => ({
                url: '/branch_payment_log/staff_outcome/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),

        // -------------- Branch --------------
        branchIncome: build.mutation<unknown, PaymentLog.Branch>({
            query: data => ({
                url: '/branch_payment_log/branch_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        branchOutcome: build.mutation<unknown, PaymentLog.Branch>({
            query: data => ({
                url: '/branch_payment_log/branch_outcome/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),

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

    useFetchPaymentLogsQuery,

    useCustomerIncomeMutation,
    useCustomerOutcomeMutation,

    useInvestorIncomeMutation,
    useInvestorOutcomeMutation,

    useStaffIncomeMutation,
    useStaffOutcomeMutation,

    useBranchIncomeMutation,
    useBranchOutcomeMutation
} = branchPaymentAPI
