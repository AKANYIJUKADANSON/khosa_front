import React, { useRef } from 'react';

// Outlet will help to make sure that whatever is put inside the layout route
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {

  const appRef = useRef(null); // Ref for the main app element

  /**
   * Check if the user is authenticated by checking the localStorage if the auth_status is true
   * If the user is not authenticated, then redirect to the login page
   * If the user is authenticated, then render the main layout with the sidebar, navbar and other components
   */
  // const auth_status = localStorage.getItem('auth_status');
  const auth_status = '1';

  return (auth_status !== '1') ? window.location.href = '/login' : 
    <>
      <div className="flex h-full bg-gray-100" ref={appRef}>
        <Sidebar />
        
        <Navbar appRef = { appRef } />
        <div style={{ fontFamily: 'sans-serif' }} className='grow ml:16 mt-20 h-full bg-gray-100 text-gray-900  '>
          <div style={{ fontFamily: 'sans-serif' }} className=' grow ml:16 md:ml-64 h-full bg-gray-00 text-gray-900 dark:bg-gray-900 dark:text-gray-100 '>
            {/* margin-left is 16 because the sidebar width is 16 and on md it will be 64 because the sidebar width is also 64
            h-full = 100% and for large screens it shoud take the screen size*/}

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
        </div>
      </div>
    </>
}

export default MainLayout
