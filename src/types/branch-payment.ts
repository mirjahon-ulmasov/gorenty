import { ID } from '.'
import { UploadFile } from 'antd'
import { Payment } from './payment'

export declare namespace BranchPayment {
    export type List = DTO[]

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
    interface DTO {
        total: number
        branch: ID
        creator: ID
        payment: ID
        payment_category: ID
        description: string
        branch_payment_log_images: UploadFile[]
    }

    interface DTOUpload extends Omit<DTO, 'branch_payment_log_images'> {
        branch_payment_log_images: ID[]
    }

    interface Customer extends DTOUpload {
        customer: ID
    }
    interface Investor extends DTOUpload {
        investor: ID
    }
}
