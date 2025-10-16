import React from 'react';

// Outlet will help to make sure that whatever is put inside the layout route
import { Outlet } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const AuthLayout = () => {
  return (
    <div className='bg-gray-100'>

        <Outlet />
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover 
        />

    </div>
  )
}

export default AuthLayout