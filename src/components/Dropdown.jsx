import React, { useState, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { FaTrashCan} from 'react-icons/fa6';
// import { useLoaderData } from 'react-router-dom';
import { IoEye } from 'react-icons/io5';
import { MdOutlineAssignmentInd } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

const Dropdown = ({ticket, hashing_ticket, onDeleteClick}) => {

    // get loggin details from local storage
    const [authenticated_user, setAuthenticatedUser] = useState([]);

    // Get the ticket data from the loader
    // const ticket = useLoaderData();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('authenticated_user')).authenticated_userdata;
        setAuthenticatedUser(user);
    }, []);

    /**
     * Handling the clicking outside of the dropdown even
    */
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="relative " ref={dropdownRef} >
                {/* Button to toggle the dropdown */}
                <BsThreeDotsVertical className='text-3xl inline-flex items-center font-bold rounded hover:text-blue-900 ' onClick={toggleDropdown} />
                
                {/* Dropdown */}
                {isOpen && (
                    <div className='bg-white z-10 shadow-2xl border top-10 border-gray-400 rounded w-fit -ml-11 p-2 absolute dropdownProfile'>

                        <div className="flex items-center text-sm my-2 space-x-2 font-semibold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-900">
                            <NavLink to= {`/tickets/${hashing_ticket}`} className={'flex items-center'} >
                                <IoEye className='mx-2 text-md' /> View
                            </NavLink>
                        </div>

                        {
                            (( authenticated_user.role === 'Superadmin') 
                            && (ticket.status === 'unassigned')
                            )?

                        <div className="flex items-center my-2 space-x-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-900">
                            <MdOutlineAssignmentInd className='mx-2 text-md' />
                            <NavLink to= {`/tickets/assign/${hashing_ticket}`} >Assign</NavLink>
                        </div>
                        : ''}

                        { (
                            (authenticated_user.role === 'Superadmin') 
                            && (ticket.status === 'unassigned')
                        ) ?

                        <div className="flex items-center my-2 space-x-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-900">
                            <FaEdit className='mx-2 text-md' />
                            <NavLink to= {`/tickets/edit/${hashing_ticket}`} >Edit</NavLink>
                        </div>
                        : ''}

                        { (authenticated_user.role === 'Superadmin')?
                        <div className="flex items-center my-2 space-x-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-red-500">
                            <FaTrashCan className='text-md mx-2' />

                            <button onClick={() => onDeleteClick(hashing_ticket)}>
                                Delete
                            </button>
                        </div>
                        : ''}

                    </div>
                )}
            </div>
        </>
    )
}


// Fetch and export the ticket data using dataloader
const ticketloader = async ({params}) => { 
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    const response = await fetch(`${apiUrl}/tickets/${params.hashing_id}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch ticket data');
    }
    return data;
};

// Export the dataloader function too
export { Dropdown as default,  ticketloader };
