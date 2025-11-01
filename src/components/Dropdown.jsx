import React, { useState, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { FaTrashCan} from 'react-icons/fa6';
// import { useLoaderData } from 'react-router-dom';
import { IoEye } from 'react-icons/io5';
import { MdOutlineAssignmentInd } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

const Dropdown = ({hashing, onDeleteClick}) => {

    // Get the ticket data from the loader
    // const ticket = useLoaderData();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    

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
                    <div className='bg-white z-10 shadow-2xl border top-10 border-gray-400 rounded w-fit -ml-14 p-2 absolute dropdownProfile'>

                        <div className="flex items-center text-sm my-2 space-x-2 font-semibold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-900">
                            <NavLink to= {`/fixtures/${hashing}`} className={'flex items-center'} >
                                <IoEye className='mx-2 text-md' /> View
                            </NavLink>
                        </div>

                        <div className="flex items-center my-2 space-x-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-900">
                            <FaEdit className='mx-2 text-md' />
                            <NavLink to= {`/fixtures/update/${hashing}`} >Edit</NavLink>
                        </div>
                    

                        <div className="flex items-center my-2 space-x-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-red-500">
                            <FaTrashCan className='text-md mx-2' />

                            <button onClick={() => onDeleteClick(hashing)}>
                                Delete
                            </button>
                        </div>


                    </div>
                )}
            </div>
        </>
    )
}

// Export the dataloader function too
export default Dropdown;
