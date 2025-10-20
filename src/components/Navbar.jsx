import { useEffect, useRef, useState } from 'react';
import { GoScreenFull, GoScreenNormal } from 'react-icons/go';
import { IoNotifications } from 'react-icons/io5';
import UserDropDown from './UserDropdown';
import { NavLink } from 'react-router-dom';
import LogoComponent from './LogoComponent';
import { MdAccountCircle } from 'react-icons/md';

const Navbar = ({ appRef }) => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (appRef.current.requestFullscreen) {
        appRef.current.requestFullscreen();

        // Add scrollable styles
      appRef.current.style.overflowY = 'auto';
      appRef.current.style.height = '';
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
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
    <div className="fixed z-10 top-0 w-full bg-white text-teal-500 md:ml-0 py-1 border-b border-gray-300 h-20 flex items-center">
      <div className="flex items-center justify-start w-full ml-6">
        <div className="flex  items-center">
          <LogoComponent logoclass={"h-10 rounded-full text-teal-500 "} />
        </div>
      </div>

      <div className="flex items-center justify-end text-teal-500 hover:text-teal-600 w-full pr-4">

        <button
          className='text-2xl text-dark cursor-pointer mx-2'
          onClick={toggleFullScreen}
        >
          {isFullScreen ?
            <GoScreenNormal className='text-bold text-md mx-3 ' />
            :
            <GoScreenFull className='text-bold text-md mx-3' />
          }
        </button>

        <button
          onClick={toggleDropdown}
          className="flex items-center cursor-pointer  dropdown-toggle">
          <span className="mr-2 font-semibold text-sm hidden md:block">
            ADMIN
          </span>
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
            <MdAccountCircle className='rounded-full h-10 w-10' />
          </span>
        </button>

        {isOpen && (
          <UserDropDown isOpen={isOpen} dropdownRef={dropdownRef} closeDropdown={closeDropdown} />
        )}

      </div>

    </div>
  )
}

export default Navbar