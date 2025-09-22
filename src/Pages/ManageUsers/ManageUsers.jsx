import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Components/Hooks/useAxiosSecure";


const ManageUsers = () => {
    const axiosInstance = useAxiosSecure();
    const queryClient = useQueryClient();


    // Fetch users with search
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosInstance.get("/users");
            return res.data;
        },
    });

    
    const rolechangeMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.patch(`/users/changerole/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });




    if (isLoading) return <p>Loading users...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Subscription</th>
                            <th className="py-2 px-4 text-left">Role</th>
                            <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t">
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">
                                    {user.badge}
                                </td>
                                <td className="py-2 px-4">{user.role}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => rolechangeMutation.mutate(user._id)}
                                        className={`px-3 py-1 rounded text-white ${user.role === "admin" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                            }`}
                                    >
                                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
