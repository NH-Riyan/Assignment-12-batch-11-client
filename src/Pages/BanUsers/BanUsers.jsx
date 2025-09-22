import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Components/Hooks/useAxiosSecure";


const BanUsers = () => {
    const queryClient = useQueryClient();
    const axiosInstance = useAxiosSecure();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosInstance.get("/users/banwarnings");
            return res.data;
        },
        staleTime: 0,
    });

    const banUserMutation = useMutation({
        mutationFn: async (id) => {
            await axiosInstance.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });

    if (isLoading) return <p>Loading users...</p>;

    if (users.length === 0)
        return <p className="text-gray-600 text-center mt-10">No users with 5 or more warnings ✅</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">🚫 Users with 5+ Warnings</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="bg-white border border-gray-200 shadow-md rounded-xl p-4 flex flex-col items-center text-center"
                    >
                        <img
                            src={user.photoURL || "/default-avatar.png"}
                            alt={user.name}
                            className="w-20 h-20 rounded-full border-2 border-green-500 mb-4 object-cover"
                        />
                        <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <p className="mt-2 text-sm text-red-600 font-medium">
                            ⚠️ Warnings: {user.warning}
                        </p>
                        <button
                            onClick={() => banUserMutation.mutate(user._id)}
                            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                            disabled={banUserMutation.isLoading}
                        >
                            {banUserMutation.isLoading ? "Banning..." : "Ban User"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BanUsers;
