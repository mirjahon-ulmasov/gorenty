import { Route, Routes } from 'react-router-dom'
import Oil from './oil'
import Menu from './menu'
import Users from './users'
import Toning from './toning'
import Orders from './orders'
import GPSReport from './gps'
import Incomes from './incomes'
import Outgoings from './outgoings'
import Insurance from './insurance'

export function Report() {
    return (
        <Routes>
            <Route index element={<Menu />} />
            <Route path="/oil" element={<Oil />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/toning" element={<Toning />} />
            <Route path="/gps" element={<GPSReport />} />
            <Route path="/incomes" element={<Incomes />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/outgoings" element={<Outgoings />} />
        </Routes>
    )
}
