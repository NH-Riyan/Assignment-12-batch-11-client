import React, { Children, useContext } from 'react';

import { Navigate } from 'react-router';
import useUserRole from '../Hooks/useUserRole';
import { AuthContext } from '../../Context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }
    return children;
};

export default AdminRoute;