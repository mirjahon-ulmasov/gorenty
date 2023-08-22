import { Navigate, Route, Routes } from 'react-router-dom';
import {
    Client, Investor, Car, Order, ProtectedRoute, 
    NotFound, PaymentCategoryPage, Login, DebtPage,
    CurrencyPage, Staff, Branch, Report, InOut, LogsPage
} from 'pages';
import { ROLE } from 'types/index';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute isRoot={true} roles={[ROLE.ADMIN, ROLE.OPERATOR]} />}>
                <Route index element={<Navigate replace to='/order' />} />
                <Route path="order/*" element={<Order />} />
                <Route path="client/*" element={<Client />} />
                <Route path="car/*" element={<Car />} />
                <Route path="investor/*" element={<Investor />} />
                <Route path="currency" element={<CurrencyPage />} />
                <Route path="log" element={<LogsPage />} />
                <Route path="admin" element={<ProtectedRoute roles={[ROLE.ADMIN]} />}>
                    <Route path="staff/*" element={<Staff />} />
                    <Route path="branch/*" element={<Branch />} />
                    <Route path="report/*" element={<Report />} />
                    <Route path="in-out/*" element={<InOut />} />
                    <Route path="debt" element={<DebtPage />} />
                    <Route path="payment-category" element={<PaymentCategoryPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
