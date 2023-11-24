/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Dayjs } from 'dayjs'
import { CAR_STATUS, CLIENT_STATUS, ORDER_STATUS, ALL_STATUS, ROLE } from '.'

/* eslint-disable @typescript-eslint/no-namespace */
export type ResultList<T> = Partial<{
    next: null | string
    previous: null | string
    count: number
    page: number
    page_size: number
    results: T[]
}>

export interface BucketFile {
    id: number
    image: {
        id: number
        file: string
    }
}

export interface TBranch {
    id: number
    title: string
}

export interface File {
    id: number
    file: string
}

export interface Pagination {
    page: number
    page_size: number
}

export type TPosition = TBranch

export type SearchParams = Partial<{
    full_name: string
    phone_number: string
    title: string
    branch: string
    balance: number
    position: string

    // ------ CAR ------
    brand: number[]
    plate_number: string
    customer_full_name: string
    vehicle_plate_number: string

    // ------ COMMON ------
    vehicle: string
    customer: string
    investor: string
    
    search: string
    ordering: string
    object_index: string
    status: ALL_STATUS | string
}> & Partial<Pagination>

// type NullableAll<T> = {
//     [K in keyof T]: T[K] | null
// }

// type NullableExcept<T, K extends keyof T> = {
//     [P in keyof T]: P extends K ? T[P] : T[P] | null
// }

export declare namespace Account {
    export interface DTO {
        id: number
        branch: unknown
        state: ROLE
        full_name: string
        phone_number: string
        token: {
            refresh: string
            access: string
        }
    }
    export interface Credentials {
        password: string
        username: string
    }
}

// -------------- Investor --------------
export declare namespace Investor {
    export type List = ResultList<DTO>

    export type DTO = Partial<{
        id: number
        full_name: string
        phone_number: string
        birth_date: string | Dayjs
        address: string
        passport_number: string
        branch: number | TBranch
        investor_images: number[] | BucketFile[]
        object_index: string
        balance: number
        vehicles_count: number
        orders_count: number
        is_active: boolean
        created_at: string
        modified_at: string
    }>
}

// -------------- Branch --------------
export declare namespace Branch {
    export type List = DTO[]

    export type DTO = Partial<{
        id: number
        title: string
        is_main: boolean
        total: number
        phone_number: string
        address: string
        description: string
        is_active: boolean
        created_at: string
        modified_at: string
        attached_person_full_name: string
        attached_person_phone_number: string
        branch_images: number[] | BucketFile[]
    }>
}

// -------------- Client --------------
export declare namespace Client {
    export type List = ResultList<DTO>

    export type DTO = Partial<{
        id: number
        full_name: string
        phone_number: string
        birth_date: string | Dayjs
        address: string
        passport_number: string
        branch: number | TBranch
        customer_images: number[] | BucketFile[]
        object_index: string
        orders_count: number
        balance: number
        is_active: boolean
        created_at: string
        modified_at: string
        license: string
        status: CLIENT_STATUS
        customer_records: Record[]
    }>

    export type Record = Partial<{
        id: number
        customer: number
        full_name: string
        birth_date: string | Dayjs
    }>
}

// -------------- Staff --------------
export declare namespace Staff {
    export type List = ResultList<DTO>

    export type DTO = Partial<{
        id: number
        full_name: string
        phone_number: string
        address: string
        balance: number
        passport_number: string
        additional_information: string
        branch: number | TBranch
        position: number | TPosition
        staff_images: number[] | BucketFile[]
        object_index: string
        is_active: boolean
        created_at: string
        modified_at: string
    }>
}

// -------------- Order --------------
export declare namespace Order {
    export type List = ResultList<DTO>

    export type DTO = Partial<{
        id: number
        object_index: string
        customer: number | Client.DTO
        vehicle: number | Car.DTO
        branch: number | TBranch
        status: ORDER_STATUS
        start_date: string | Dayjs
        end_date: string | Dayjs
        bonus: number
        dogovor: File
        doverennost: File
        is_active: boolean
        created_at: string
        modified_at: string
        creator: number | Account.DTO
        order_images: number[] | BucketFile[]
    }>
}

// -------------- Car --------------
export declare namespace Car {
    export type List = ResultList<DTO>

    export type DTO = Partial<{
        id: number
        object_index: string
        is_active: boolean
        created_at: string
        modified_at: string
        index: number
        plate_number: string
        model: string
        status: CAR_STATUS
        branch: number | TBranch
        brand: number | CarBrand.DTO
        investor: number | CarInvestor
        mileage: number
        go_renty_mileage: number
        limited_mileage_per_day: number
        payment: number
        fine_payment: number
        booking_cost: number
        investor_share: number
        lease_term: string | Dayjs
        insurance: string | Dayjs
        is_toned: boolean
        toning: string | Dayjs
        engine: string
        body: string
        chassis: string
        issue_year: number
        vehicle_key: boolean
        alarm_lucky_remote: boolean
        osago_policy_original: boolean
        radio_tape_recorder: boolean
        cigarette_lighter: boolean
        rubber_mats_set: boolean
        state_numbers: boolean
        baby_chair: boolean
        ski_carrier_set: boolean
        radar_detector_and_dvd: boolean
        balloon_wrench: boolean
        tires: boolean
        wheel_disks: boolean
        warning_triangle: boolean
        first_aid_kit: boolean
        fire_extinguisher: boolean
        user_manual: boolean
        odometer_reading: boolean
        creator: number | Account.DTO
        oil_brand: string
        oil_date: string | Dayjs
        oil_initial_path: number
        oil_update_path: number
        technical_passport: string
        technical_passport_date: string | Dayjs
        vehicle_images: number[] | BucketFile[]
    }>

    export interface CarInvestor {
        id: number
        full_name: string
    }
}

// -------------- Car Brand --------------
export declare namespace CarBrand {
    export type List = DTO[]

    export type DTO = Partial<{
        id: number
        title: string
    }>
}

// -------------- Currency Brand --------------
export declare namespace Currency {
    export type List = DTO[]

    export type DTO = Partial<{
        id: number
        title: string
        ratio: number
        original: {
            title?: string
            ratio?: number
        }
    }>
}

// -------------- Payment Category --------------
export declare namespace PaymentCategory {
    export type List = DTO[]

    export type DTO = Partial<{
        id: number
        title: string
        is_active: boolean
        created_at: string
        modified_at: string
        originalTitle: string
    }>
}
