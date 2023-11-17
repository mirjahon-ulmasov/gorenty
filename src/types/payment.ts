
// -------------- Payment --------------
import { ID, PAYMENT_METHOD } from "."

export declare namespace Payment {
    export type List = DTO[]

    interface DTO {
        id: ID
        total: number
        title: string
        state: PAYMENT_METHOD
        account: string
        card_number: string
        card_date: string
        card_name: string
        is_active?: boolean
        created_at?: string
        modified_at?: string
    }

    interface DTOUpload extends Omit<DTO, 'id' | 'total'> {
        id?: ID
    }
}