import { Route, Routes, Navigate } from 'react-router-dom';
import PaymentTypes from './list';
import AddPaymentType from './add';
import EditPaymentType from './edit';

export default function PaymentType() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<PaymentTypes />} />
			<Route path="/add" element={<AddPaymentType />} />
			<Route path="/:paymentID/edit" element={<EditPaymentType />} />
		</Routes>
    );
}
