import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaCrown,FaUserShield } from 'react-icons/fa';
import Payment from '../../Components/Payment/Payment';
import { AuthContext } from '../../Context/AuthContext';
import useAxiosSecure from '../../Components/Hooks/useAxiosSecure';

const Membership = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: userData, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`user/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 text-xl">Loading...</p>
            </div>
        );
    }

    if (userData.role === 'admin')
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-lg">
                    <FaUserShield className="mx-auto text-7xl text-blue-600 mb-6" />
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                        🛡️ Admin Access
                    </h1>
                    <p className="text-lg text-gray-700">
                        You are an administrator. You have full control over the system.
                    </p>
                </div>
            </div>
        );


    if (userData.badge === 'gold') {
        return (
            <div className="flex items-center justify-center h-screen bg-yellow-100">
                <div className="text-center">
                    <FaCrown className="mx-auto text-7xl text-yellow-500 mb-6 animate-bounce" />
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🏅 Gold Membership Active!
                    </h1>
                    <p className="text-lg text-gray-700">
                        You already have a premium membership.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen justify-center bg-gray-100 p-6">
            <Payment />
        </div>
    );
};

export default Membership;
