import { Route, Routes, Navigate } from 'react-router-dom';
import Orders from './list';
import AddOrder from './add';
import EditOrder from './edit';
import OrderLogs from './logs';
import OrderDetail from './detail';

export function Order() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<Orders />} />
			<Route path="/add" element={<AddOrder />} />
			<Route path="/:orderID/edit" element={<EditOrder />} />
			<Route path="/:orderID/logs" element={<OrderLogs />} />
			<Route path="/:orderID/detail" element={<OrderDetail />} />
		</Routes>
    );
}
