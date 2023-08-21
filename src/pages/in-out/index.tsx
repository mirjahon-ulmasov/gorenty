import { Route, Routes, Navigate } from 'react-router-dom';
import InOuts from './list';
import AddInOut from './add';
import EditInOut from './edit';
import InOutDetail from './detail';

export function InOut() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<InOuts />} />
			<Route path="/add" element={<AddInOut />} />
			<Route path="/:inOutID/edit" element={<EditInOut />} />
			<Route path="/:inOutID/detail" element={<InOutDetail />} />
		</Routes>
    );
}
