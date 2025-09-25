import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';

import { AuthContext } from '../../Context/AuthContext';


const PrivateRoutes = ({ children }) => {
    const { user, loading } = useContext(AuthContext)
    const location = useLocation()

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );

    }
    if (user)
        return children;

    return <Navigate state={location.pathname} to="/auth/login"></Navigate>
};

export default PrivateRoutes;