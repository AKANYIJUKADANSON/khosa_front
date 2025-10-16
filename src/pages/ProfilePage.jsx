import React, { useEffect, useState } from 'react';
import { PiPersonBold } from 'react-icons/pi';
import { BsBriefcaseFill, BsPhoneFill } from 'react-icons/bs';
import { BiFemale, BiMale } from 'react-icons/bi';
import { MdAccountCircle, MdEmail } from 'react-icons/md';
import { CgOrganisation } from 'react-icons/cg';

const ProfilePage = () => {
    const [authenticated_user, setAuthenticatedUser] = useState([]);

    // Get user details
      useEffect(() => {
        const user = JSON.parse(localStorage.getItem('authenticated_user')).authenticated_userdata;
        setAuthenticatedUser(user);
      }, []);

    return (
        <>
            {/* <div className='grow p-4 ml-16 md:ml-0 bg-red-500 md:h-full h-screen'> */}
                <div className='grow p-4 ml-16 md:ml-0 h-screen  bg-gray-100'>

                    <div className="border flex bg-[#072f6b] text-white p-2">
                        <div className='bg-rd-500'>
                            <MdAccountCircle className='rounded-full h-30 w-30' />
                        </div>

                        <div className='mx-4 block justify-items-center my-auto'>
                            <span className='font-bold text-2xl '>{authenticated_user.first_name} {authenticated_user.last_name}</span> <br />
                            <span className='text-sm'>{authenticated_user.role}</span>
                        </div>
                    </div>

                    <div className="bg-white pt-6">

                        <div className="py-2 flex">
                            <div className="flex my-auto text-3xl text-gray-500 ml-5 ">
                            {(authenticated_user.gender === "M") ? <BiMale /> : <BiFemale /> }
                            </div>
                            <div className=' ml-4'>
                                <label className='text-gray-400 text-sm'>Name</label>
                                <h6 className='font-bold text-gray-500'>{authenticated_user.first_name} {authenticated_user.last_name}</h6>
                            </div>
                        </div>

                        <div className="py-2 flex">
                            <div className="flex my-auto text-3xl text-gray-500 ml-5 ">
                                <BsBriefcaseFill />
                            </div>
                            <div className=' ml-4'>
                                <label className='text-gray-400 text-sm'>Title/Position</label>
                                <h6 className='font-bold text-gray-500'>{authenticated_user.role}</h6>
                            </div>
                        </div>


                        <div className=" py-2 flex">
                            <div className="flex my-auto text-3xl text-gray-500 ml-5 ">
                                <BsPhoneFill />
                            </div>
                            <div className=' ml-4'>
                                <label className='text-gray-400 text-sm'>Phone</label>
                                <h6 className='font-bold text-gray-500'>{authenticated_user.phone_number}</h6>
                            </div>
                        </div>

                        <div className=" py-2 flex">
                            <div className="flex my-auto text-3xl text-gray-500 ml-5 ">
                                <CgOrganisation />
                            </div>
                            <div className=' ml-4'>
                                <label className='text-gray-400 text-sm'>Organization</label>
                                <h6 className='font-bold text-gray-500'>{authenticated_user.entity}</h6>
                            </div>
                        </div>

                        <div className=" py-2 flex">
                            <div className="flex my-auto text-3xl text-gray-500 ml-5 ">
                                <MdEmail />
                            </div>
                            <div className=' ml-4'>
                                <label className='text-gray-400 text-sm'>Useremail</label>
                                <h6 className='font-bold text-gray-500'>{authenticated_user.useremail}</h6>
                            </div>
                        </div>

                    </div>

            </div>
        </>
    )
}

export default ProfilePage