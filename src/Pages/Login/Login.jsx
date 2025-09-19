import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import useAxios from '../../Components/Hooks/useAxios';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn, signInWithGoogle, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosInstance = useAxios();

    const onSubmit = async (data) => {
        const { email, password } = data;
        try {
            const result = await signIn(email, password);
            console.log("Logged in user:", result.user);
            toast.success(" Login successful!");
            setTimeout(() => {
                navigate(`${location.state ? location.state : "/"}`)
            }, 1500);
        } catch (error) {
            console.error("Login error:", error.message);
            toast.error(" Login failed.");
        }
    };


    const handleGoogleSignIn = async () => {
        try {
            const res = await signInWithGoogle();

            const image = res.user.photoURL ||
                res.user.reloadUserInfo?.providerUserInfo?.[0]?.photoUrl;

            await updateUserProfile({
                displayName: res.user.displayName,
                photoURL: image,
            });

            const userData = {
                name: res.user.displayName,
                email: res.user.email,
                photoURL: image,
                badge: "bronze",
                role: "user",
                postNumber: 0,
                createdAt: new Date().toLocaleString(),
            };

            await axiosInstance.post("/users", userData);
            toast.success("Login successful!");
            setTimeout(() => {
                navigate(`${location.state ? location.state : "/"}`)
            }, 1500);
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Google Sign-In Failed");
        }
    };



    return (
        <div className="flex justify-center items-center min-h-screen bg-green-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-base-100 p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login to <span className="text-green-600 italic">CivicTalk</span>
                </h2>

                <fieldset className="fieldset flex flex-col gap-4">

                    {/* Email */}
                    <label className="label">Enter Email</label>
                    <input
                        type="email"
                        className="input input-bordered w-full"
                        {...register("email", { required: true })}
                        placeholder="Email"
                    />
                    {errors.email?.type === 'required' && (
                        <p className='text-red-500'>Email is required</p>
                    )}

                    {/* Password */}
                    <label className="label">Enter Password</label>
                    <input
                        type="password"
                        className="input input-bordered w-full"
                        {...register("password", { required: true, minLength: 6 })}
                        placeholder="Password"
                    />
                    {errors.password?.type === 'required' && (
                        <p className='text-red-500'>Password is required</p>
                    )}
                    {errors.password?.type === 'minLength' && (
                        <p className='text-red-500'>Password must be at least 6 characters</p>
                    )}

                    <div className="text-right">
                        <a className="link link-hover">Forgot password?</a>
                    </div>

                    {/* Login Button */}
                    <button className="btn btn-neutral mt-6 w-full">Login</button>

                    {/* Google Login (for later) */}
                    <button type="button" onClick={handleGoogleSignIn} className="btn bg-white text-black border-[#e5e5e5]">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </button>
                </fieldset>

                {/* Register button */}
                <p className="text-center mt-4">
                    Don't have an account?
                    <Link to="/auth/register" className="text-red-600 ml-2">Register</Link>
                </p>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
