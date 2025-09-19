import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useAxios from '../Hooks/useAxios';

const AllPosts = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("recent");
    const limit = 5;

    const { data, isLoading, error } = useQuery({
        queryKey: ["posts", page, sort],
        queryFn: async () => {
            const url = sort === "recent"
                ? `/posts/recent/${page}`
                : `/posts/popular/${page}`;

            const res = await axiosInstance.get(url);
            return res.data;
        },
        keepPreviousData: true,
    });

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    // Safe access with optional chaining and default values
    const posts = data?.posts || [];
    const totalPosts = data?.totalPosts || 0;
    const totalPages = Math.ceil(totalPosts / limit);

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">All Posts</h2>
                <button
                    onClick={() => {
                        setSort(sort === "recent" ? "popular" : "recent");
                        setPage(1); // reset to first page
                    }}
                    className="btn btn-sm btn-primary"
                >
                    Sort by {sort === "recent" ? "Popularity" : "Newest"}
                </button>
            </div>
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-gray-500">No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            onClick={() => navigate(`/posts/${post._id}`)}
                            className="border rounded-lg p-4 shadow-md flex gap-4 cursor-pointer hover:bg-gray-50 transition"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={post.authorImage}
                                        alt={post.authorName}
                                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {post.authorName}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                <p className="text-gray-600">{post.description}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="badge badge-outline">{post.tag}</span>
                                    <span className="text-sm text-gray-500">Comments: {post.Comment?.length || 0}</span>
                                    <span className="text-sm text-gray-500">Votes: {post.upVote - post.downVote}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-outline"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllPosts;
