import { ROLE, Route } from 'types/index'
import {
    SCarIcon, SChangesLogIcon, SClientIcon,
    SCurrencyIcon, SDebtIcon, SFilialIcon,
    SInOutIcon, SInvestorIcon, SOrderIcon,
    SPaymentCategoryIcon, SReportIcon, 
    SWorkerIcon,
} from 'components/input'

const routes: Route[] = [
    {
        path: '/order',
        title: 'Buyurtmalar',
        icon: SOrderIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/client',
        title: 'Mijozlar',
        icon: SClientIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/car',
        title: 'Avtomobillar',
        icon: SCarIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/investor',
        title: 'Investorlar',
        icon: SInvestorIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/admin/payment-category',
        title: 'To’lov kategoriyalari',
        icon: SPaymentCategoryIcon,
        roles: [ROLE.ADMIN],
    },
    {
        path: '/debt',
        title: 'Qarzlar',
        icon: SDebtIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/in-out',
        title: 'Kirim-chiqim',
        icon: SInOutIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/admin/branch',
        title: 'Filiallar',
        icon: SFilialIcon,
        roles: [ROLE.ADMIN],
    },
    {
        path: '/currency',
        title: 'Valyuta',
        icon: SCurrencyIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/admin/report',
        title: 'Moliyaviy hisobotlar',
        icon: SReportIcon,
        roles: [ROLE.ADMIN],
    },
    {
        path: '/admin/staff',
        title: 'Ishchilar',
        icon: SWorkerIcon,
        roles: [ROLE.ADMIN],
    },
    {
        path: '/changes-log',
        title: 'O’zgarishlar jurnali',
        icon: SChangesLogIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
]

export default routes
