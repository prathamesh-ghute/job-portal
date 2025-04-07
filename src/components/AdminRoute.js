import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (!token || !user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute; 