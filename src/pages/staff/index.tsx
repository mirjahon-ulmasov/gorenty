import { Route, Routes, Navigate } from 'react-router-dom';
import AddStaff from './add';
import EditStaff from './edit';
import StaffList from './list';
import StaffDetail from './detail';

export function Staff() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<StaffList />} />
			<Route path="/add" element={<AddStaff />} />
			<Route path="/:staffID/edit" element={<EditStaff />} />
			<Route path="/:staffID/detail" element={<StaffDetail />} />
		</Routes>
    );
}
