import React from 'react'
export interface Route {
    path: string
    title: string
    roles?: ROLE[]
    icon: React.ComponentType<{ color: string }>
}

export enum ROLE {
    ADMIN = 1,
    OPERATOR,
    BRANCH_MAIN,
}

export enum STAFF_STATUS {

}

export enum CLIENT_STATUS {
    NEW = 1,
    VIP,
    BLOCK,
}

export enum CAR_STATUS {
    BUSY = 1,
    FREE,
    BLOCK,
}

export enum ORDER_STATUS {
    BOOKED = 1,
    CREATED,
    FINISHED,
    CANCELLED,
}

export type ALL_STATUS = CLIENT_STATUS | CAR_STATUS | ORDER_STATUS