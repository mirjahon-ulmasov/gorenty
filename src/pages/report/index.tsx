import { Route, Routes } from 'react-router-dom'
import Menu from './menu'
import Orders from './orders'
import Incomes from './incomes'
import Toning from './toning'
import Insurance from './insurance'

export function Report() {
    return (
        <Routes>
            <Route index element={<Menu />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/incomes" element={<Incomes />} />
            <Route path="/toning" element={<Toning />} />
            <Route path="/insurance" element={<Insurance />} />
        </Routes>
    )
}
