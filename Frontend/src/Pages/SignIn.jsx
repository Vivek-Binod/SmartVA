import React, { useContext, useState } from 'react'; // Removed 'use' as it's not a valid hook for direct import
import bg from "../assets/img1.png"; // Assuming correct path
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'; // Correct import for useNavigate
import axios from "axios";
import { userDataContext } from '../context/userContext';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const { serverUrl, setUserData } = useContext(userDataContext); // Removed `userData` from destructuring if not directly used here
    const navigate = useNavigate(); // Correctly initialize useNavigate hook
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(""); // Initialize with empty string, not undefined
    const [password, setPassword] = useState(""); // Initialize with empty string, not undefined
    const [err, setErr] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setErr(""); // Clear previous errors
        setLoading(true); // Set loading state

        try {
            let result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email,
                password
            }, { withCredentials: true });

            setUserData(result.data); // Update user data in context
            setLoading(false); // Reset loading state

            // FIX 1: Use the `Maps` function from `useNavigate`
            // Instead of `Maps("/")`, use `Maps("/")`
            // Consider redirecting to "/customize" if that's the desired flow after first sign-in
            // For now, I'll keep it as "/" but you might want logic here:
            // if (result.data.assistantImage && result.data.assistantName) {
            //   navigate("/home");
            // } else {
            //   navigate("/customize");
            // }
            navigate("/"); // This will likely go to /home or /customize based on your root route's logic

        } catch (error) {
            console.error("Sign-in error:", error); // Log the full error object for debugging

            setUserData(null); // Clear user data on sign-in failure
            setLoading(false); // Reset loading state

            // FIX 2: Safely access error.response.data.message
            // Check if `error.response` exists before trying to read its properties
            if (error.response && error.response.data && error.response.data.message) {
                setErr(error.response.data.message); // Set error message from server
            } else if (error.message) {
                // For network errors or other client-side issues with the request
                setErr("An unexpected error occurred: " + error.message);
            } else {
                setErr("An unknown error occurred during sign-in."); // Fallback for truly unknown errors
            }
        }
    };

    return (
        <div className='w-full h-screen bg-no-repeat bg-center bg-cover flex justify-center items-center'
            style={{ backgroundImage: `url(${bg})` }}>

            <form className='w-[90%] h-[600px] max-w-[500px]
            bg-[black]/40  backdrop-blur shadow-lg shadow-black
            flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignIn}>
                <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Sign In to<span className='text-blue-400'>Virtual Assistant</span></h1>

                <input type="email" placeholder='Email ID' className='w-full h-[60px]
                outline-none border-2 border-white bg-transparent text-white
                placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email} />

                <div className='w-full h-[60px] border-2 border-white bg-transparent
                text-white rounded-full text-[18px] relative'>

                    <input type={showPassword ? "text" : "password"} placeholder='Password'
                        className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required onChange={(e) => setPassword(e.target.value)} value={password} />
                    {!showPassword && <IoEye className='absolute top-[17px] right-[20px]
                    w-[25px] h-[25px] text-[white] cursor-pointer' onClick={() => setShowPassword(true)} />}

                    {showPassword && <IoEyeOff className='absolute top-[17px] right-[20px]
                    w-[25px] h-[25px] text-[white] cursor-pointer' onClick={() => setShowPassword(false)} />}
                </div>
                {err.length > 0 && <p className='text-red-500 text-[17px]'>
                    *{err}
                </p>}

                <button type="submit" className='min-w-[150px] h-[60px] mt-[30px]
                text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer' disabled={loading}>{loading ? "Loading" : "Sign In"}</button>

                <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate("/signup")}>Create a new Account? <span
                    className='text-blue-400 underline'>Sign Up</span></p>
            </form>
        </div>
    );
}

export default SignIn;