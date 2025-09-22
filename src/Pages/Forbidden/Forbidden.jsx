import React from "react";
import { useNavigate } from "react-router";
import { MdBlock } from "react-icons/md";

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-300 text-black p-6">
            <MdBlock className="text-red-600 text-[8rem] mb-4 animate-pulse" />
            <h1 className="text-6xl font-extrabold mb-2">403</h1>
            <h2 className="text-3xl font-bold mb-4">Access Forbidden</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
                You do not have permission to access this page. Please contact the administrator if you believe this is an error.
            </p>
            <button
                onClick={() => navigate("/")}
                className="bg-red-600 hover:bg-red-700 transition-colors px-6 py-3 rounded-md font-semibold shadow-md flex items-center gap-2"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default Forbidden;
