import { Route, Routes, Navigate } from 'react-router-dom';
import Clients from './list';
import AddClient from './add';
import EditClient from './edit';
import ClientDetail from './detail';

export function Client() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<Clients />} />
			<Route path="/add" element={<AddClient />} />
			<Route path="/:clientID/edit" element={<EditClient />} />
			<Route path="/:clientID/detail" element={<ClientDetail />} />
		</Routes>
    );
}
