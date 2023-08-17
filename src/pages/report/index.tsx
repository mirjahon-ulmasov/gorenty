import { Route, Routes } from 'react-router-dom'
import Menu from './menu'
import Orders from './orders'
import Incomes from './incomes'
import Toning from './toning'

export function Report() {
    return (
        <Routes>
            <Route index element={<Menu />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/incomes" element={<Incomes />} />
            <Route path="/toning" element={<Toning />} />
        </Routes>
    )
}
