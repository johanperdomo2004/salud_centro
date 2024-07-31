import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const ProtectedRoute = ({ component: Component, allowedRoles, layout: Layout }) => {

    const { user } = useAuth();

    return (
        allowedRoles.includes(user ? user.role_id : null) ? (
            <Layout>
                <Component></Component>
            </Layout>
        ) : (
            <Navigate to='/NOT-CREDENTIALS' />
        )
    )
}

export default ProtectedRoute;