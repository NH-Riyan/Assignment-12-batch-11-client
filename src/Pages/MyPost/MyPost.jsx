import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import useAxios from "../../Components/Hooks/useAxios";

const MyPost = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();


    const { data: posts = [], isLoading } = useQuery({
        queryKey: ["myPosts", user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/posts/user/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const deleteMutation = useMutation({
        mutationFn: async (postId) => {
            await axiosInstance.delete(`/posts/${postId}`);
        },
        onSuccess: () => {
            toast.success("Post deleted successfully!");
            queryClient.invalidateQueries(["myPosts", user?.email]);
        },
        onError: () => {
            toast.error("Failed to delete post!");
        },
    });


    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-4">My Posts</h2>

            {
            posts?.length === 0 ? 
            (
                <p>You haven't posted anything yet.</p>
            ) 
            : 
            (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Title</th>
                            <th className="border border-gray-300 px-4 py-2">Votes</th>
                            <th className="border border-gray-300 px-4 py-2">Comments</th>
                            <th className="border border-gray-300 px-4 py-2">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td className="border border-gray-300 px-4 py-2">{post.title}</td>

                                <td className="border border-gray-300 px-4 py-2">
                                    {post.upVote - post.downVote}
                                </td>

                                <td className="border border-gray-300 px-4 text-center py-2">
                                    <button
                                        onClick={() => navigate(`post/comments/${post._id}`)}
                                        className="btn btn-sm bg-green-600"
                                    >
                                        Comments
                                    </button>
                                </td>

                                <td className="border border-gray-300 px-4 text-center py-2">
                                    <button
                                        onClick={() => deleteMutation.mutate(post._id)}
                                        className="btn btn-sm bg-red-600 "
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyPost;
