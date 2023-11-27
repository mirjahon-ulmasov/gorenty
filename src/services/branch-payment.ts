import { BranchPayment, PaymentLog } from 'types/branch-payment'
import { ID } from 'types/index'
import { api } from './baseQuery'

const branchPaymentWithTags = api.enhanceEndpoints({
    addTagTypes: ['BranchPayment'],
})

interface PaymentParams {
    branch?: ID
    payment?: ID
    payment_exclude?: ID
    branch_exclude?: ID
}

interface SearchParams {
    page?: number
    page_size?: number
    created_at?: string
    object_index?: ID
}

interface PaymentLog {
    params: SearchParams
    id: ID
}

export const branchPaymentAPI = branchPaymentWithTags.injectEndpoints({
    endpoints: build => ({
        // -------------- Branch Payment --------------
        fetchBranchPayments: build.query<BranchPayment.List, PaymentParams>({
            query: params => ({
                url: '/branch_payment/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['BranchPayment', 'BranchPaymentLog'],
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
        fetchCustomerPaymentLogs: build.query<PaymentLog.List, PaymentLog>({
            query: ({ params, id }) => ({
                url: `/branch_payment_log/customer/${id}`,
                method: 'GET',
                params
            }),
            providesTags: () => ['BranchPaymentLog'],
        }),
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
        fetchInvestorPaymentLogs: build.query<PaymentLog.List, PaymentLog>({
            query: ({ params, id }) => ({
                url: `/branch_payment_log/investor/${id}`,
                method: 'GET',
                params
            }),
            providesTags: () => ['BranchPaymentLog'],
        }),
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
        fetchStaffPaymentLogs: build.query<PaymentLog.List, PaymentLog>({
            query: ({ params, id }) => ({
                url: `/branch_payment_log/staff/${id}`,
                method: 'GET',
                params
            }),
            providesTags: () => ['BranchPaymentLog'],
        }),
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
        fetchBranchPaymentLogs: build.query<PaymentLog.List, PaymentLog>({
            query: ({ params, id }) => ({
                url: `/branch_payment_log/branch/${id}`,
                method: 'GET',
                params
            }),
            providesTags: () => ['BranchPaymentLog'],
        }),
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

        // -------------- Vehicle --------------
        fetchCarPaymentLogs: build.query<PaymentLog.List, PaymentLog>({
            query: ({ params, id }) => ({
                url: `/branch_payment_log/vehicle/${id}`,
                method: 'GET',
                params
            }),
            providesTags: () => ['BranchPaymentLog'],
        }),
        carIncome: build.mutation<unknown, PaymentLog.Vehicle>({
            query: data => ({
                url: '/branch_payment_log/vehicle_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        investorCarDebtIncome: build.mutation<unknown, PaymentLog.VehicleDebt>({
            query: data => ({
                url: '/branch_payment_log/investor_vehicle_debt_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        branchCarDebtOutcome: build.mutation<unknown, PaymentLog.VehicleDebt>({
            query: data => ({
                url: '/branch_payment_log/branch_vehicle_investor_debt_outcome/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),

        // -------------- Order --------------
        fetchOrderPaymentLogs: build.query<PaymentLog.List, PaymentLog>({
            query: ({ params, id }) => ({
                url: `/branch_payment_log/order/${id}`,
                method: 'GET',
                params
            }),
            providesTags: () => ['BranchPaymentLog'],
        }),
        orderIncome: build.mutation<unknown, PaymentLog.Order>({
            query: data => ({
                url: '/branch_payment_log/order_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        customerOrderDebtIncome: build.mutation<unknown, PaymentLog.OrderDebt>({
            query: data => ({
                url: '/branch_payment_log/customer_order_debt_income/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),
        branchOrderCustomerDebtOutcome: build.mutation<unknown, PaymentLog.OrderDebt>({
            query: data => ({
                url: '/branch_payment_log/branch_order_customer_debt_outcome/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BranchPaymentLog'],
        }),

    }),
})

export const {
    useFetchBranchPaymentQuery,
    useFetchBranchPaymentsQuery,
    useCreateBranchPaymentMutation,

    useFetchCustomerPaymentLogsQuery,
    useCustomerIncomeMutation,
    useCustomerOutcomeMutation,

    useFetchInvestorPaymentLogsQuery,
    useInvestorIncomeMutation,
    useInvestorOutcomeMutation,

    useFetchStaffPaymentLogsQuery,
    useStaffIncomeMutation,
    useStaffOutcomeMutation,

    useFetchBranchPaymentLogsQuery,
    useBranchIncomeMutation,
    useBranchOutcomeMutation,

    useFetchCarPaymentLogsQuery,
    useCarIncomeMutation,
    useInvestorCarDebtIncomeMutation,
    useBranchCarDebtOutcomeMutation,

    useFetchOrderPaymentLogsQuery,
    useOrderIncomeMutation,
    useCustomerOrderDebtIncomeMutation,
    useBranchOrderCustomerDebtOutcomeMutation
} = branchPaymentAPI
