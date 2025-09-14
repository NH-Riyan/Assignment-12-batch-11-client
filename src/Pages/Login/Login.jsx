import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => console.log(data);

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

                    <div className="text-right">
                        <a className="link link-hover">Forgot password?</a>
                    </div>

                    <button className="btn btn-neutral mt-6 w-full">Login</button>

                    <button className="btn bg-white text-black border-[#e5e5e5]">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </button>
                </fieldset>

                {/* Register button */}
                <p className="text-center mt-4">
                    Don't have an account?
                    <Link to="/register" className="text-red-600 ml-2">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
