import { ID, PAYMENT_CATEGORY, PAYMENT_LOG_STATE, PAYMENT_TYPE } from '.'
import { UploadFile } from 'antd'
import { Payment } from './payment'
import { Account, BucketFile, ResultList } from './api'

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
        id: ID
        object_index: string
        branch: {
            id: ID
            title: string
        }
        payment: {
            id: ID
            title: string
        }
        order: ID
        customer: ID
        description: string
        creator: Account.DTO
        branch_payment_logs: DTO[]
        branch_payment_log_images: BucketFile[]
        created_at: string
        state: PAYMENT_LOG_STATE
        payment_type: PAYMENT_TYPE
        payment_category: PAYMENT_CATEGORY

        paid: number
        remain: number
        total: number

        is_debt: boolean
        is_paid: boolean
        is_paid_immediately: boolean

        is_applies_to_staff: boolean
        is_applies_to_branch: boolean
        is_applies_to_customer: boolean
        is_applies_to_investor: boolean
    }
    interface LogType extends DTO {
        open_payment: boolean
        open_logs: boolean
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

    interface Vehicle extends DTOUpload {
        vehicle: ID
    }
    interface VehicleDebt extends Vehicle {
        debt: ID
    }

    interface Order extends DTOUpload {
        order: ID
    }
    interface OrderDebt extends Order {
        debt: ID
    }
}
