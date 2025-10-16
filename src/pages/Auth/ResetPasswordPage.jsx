import React from 'react';
import { NavLink } from 'react-router-dom';

const ResetPasswordPage = () => {

  return (
    <>
        <div className='mt-30 p-4 w-100 mx-auto shadow-2xl rounded-2xl' style={{ fontFamily: 'sans-serif' }}>
            <div className='mx-4 font-semibold text-md'>Enter email to receive password reset link</div>

            <form class=" py-7 px-4" method='post'>
                <div class="relative z-0 w-full mb-5 group">
                    <input type="email" name="useremail" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange-500 focus:outline-none focus:ring-0 focus:border-orange-600 peer" placeholder=" " required 
                    
                    />

                    <label for="current_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-orange-600 peer-focus:dark:text-orange-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                </div>

                <button type="submit" class="text-white my-4 bg-[#072f6b] hover:bg-blue-900 font-medium rounded-lg text-lg w-full px-5 py-2.5 text-center">Send</button>
            </form>

            
            
        </div>
    </>
  )
}

export default ResetPasswordPage