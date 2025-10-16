import { IoMdLock, IoMdSettings } from 'react-icons/io';
import { MdAccountCircle } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const UserDropDown = ( {dropdownRef, closeDropdown} ) => {

  return (
      
      <div ref={dropdownRef} className='bg-white z-2 shadow-2xl border-1 top-19 border-gray-500 rounded p-2 w-40 absolute mr-2 dropdownProfile'>

        <div className=" mx-auto border-2 space-x-2 text-xl font-extralight text-red-500 ">
          <h2 className='text-center'>John Doe</h2>
        </div>
          <hr />

        <div className="flex items-center my-2 space-x-2 text-xl font-bold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-400">
          <MdAccountCircle />
          <NavLink onClick={closeDropdown} to="/profile" className='block'>Profile</NavLink>
        </div>

        <div className="flex items-center my-2 space-x-2 text-xl font-bold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-400">
          <IoMdSettings />
          <NavLink onClick={closeDropdown} to="/settings" className='block'>Settings</NavLink>
        </div>

        <div className="flex items-center my-2 space-x-2 text-xl font-bold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-400">
          <IoMdLock />
          <NavLink onClick={closeDropdown} to="/logout" className='block'>Logout</NavLink>
        </div>

      </div>

  )
}

export default UserDropDown