import { Route, Routes, Navigate } from 'react-router-dom';
import Cars from './list';
import AddCar from './add';
import EditCar from './edit';
import CarDetail from './detail';
import { ProtectedRoute } from '..';
import { ROLE } from 'types/index';

export function Car() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<Cars />} />
			<Route path="/:carID/detail" element={<CarDetail />} />
            <Route path="/" element={<ProtectedRoute roles={[ROLE.ADMIN]} />}>
				<Route path="/add" element={<AddCar />} />
				<Route path="/:carID/edit" element={<EditCar />} />
			</Route>
		</Routes>
    );
}
