import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const {
        data: role = 'user',
        isLoading: roleLoading,
        refetch,
        isError,
        error,
    } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !authLoading && !!user?.email, // ✅ only fetch when email is ready
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data.role;
        },
    });

    if (isError) {
        console.error("❌ Failed to fetch role:", error?.message);
    }

    console.log("✅ User role:", role);

    return {
        role,
        roleLoading: authLoading || roleLoading,
        refetch
    };
};

export default useUserRole;
