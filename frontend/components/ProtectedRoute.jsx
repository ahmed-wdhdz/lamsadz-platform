import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard based on their actual role, or home
        if (user?.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
        if (user?.role === 'WORKSHOP') return <Navigate to="/dashboard/workshop" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
