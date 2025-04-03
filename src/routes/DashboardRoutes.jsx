import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import Payments from '../pages/Payments';
import Reviews from '../pages/Reviews';
import PrivateRoute from './PrivateRoute';

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="payments" element={<Payments />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="likes" element={<Reviews />} />
            </Route>
        </Routes>
    );
};

export default DashboardRoutes; 