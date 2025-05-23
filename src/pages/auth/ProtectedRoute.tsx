import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from 'hooks/redux'
import MainLayout from 'components/layout/Layout'
import { ROLE } from 'types/index'

interface PropTypes {
    roles: ROLE[]
    isRoot?: boolean
}

export function ProtectedRoute({ roles, isRoot = false }: PropTypes) {
    const location = useLocation()
    const { isLoggedIn, user } = useAppSelector(state => state.auth)

    const role = user?.state as ROLE 

    if (!isLoggedIn || !roles.includes(role)) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if(!isRoot) return <Outlet />

    return (
        <MainLayout role={role}>
            <Outlet />
        </MainLayout>
    )
}
