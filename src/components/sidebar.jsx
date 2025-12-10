import React, { useState, useEffect, useRef } from 'react';
import { FaLock, FaTachometerAlt, FaTicketAlt } from 'react-icons/fa';
import { IoSettings, IoTicket } from 'react-icons/io5';
import LogoComponent from './LogoComponent';


import { NavLink } from 'react-router-dom';
import { BiCalendar, BiImage, BiSolidReport } from 'react-icons/bi';
import { HiArrowCircleLeft, HiArrowCircleRight, HiArrowSmRight } from 'react-icons/hi';
import { GiLinkedRings } from 'react-icons/gi';
import { GrGallery } from 'react-icons/gr';
import { BsNewspaper, BsPeopleFill } from 'react-icons/bs';
import { MdAccountCircle } from 'react-icons/md';

const Sidebar = () => {

    // get loggin details from local storage
    // const [authenticated_user, setAuthenticatedUser] = useState([]);
    const sidebarRefRef = useRef(null);
    const [toggle, setToggle] = useState(false);

    const expandSidebar = () => {
        setToggle(!toggle);
    };

    /**
     * Handling the clicking outside of the sidebar even
    */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRefRef.current && !sidebarRefRef.current.contains(event.target)) {
                setToggle(false);
            }
        };
        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // const [comment, setComment] = useState('');
    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem('authenticated_user')).authenticated_userdata;
    //     setAuthenticatedUser(user);
    // }, []);

    return (

        <div ref={sidebarRefRef} style={{ fontFamily: 'sans-serif' }} className={`bg-white z-9 mt-20 mb-0 h-full pl-4 pr-0 p-2 fixed ${(toggle) ? 'w-35' : 'w-16'} md:w-64 overflow-y-auto h-fit border-r border-gray-300 shadow-lg`}>

            <button
                className="flex justify-end me-4 md:hidden  lg:hidden rounded"
                onClick={expandSidebar}
            >
                {(!toggle) ?
                    <HiArrowCircleRight className="text-teal-500 w-8 h-8 flex justify-center items-center" />
                    :
                    <HiArrowCircleLeft className="text-teal-500 w-8 h-8 flex justify-center items-center" />
                }
            </button>

            <ul className='mt-2 flex flex-col text-xl mb-25'>
                <NavLink
                    onClick={() => setToggle(false)}
                    to={'/dashboard'}
                    className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <FaTachometerAlt className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Dashboard</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/fixtures' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <BiCalendar className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Fixtures</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/results' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <BiSolidReport className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Results</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/teams' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <BsPeopleFill className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Teams</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/wallhero' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <BiImage className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Wallhero</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/players' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <MdAccountCircle className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Players</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/posts' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <BsNewspaper className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Posts</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/gallery' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <GrGallery className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Gallery</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/about' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <GiLinkedRings className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>About</span>
                </NavLink>

                <NavLink
                    onClick={() => setToggle(false)}
                    to='/matchdays' className='flex items-center py-2 my-1 md:my-2 md:pl-2 md:mr-4 space-x-1 hover:rounded hover:cursor-pointer hover:bg-gray-200 hover:text-white'>
                    <GiLinkedRings className='text-2xl text-teal-500 md:mr-4' />
                    <span className={`${(toggle) ? 'md:inline' : 'hidden'} md:inline text-sm font-bold text-teal-500`}>Matchdays</span>
                </NavLink>
                
            </ul>
        </div>

    )
}

export default Sidebar