// import viteLogo from '/vite.svg'; // public folder

import { Navigate, Route, Routes } from 'react-router-dom';
import {
    Client, Investor, Car, Order, ProtectedRoute, 
    NotFound, PaymentCategoryPage, Login, 
    CurrencyPage, Staff, Branch
} from 'pages';
import { ROLE } from 'types/index';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute roles={[ROLE.ADMIN, ROLE.OPERATOR]} />}>
                <Route index element={<Navigate replace to='/order' />} />
                <Route path="order/*" element={<Order />} />
                <Route path="client/*" element={<Client />} />
                <Route path="car/*" element={<Car />} />
                <Route path="investor/*" element={<Investor />} />
                <Route path="staff/*" element={<Staff />} />
                <Route path="branch/*" element={<Branch />} />
                <Route path="payment-category" element={<PaymentCategoryPage />} />
                <Route path="currency" element={<CurrencyPage />} />
                <Route path="admin" element={<ProtectedRoute roles={[ROLE.ADMIN]} />}>
                    ADMIN
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
