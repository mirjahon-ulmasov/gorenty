import dayjs, { Dayjs } from 'dayjs'
import { CAR_STATUS, CLIENT_STATUS, ORDER_STATUS, ALL_STATUS, PAYMENT_METHOD } from 'types/index'

export type format = 'client' | 'car' | 'order'

export function getStatus(value: ALL_STATUS, type: format) {
    switch (type) {
        case 'client':
            switch (value) {
                case CLIENT_STATUS.NEW:
                    return 'Yangi'
                case CLIENT_STATUS.VIP:
                    return 'VIP'
                case CLIENT_STATUS.BLOCK:
                    return 'Blok'
                default:
                    return 'Unknown'
            }

        case 'car':
            switch (value) {
                case CAR_STATUS.BUSY:
                    return 'Band'
                case CAR_STATUS.FREE:
                    return 'Bo’sh'
                case CAR_STATUS.BLOCK:
                    return 'Blok'
                default:
                    return 'Unknown'
            }

        case 'order':
            switch (value) {
                case ORDER_STATUS.BOOKED:
                    return 'Bron'
                case ORDER_STATUS.CREATED:
                    return 'Aktiv'
                case ORDER_STATUS.FINISHED:
                    return 'Tugatildi'
                case ORDER_STATUS.CANCELLED:
                    return 'Bekor qilindi'
                default:
                    return 'Unknown'
            }

        default:
            return 'Unknown'
    }
}

export function formatPhone(data: string) {
    return data
        .replace(/\D/g, '')
        .replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, '+$1 $2 $3-$4-$5')
}

export function formatPlate(data: string) {
    const isCommon = /[a-zA-Z]/.test(data[2]);

    if (isCommon) return data.replace(/(\d+)([A-Z]+)/g, '$1 $2 ');
    return data.replace(/(\d+)(\d{3})([A-Z]+)/, '$1 $2 $3');
}


export const formatDate = 'YYYY-MM-DD'


export const disabledDate = (current: Dayjs): boolean => {
    // Disable dates before today
    if (!current) return false;
    return current.isBefore(dayjs().subtract(1, 'day'))
};

export function getPaymentMethods() {
    return [
        { value: PAYMENT_METHOD.CASH, label: 'Naqd' },
        { value: PAYMENT_METHOD.CARD, label: 'Plastik Karta' },
        { value: PAYMENT_METHOD.BANK, label: 'Bank hisob raqami' },
    ]
}

export function formatCardNumber(data: string) {
    return data.match(/.{1,4}/g)?.join(" ")
}
