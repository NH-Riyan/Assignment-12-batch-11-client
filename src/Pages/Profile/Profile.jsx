import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Components/Hooks/useAxiosSecure";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();



    const { data: profile } = useQuery({
        queryKey: ["userProfile", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${user.email}`);
            return res.data;
        },

    });


    const { data: posts = [] } = useQuery({
        queryKey: ["userPosts", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/posts/limit/${user.email}`);
            return res.data;
        },

    });

  

    return (
        <section className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>


            {profile ? (
                <div className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-3xl mx-auto transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">

                  
                    <div className="flex-shrink-0">
                        <img
                            src={profile.photoURL || "/default-avatar.png"}
                            alt={profile.name || "User"}
                            className="w-32 h-32 rounded-full border-4 border-green-500 object-cover shadow-md transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                
                    <div className="flex-1 text-center sm:text-left space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
                            <p className="text-gray-600 mt-1">{profile.email}</p>
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                            <span className="px-5 py-2 bg-yellow-200 text-yellow-900 rounded-full text-sm font-semibold tracking-wide shadow-md hover:bg-yellow-300 transition">
                                🏅 {profile.badge || "bronze"}
                            </span>
                            <span className="px-5 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold tracking-wide shadow-md hover:bg-red-200 transition">
                                ⚠️ Warnings: {profile.warning || 0}
                            </span>
                        </div>

                        <p className="text-red-700 font-semibold bg-red-50 p-4 rounded-xl border border-red-300 shadow-inner text-center text-sm sm:text-base animate-pulse">
                            ⚠️ If you get 5 warnings, you will be banned forever
                        </p>
                    </div>

                </div>

            ) : (
                <p className="text-center mt-10 text-gray-500 font-medium">Loading profile...</p>
            )}

       
            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">My Recent Posts</h3>
                {posts ? (
                    posts.length === 0 ? (
                        <p className="text-gray-500">You haven’t posted anything yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {posts.map((post) => (
                                <li
                                    key={post._id}
                                    className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
                                >
                                    <h4 className="text-lg font-bold">{post.title}</h4>
                                    <p className="text-gray-700">{post.description?.substring(0, 100)}...</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Tag: {post.tag} | {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )
                ) : (
                    <p className="text-gray-500">Loading posts...</p>
                )}
            </div>
        </section>
    );

};

export default Profile;
