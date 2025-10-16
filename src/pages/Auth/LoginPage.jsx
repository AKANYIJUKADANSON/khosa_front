import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import LogoComponent from '../../components/LogoComponent.jsx'; // Import the LogoComponent
// import { IoAddCircleOutline } from 'react-icons/io5';
import { FaHome } from "react-icons/fa";
import CustomTooltip from '../../components/CustomTooltip';
import { IoEye, IoEyeOffSharp } from 'react-icons/io5';


const LoginPage = () => {
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = new useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Create useStates for each form input field
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');


    // When the submit button is clicked, then handle the submited data that was set in the state
    const submitLoginData = async (event) => {
        event.preventDefault();

        navigate('/dashboard');

        // try {

        //     const response = await fetch(`${apiUrl}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-type': 'application/json'
        //         },

        //         body: JSON.stringify({ useremail, password })
        //     });

        //     // console.log('Login data submitted:', { useremail, password });
        //     const data = await response.json();
        //     console.log('Login response', data);

        //     if (data.status === '200') {
        //         // If the response is successful, then set the user data in localStorage
        //         localStorage.setItem('authenticated_user', JSON.stringify(data));
        //         localStorage.setItem('auth_status', data.auth_status);

        //         navigate('/dashboard');

        //     } else {
        //         toast.error(data.message);
        //         navigate('/login');
        //     }

        // } catch (error) {
        //     // setError('An error occurred. Please try again.');
        //     toast.error(error.message + '. Internal servere error. please try again later.');
        // }

    }

    return (
        <div className='flex justify-center items-center h-screen bg-gray-100'>

            <div className="grid max-[680px]:grid-cols-1 grid-cols-2 bg-white shadow-sm">

                <div className="bg-white max-[680px]:hidden w-full max-w-md mx-auto shadow-md">
                    <img src="/login.png" alt="" />
                </div>
                
                <div className='px-8 py-4   w-full my-auto mx-auto ' style={{ fontFamily: 'sans-serif' }}>

                    <div className=" flex  mx-auto justify-center align-center mb-0 my-4">
                        <LogoComponent logoclass={"h-15 rounded-full "} />
                    </div>

                    <form className="flex flex-col space-between py-2 px-2 mt-10 mb-10" method='post' onSubmit={submitLoginData} >
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="email"
                                name="useremail"
                                id="useremail"
                                className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-[#0f48a3] focus:outline-none focus:ring-0 focus:border-[#00b126] peer"
                                value={useremail}
                                onChange={(e) => setUseremail(e.target.value)}
                                required
                            />

                            <label
                                htmlFor="useremail"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-red-500 peer-focus:dark:text-[#60a5fa] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >Email</label>
                        </div>

                        <div className="relative z-0 mt-4 w-full mb-2 group">
                            <label
                                htmlFor="password"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="block py-2.5 mt-2 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-[#0f48a3] focus:outline-none focus:ring-0 focus:border-[#00b126] peer"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-[#0f48a3] dark:hover:text-[#60a5fa] focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <IoEyeOffSharp className='text-2xl text-green-700' /> : <IoEye className='text-2xl text-green-700' /> }
                                </button>
                            </div>
                        </div>

                        <div className="text-right mb-5 text-[#0f48a3]">
                            {/* <NavLink to="/resetpassword">Forgot password ?</NavLink> */}
                        </div>


                        <input type="submit" className="text-white cursor-pointer bg-green-700 hover:bg-green-800 transition-colors font-medium rounded-lg text-lg w-full px-5 py-2.5 text-center " value="Login" />


                    </form>

                </div>

            </div>
        </div>
    )
}

export default LoginPage