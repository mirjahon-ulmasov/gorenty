import { ID, PAYMENT_CATEGORY, PAYMENT_LOG_STATE, TRANSACTION } from '.'
import { UploadFile } from 'antd'
import { Payment } from './payment'
import { Account, ResultList } from './api'

export declare namespace BranchPayment {
    type List = DTO[]

    interface DTO {
        id: ID
        total: number
        branch: {
            id: ID
            title: string
        }
        payment: Payment.DTO
    }

    interface DTOUpload {
        branch: ID
        payment: ID
    }
}

export declare namespace PaymentLog {
    type List = ResultList<DTO>

    interface DTO {
        branch: {
            id: ID
            title: string
        }
        branch_payment_log_images: any[]
        branch_payment_logs: any[]
        created_at: string
        creator: Account.DTO
        customer: ID
        description: string
        id: ID
        is_active: boolean
        is_debt: boolean
        object_index: string
        payment: {
            id: ID
            title: string
        }
        payment_category: PAYMENT_CATEGORY
        payment_type: TRANSACTION
        state: PAYMENT_LOG_STATE
        total: number
    }
    interface DTOLocal {
        total: number
        branch: ID
        creator: ID
        payment: ID
        payment_category: ID
        description: string
        branch_payment_log_images: UploadFile[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'branch_payment_log_images'> {
        branch_payment_log_images: ID[]
    }

    interface Customer extends DTOUpload {
        customer: ID
    }
    interface Investor extends DTOUpload {
        investor: ID
    }
    interface Staff extends DTOUpload {
        staff: ID
    }
    interface Branch extends DTOUpload {
        branch_payment: ID
    }
}
