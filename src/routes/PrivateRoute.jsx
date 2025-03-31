import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }

    // If children is provided, render it, otherwise render Outlet for nested routes
    return children || <Outlet />;
};

export default PrivateRoute; 