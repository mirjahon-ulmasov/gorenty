import { Route, Routes, Navigate } from 'react-router-dom';
import Investors from './list';
import AddInvestor from './add';
import EditInvestor from './edit';
import InvestorDetail from './detail';
import InvestorStatistics from './statistics';
import { ProtectedRoute } from '..';
import { ROLE } from 'types/index';

export function Investor() {
    return (
		<Routes>
			<Route index element={<Navigate to="list" />} />
			<Route path='/list' element={<Investors />} />
			<Route path="/:investorID/detail" element={<InvestorDetail />} />
            <Route path="/" element={<ProtectedRoute roles={[ROLE.ADMIN]} />}>
				<Route path="/add" element={<AddInvestor />} />
				<Route path="/:investorID/edit" element={<EditInvestor />} />
				<Route path="/:investorID/statistics" element={<InvestorStatistics />} />
			</Route>
		</Routes>
    );
}
