import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import useAxios from "../../Components/Hooks/useAxios";

import { useParams } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaShareAlt, FaComment } from "react-icons/fa";

const PostDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const [showCommentBox, setShowCommentBox] = useState(false); // toggle state
    const { user } = useContext(AuthContext);

    
    const { data: post, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/posts/${id}`);
            return res.data;
        },
    });

    
    const addCommentMutation = useMutation({
        mutationFn: async (newComment) => {
            const res = await axiosInstance.post(`/posts/${id}/comment`, newComment);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            setCommentText("");
        },
    });

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        addCommentMutation.mutate({
            commenter: user.displayName,
            commenterEmail: user.email,
            commentText,
            feedback: "",
            reported: false,
            commentTime: new Date().toISOString(),
        });
    };


    const handleUpVote = async () => {

            const res = await axiosInstance.post(`/posts/${id}/upvote`, {
                userEmail: user.email,
            });
            console.log("Upvote response:", res.data);
            queryClient.invalidateQueries({ queryKey: ["post", id] })
    };

    const handleDownVote = async () => {
        const res = await axiosInstance.post(`/posts/${id}/downvote`, { userEmail: user.email });
        console.log("downvote response:", res.data);
        queryClient.invalidateQueries({ queryKey: ["post", id] });
    };

    if (isLoading) return <p>Loading post...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
        
            <div className="flex items-center gap-4 mb-4">
                <img src={post.authorImage} alt={post.authorName} className="w-12 h-12 rounded-full" />
                <div>
                    <h2 className="text-xl font-bold">{post.authorName}</h2>
                    <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>

            
            <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-4">{post.description}</p>

            
            <div className="flex items-center gap-4 mb-6 text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">Tag: {post.tag}</span>
                <button
                    className={`flex items-center gap-1 ${post.like.includes(user?.email) ? "text-blue-600" : ""}`}
                    onClick={handleUpVote}
                >
                    <FaThumbsUp /> {post.upVote}
                </button>
                <button
                    className={`flex items-center gap-1 ${post.dislike.includes(user?.email) ? "text-red-600" : ""}`}
                    onClick={handleDownVote}
                >
                    <FaThumbsDown /> {post.downVote}
                </button>

                <button className="flex items-center gap-1 hover:text-green-600">
                    <FaShareAlt /> Share
                </button>
                <button
                    className="flex items-center gap-1 hover:text-gray-800"
                    onClick={() => setShowCommentBox(!showCommentBox)}
                >
                    <FaComment /> Comment
                </button>
            </div>

       
            {showCommentBox && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-3">Comments</h4>

                    <div className="space-y-3 mb-4">
                        {post.Comment.map((c, idx) => (
                            <div key={idx} className="border rounded p-3 bg-gray-50">
                                <p>
                                    <strong>{c.commenter}</strong>
                                </p>
                                <p>
                                    {c.commentText}
                                </p>

                                {c.commentTime && (
                                    <p className="text-xs text-gray-400">
                                        {new Date(c.commentTime).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={handleAddComment}
                            className="btn btn-primary px-4"
                            disabled={addCommentMutation.isLoading}
                        >
                            {addCommentMutation.isLoading ? "Adding..." : "Comment"}
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default PostDetails;
