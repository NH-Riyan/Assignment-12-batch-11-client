import axios from 'axios';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAxios from '../../Components/Hooks/useAxios';

import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../../Context/AuthContext';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const axiosInstance = useAxios();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
    const { name, email, password, image } = data;

    createUser(email, password)
      .then(async (result) => {
        const currentUser = result.user;
        console.log("Firebase user created:", currentUser);

        let uploadedImageUrl = "";

        // ✅ Upload image to ImgBB
        if (image && image[0]) {
          const formData = new FormData();
          formData.append("image", image[0]);

          try {
            const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
              import.meta.env.VITE_IMAGE_KEY
            }`;
            const res = await axios.post(imageUploadUrl, formData);
            uploadedImageUrl = res.data.data.url;
            toast.success("Profile image uploaded!");
          } catch (err) {
            console.error("Image upload failed:", err);
            toast.error("Failed to upload image!");
          }
        }

        // ✅ Update Firebase profile
        try {
          await updateUserProfile({
            displayName: name,
            photoURL: uploadedImageUrl || "/default-avatar.png",
          });
          console.log("Firebase profile updated");
        } catch (err) {
          console.error("Error updating Firebase profile:", err);
        }

        // ✅ Save to backend
        const userData = {
          name,
          email,
          photoURL: uploadedImageUrl,
          badge: "bronze",
          postNumber: 0,
          createdAt: new Date().toLocaleString(),
        };

        try {
          const res = await axiosInstance.post("/users", userData);
          console.log("User saved:", res.data);
          toast.success("Registration successful!");
        } catch (err) {
          console.error("Error saving user:", err);
          toast.error("Failed to save user data!");
        }

        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Registration Failed!");
      });
  };



return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-100 p-8 rounded-lg shadow-md w-full max-w-md"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">
                Create Account on <span className="text-green-600 italic">CivicTalk</span>
            </h2>

            <fieldset className="fieldset flex flex-col gap-4">


                <label className="label">Full Name</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("name", { required: true })}
                    placeholder="Your full name"
                />

                {/* Email */}
                <label className="label">Enter Email</label>
                <input
                    type="email"
                    className="input input-bordered w-full"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {errors.email && <p className='text-red-500'>Email is required</p>}

                {/* Password */}
                <label className="label">Enter Password</label>
                <input
                    type="password"
                    className="input input-bordered w-full"
                    {...register("password", { required: true, minLength: 6 })}
                    placeholder="Password"
                />
                {errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>}
                {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be at least 6 characters</p>}

                {/* Profile Image */}
                <label className="label">Upload Profile Image</label>
                <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    {...register("image", { required: false })}
                />

                {/* Register Button */}
                <button className="btn btn-neutral mt-6 w-full">Register</button>

            </fieldset>

            <p className="text-center mt-4">
                Already have an account?
                <Link to="/auth/login" className="text-blue-600 ml-2">Login</Link>
            </p>
        </form>
        <ToastContainer />
    </div>
);
};

export default Register;
