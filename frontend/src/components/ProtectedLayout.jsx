// src/components/ProtectedLayout.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from './Navbar';

const ProtectedLayout = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAuthenticated = userInfo && userInfo.token;
    const location = useLocation(); 
    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;