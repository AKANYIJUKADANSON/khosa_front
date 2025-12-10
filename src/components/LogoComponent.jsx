import React from 'react'
import logo from '/src/assets/logo.png'; // Adjust the path to your logo image
import { MdAccountCircle } from 'react-icons/md';

const LogoComponent = ({logoclass}) => {
  return (
    <>
      <div className="bg-aber-500 flex justify-center">
        <div className="flex justify-center">
            <img src={logo} alt="Logo" className={logoclass} />
            {/* <MdAccountCircle className='h-6' /> */}
        </div>
        <div className='my-auto text-center font-bold text-md text-red-600'>
          <div className="block">
            KHOSA
          </div>
          <div className="block">
            LEAGUE
          </div>
        </div>
      </div>
    </>
    
  )
}

export default LogoComponent