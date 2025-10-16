
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { BsEyeFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { IoAddCircle } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { HiUserAdd } from 'react-icons/hi';
import CustomTooltip from '../../components/CustomTooltip';


const ManageFixtures = () => {
  // If used Create React App (CRA)
  // const apiUrl = process.env.REACT_APP_API_URL;

  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isAddUser, setIsAddUser] = useState(false);

  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const [useremail, setUseremail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [entity, setEntity] = useState('');


  const [userList, setUserList] = useState([]);
  const [entityList, setEntityList] = useState([]);


  // Get the category list
  useEffect(() => {
    const get_users = async () => {
      const query = await fetch(`${apiUrl}/users`);

      const response = await query.json();

      if (response.status === '200') {
        // set the category list
        console.log('User List: ', response);
        setUserList(response.users_list);
      } else {
        toast.error(response.message);
      }
    }


    const get_entity_list = async () => {
      const query = await fetch(`${apiUrl}/entitylist`);

      const response = await query.json();

      if (response.status === '200') {
        // set the category list
        setEntityList(response.entity_list);
        console.log('Entity List: ', response.entity_list);
      } else {
        toast.error(response.message);
      }
    }

    get_users();
    get_entity_list();

  }, []);

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    // initialise FormData and append the object with its key
    const formData = new FormData();

    // Validate data
    if (entity.trim() === '') {
      toast.error("Entity field is required. Try again");
      return;
    }
    if (role.trim() === '') {
      toast.error("Role field is required. Try again");
      return;
    }
    if (gender.trim() === '') {
      toast.error("Gender field is required. Try again");
      return;
    }

    // Append all data to the formdata array
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('useremail', useremail);
    formData.append('entity', entity);
    formData.append('phone_number', phone_number);
    formData.append('role', role);
    formData.append('gender', gender);

    // Send data to the backend
    const send_user_data = await fetch(`${apiUrl}/users/create`, {
      method: 'POST',
      body: formData
    });

    const response_data = await send_user_data.json();

    // console.log("CI_3 Response: ", response_data);  

    if (response_data.status === '200') {
      toast.success(response_data.message);
      window.location.reload();
    } else {
      toast.error(response_data.message);
      return;
    }

  }

  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = userList.map((user) => ({
    ...user,
    combinedColumns: `
            ${user.first_name} 
            ${user.last_name}
            ${user.useremail}
            ${user.phone_number}
        `,
  }));

  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },

    // Setting filter for the filter from many field values
    combinedColumns: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
  });

  const ticketBodyTemplate = (row) => {

    return (
      <>
        <NavLink to={`/users/${row.hashing}`} className="hover:text-blue-800" >
          <span className='font-extrabold'>{row.first_name + ' ' + row.last_name}</span>
          <span className='font-extralight'> ({row.role})</span>
        </NavLink>
        <br />
        <span className='text-sm font-light'>
          <span className='font-bold mr-2'>Email:</span>{row.useremail}
        </span>
        <br />
        <span className='text-sm font-light'>
          <span className='font-bold'>Phone: </span>{row.phone_number}
        </span>
      </>
    )
  }

  return (
    <>
      <div className='grow p-2 h-full md:h-screen lg:h-full bg-gray-100 ml-16 md:ml-0'>
          <div className="items-center my-2">
            {(!isAddUser) ?
              <h2 className="text-xl text-left text-blue-900 font-bold my-auto">FIXTURES</h2>
              :
              <h2 className="text-xl text-left text-blue-900 font-bold my-auto">ADD FIXTURE</h2>
            }
          </div>
        <div className='grid '>


          <ToastContainer
            position="top-right"
            autoClose={7000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />


          {(isAddUser) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">
                  <div className='w-full'>
                    <label className='block mb-2 text-sm font-medium text-gray-700'>First Name*</label>
                    <input type='text' name='first_name' className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                      value={first_name}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>

                  <div className='w-full'>
                    <label className='block mb-2 text-sm font-medium text-gray-700'>Last Name*</label>
                    <input type='text' name='last_name' className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                      value={last_name}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>

                  <div className='w-full'>
                    <label className='block mb-2 text-sm font-medium text-gray-700'>Useremail*</label>
                    <input type='email' name='useremail' className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                      value={useremail}
                      onChange={(e) => setUseremail(e.target.value)}
                    />
                  </div>

                </div>

                <div className="block md:flex space-x-6">
                  <div className='w-full'>
                    <label className='block mb-2 text-sm font-medium text-gray-700'>Entity*</label>

                    <select
                      name="entity"
                      value={entity}
                      onChange={(e) => setEntity(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      <option value="">Choose..</option>
                      {entityList.map((entity) => (
                        <option key={entity.hashing} value={entity.hashing}>
                          {entity.name + ' (' + entity.code + ')'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-full'>
                    <label className='block mb-2 text-sm font-medium text-gray-700'>Mobile Number*</label>
                    <input type='text' name='phone_number' className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' placeholder='256 7.......'
                      value={phone_number}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className='w-full'>
                    <label className='block mb-2 font-medium'>Role*</label>
                    <select name='role' className='w-full p-2 border rounded' required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Choose..</option>
                      <option value='supervisor'>Supervisor</option>
                      <option value='sysadmin'>System Admin</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>

                  <div className='md:w-md w-full'>
                    <label className='block mb-2 font-medium'>Gender*</label>
                    <select name='gender' className='w-full p-2 border rounded' required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Choose..</option>
                      <option value='M'>Male</option>
                      <option value='F'>Female</option>
                    </select>
                  </div>

                </div>



                <div className='px-2 mt-10'>
                  <div className='space-x-5 my-2 flex justify-start'>
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-[#082f6b] hover:bg-blue-700 text-white rounded font-light'>ADD</button>
                  </div>
                </div>
              </form>
            </div>
          }

          {(!isAddUser) &&
            <div className="w-full flex flex-col overflow-auto bg-white px-4">
              <div className="mt-2">
                <InputText
                  className='border border-black p-2 my-auto float-right' placeholder="Filter ..."
                  onInput={(e) =>
                    setFilters({
                      ...filters,
                      global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
                    })
                  }
                />
              </div>
              {/* <div className='overflow-auto'> */}
              <DataTable value={data}
                ref={data}
                tableStyle={{ minWidth: '50rem' }}
                filters={filters}
                globalFilterFields={['combinedColumns']}
                className='datatable-responsive mt-6'
                currentPageReportTemplate='showing {first} to {last} of {totalRecords} tickets'
                paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                removableSort
                // showGridlines
                stripedRows
                dataKey='id'
                // header={header}
                emptyMessage='No tickets available'
                paginator
                rows={5}
                sortMode="multiple"
                rowsPerPageOptions={[10, 20, 30, 40, 50, userList.length]}
              >
                <Column body={ticketBodyTemplate} sortable sortField='last_name' header='User' ></Column>
                <Column field='gender' sortable header='Gender' ></Column>
                <Column field='name' sortable header='Entity' ></Column>

              </DataTable>
              {/* </div> */}
            </div>
          }

        </div>
      </div>

      {(!isAddUser) ?
        <NavLink
          onClick={() => setIsAddUser(true)}
          className="bg-blue-800 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-blue-900 flex items-center justify-center">
          <CustomTooltip content={'Add System User'}>
            <HiUserAdd className='text-4xl' />
          </CustomTooltip>
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddUser(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <CustomTooltip content={'Cancel'}>
            <RxCross1 className='text-4xl' />
          </CustomTooltip>
        </NavLink>
      }

    </>
  )
}

export default ManageFixtures