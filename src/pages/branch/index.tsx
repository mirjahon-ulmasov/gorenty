import { Route, Routes, Navigate } from 'react-router-dom';
import Branches from './list';
import AddBranch from './add';
import EditBranch from './edit';
import BranchDetail from './detail';

export function Branch() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<Branches />} />
			<Route path="/add" element={<AddBranch />} />
			<Route path="/:branchID/edit" element={<EditBranch />} />
			<Route path="/:branchID/detail" element={<BranchDetail />} />
		</Routes>
    );
}
