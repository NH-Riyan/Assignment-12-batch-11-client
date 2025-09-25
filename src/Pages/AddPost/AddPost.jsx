import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
//import { useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Components/Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const AddPost = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = useContext(AuthContext);
    const axiosInstance = useAxiosSecure();
    const navigate = useNavigate();

    const [selectedTag, setSelectedTag] = useState(null);


    const { data: userData, isLoading } = useQuery({
        queryKey: ["userData", user?.email],
        queryFn: async () => {
            if (!user?.email) return null;
            const res = await axiosInstance.get(`/user/${user.email}`);
            return res.data; // Return the whole user object
        },
        enabled: !!user?.email,
    });

    if (isLoading) {
        return <p>Loading user...</p>;
    }


    const postCount = userData. postNumber || 0;


    const onSubmit = async (data) => {
        const newPost = {
            authorImage: user?.photoURL,
            authorName: user?.displayName || "Anonymous",
            authorEmail: user?.email,
            title: data.title,
            description: data.description,
            tag: selectedTag?.value || "general",
            upVote: 0,
            downVote: 0,
            Comment: [],
            like: [],
            dislike: [],
            createdAt: new Date().toISOString(),
        };



        try {
            await axiosInstance.post("/posts", newPost);

            Swal.fire({
                icon: "success",
                title: "Post added successfully!",
                showConfirmButton: true,
                confirmButtonText: "OK"
            });

            reset();
        } catch (err) {
            console.error("Error adding post:", err);

            Swal.fire({
                icon: "error",
                title: "Failed to add post!",
                text: err.response?.data?.message || "Something went wrong.",
                showConfirmButton: true,
                confirmButtonText: "OK"
            });
        }

    };


    const tagOptions = [
        { value: "technology", label: "Technology" },
        { value: "politics", label: "Politics" },
        { value: "education", label: "Education" },
        { value: "sports", label: "Sports" },
        { value: "general", label: "General" },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="flex justify-center rounded-lg py-7 items-center min-h-screen bg-green-50">
            {postCount >= 5 && userData.badge === "bronze" ? (

                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-4">
                        You have reached the limit of 5 posts.
                    </h2>
                    <button
                        onClick={() => navigate("/membership")}
                        className="btn btn-primary"
                    >
                        Become a Member
                    </button>
                </div>
            ) : (

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-base-100 p-8 rounded-lg shadow-md w-full max-w-lg"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Add a New Post
                    </h2>

                    <fieldset className="fieldset flex flex-col gap-4">
                        <label className="label">Author Image</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={user?.photoURL || "/default-avatar.png"}
                            disabled
                        />

                        <label className="label">Author Name</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={user?.displayName || "Anonymous"}
                            disabled
                        />

                        <label className="label">Author Email</label>
                        <input
                            type="email"
                            className="input input-bordered w-full"
                            value={user?.email}
                            disabled
                        />

                        <label className="label">Post Title</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("title", { required: true })}
                            placeholder="Enter post title"
                        />

                        <label className="label">Post Description</label>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            {...register("description", { required: true })}
                            placeholder="Write your post here..."
                        />

                        <label className="label">Tag</label>
                        <Select
                            options={tagOptions}
                            value={selectedTag}
                            onChange={setSelectedTag}
                            placeholder="Select a tag"
                            className="w-full"
                        />

                        <button type="submit" className="btn btn-neutral mt-6 w-full">
                            Submit Post
                        </button>
                    </fieldset>
                </form>
            )}
        </div>
    );
};

export default AddPost;
