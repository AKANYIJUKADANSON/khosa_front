import { IoEye, IoPencil, IoTrashBinOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';

const TicketDropdown = () => {

  return (
      
      <div className='bg-white z-1 border-1 top-4 border-gray-500 rounded absolute p-2 w-40 mr-9 '>

        <div className="flex items-center my-2 space-x-2 text-xl font-bold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-400">
          <IoEye />
          <NavLink to="/ticket/view" className='block'>View</NavLink>
        </div>

        <div className="flex items-center my-2 space-x-2 text-xl font-bold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-400">
          <IoPencil />
          <NavLink to="/ticket/edit" className='block'>Edit</NavLink>
        </div>

        <div className="flex items-center my-2 space-x-2 text-xl font-bold text-gray-500 hover:bg-gray-200 p-1 rounded hover:text-blue-400">
          <IoTrashBinOutline />
          <NavLink to="/ticket/delete" className='block'>delete</NavLink>
        </div>

      </div>

  )
}

export default TicketDropdown