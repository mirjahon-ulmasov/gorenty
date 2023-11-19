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

export enum PAYMENT_METHOD {
    BANK = 1,
    CARD,
    CASH,
}

export type ID = number | string

// TODO
export enum DEBT {
    GORENTY_DEBTS = 1,
    GORENTY_OWES
}

export enum TRANSACTION {
    INCOME = 1,
    OUTCOME
}

export type ALL_STATUS = CLIENT_STATUS | CAR_STATUS | ORDER_STATUS | DEBT | TRANSACTION