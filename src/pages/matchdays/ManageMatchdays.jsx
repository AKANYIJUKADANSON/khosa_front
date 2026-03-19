import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { IoMdAddCircle} from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
// import CustomTooltip from '../../components/CustomTooltip';
import { BsPencilSquare, BsTrashFill } from 'react-icons/bs';


const ManageMatchdays = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  const userdata = JSON.parse(localStorage.getItem('userdata'));

  const [matchdays, setMatchdays] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [isAddMatchday, setIsAddMatchday] = useState(false);

  const [season_id, setSeasonId] = useState('');
  const [newMatchday, setNewMatchday] = useState('');
  const [gd_link, setGdLink] = useState('');
  const [isMatchday, setIsMatchday] = useState('');

  useEffect(() => {
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    const get_matchdays = async () => {
      const matchdays = await fetch(`${apiUrl}/matchdays`, {
        method: 'POST',
        body: formData
      });

      const data = await matchdays.json();
      // console.log("dex_matchdays: ", data);
      setMatchdays(data.matchdays);
    }

    const get_season_list = async () => {
      const seasons = await fetch(`${apiUrl}/seasons`, {
        method: 'POST',
        body: formData
      });

      const data = await seasons.json();
      // console.log("seasons: ", data.seasons);
      setSeasonList(data.seasons);
    }

    get_season_list();
    get_matchdays();
  }, [userdata, apiUrl]);


  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = matchdays.map((matchday) => ({
    ...matchday,
    combinedColumns: `
                ${matchday.matchday} 
                ${matchday.matchday_label} 
                ${matchday.season} 
                ${matchday.gd_link}
                ${matchday.is_matchday}
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

  const seasonBodyTemplate = (row) => {
    return (
      <>
        <div className='flex justify-left text-sm items-center'>
          {/* {row.is_matchday == 1 &&  */}
            <div className={`flex h-4 w-4 me-2 ${row.is_matchday == 1 ? 'bg-green-500' : 'bg-gray-300'} rounded-full `}></div>
          {/* // } */}
          <div className="block space-x-4">
            <div className='font-bold'>
              Matchday: {row.matchday}
            </div>

            <div className='font-extralight'>
              SN: {row.season}
            </div>
          </div>
        </div>
      </>
    )
  };

  const onDeleteClick = async (hashing) => {
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    if (window.confirm("Are you sure you want to delete this record?")) {
      const delete_matchday = await fetch(`${apiUrl}/matchdays/delete/${hashing}`, {
        method: 'POST',
        body: formData
      });

      const response = await delete_matchday.json();
      // console.log('Delete response: ', response);
      if(response.status == '401'){
        setTimeout(() => {
          toast.error(data.message);
        }, 1000);
        localStorage.clear();
        window.location.href = '/';
      }
      else if(response.status == '400'){
        toast.error(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      else{
        toast.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

  const actionBodyTemplate = (row) => {
    return (
      <>
        <div className='flex gap-3' >
          <NavLink to= {`/matchdays/update/${row.hashing}`} >
              <BsPencilSquare className='text-2xl items-center font-bold rounded hover:text-blue-900 ' />
          </NavLink>

          <NavLink onClick={() => onDeleteClick(row.hashing)} >
              <BsTrashFill className='text-2xl text-red-500 items-center font-bold rounded ' />
          </NavLink>
        </div>
      </>
    )
  };

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    formData.append('season_id', season_id);
    formData.append('newMatchday', newMatchday);
    formData.append('gd_link', gd_link);
    formData.append('is_matchday', (isMatchday) ? 1 : 0);

    //Send data to the backend
    const create_matchday = await fetch(`${apiUrl}/matchdays/create`, {
      method: 'POST',
      body: formData
    });

    const response_data = await create_matchday.json();

    // console.log("CI_3 Response: ", response_data);

    if (response_data.status === '200') {
      toast.success(response_data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(response_data.message);
      return;
    }

  }

  return (
    <>
      <div className='grow p-2 h-full md:h-screen lg:h-full bg-gray-100 ml-16 md:ml-0'>
        <div className="items-center my-2">
          {(!isAddMatchday) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">MATCHDAYS</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD MATCHDAY</h2>
          }
        </div>

        <div className='grid'>

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

          {(isAddMatchday) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">
                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Season*</label>

                    <select
                      name="season_id"
                      value={season_id}
                      onChange={(e) => setSeasonId(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled defaultValue={''} value=''>Select...</option>
                      {seasonList.map((season) => (
                          <option key={season.id} value={season.id}>
                              Season {season.season}
                          </option>
                      ))}
                     
                    </select>
                  </div>

                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Matchday*</label>
                      <input type='number' className='w-full p-2 border rounded' required
                      name="newMatchday"
                      value={newMatchday}
                      onChange={(e) => setNewMatchday(e.target.value)}
                    />
                  </div>

                </div>

                <div className="block space-x-6">
                    <label className='block mb-2'>Goog Drive Link</label>
                    <textarea name='gd_link' className='w-full p-2 border rounded' placeholder='Enter google drive link'
                    value={gd_link}
                    onChange={(e) => setGdLink(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                    <input type="checkbox" className='h-5 w-5' name="isMatchday"
                    checked={isMatchday}
                    onChange={(e) => setIsMatchday(e.target.checked)}
                    />
                    <label className='my-auto'>Is Matchday</label>   
                </div>

                <div className='mt-10'>
                  <div className='space-x-5 my-2 flex justify-start'>
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>SUBMIT</button>
                  </div>
                </div>

              </form>

            </div>
          }

          {(!isAddMatchday) &&
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
                // ref={data}
                tableStyle={{ minWidth: '10rem' }}
                filters={filters}
                globalFilterFields={['combinedColumns']}
                className='datatable-responsive mt-6'
                currentPageReportTemplate='showing {first} to {last} of {totalRecords} results'
                paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                removableSort
                dataKey='id'
                emptyMessage='Nothing to show'
                paginator
                rows={10}
                sortMode="multiple"
                rowsPerPageOptions={[matchdays.length]}
              >
                <Column body={seasonBodyTemplate} header='Matchday' sortable sortField='matchday' ></Column>
                <Column field='gd_link' sortable header='Google Drive Link' ></Column>
                <Column body={actionBodyTemplate} header='Actions' ></Column>

              </DataTable>
              {/* </div> */}
            </div>
          }

        </div>
      </div>

      {(!isAddMatchday) ?
        <NavLink
          onClick={() => setIsAddMatchday(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed rounded-full bottom-5 right-4 hover:bg-teal-700 flex items-center justify-center">
          <IoMdAddCircle className='text-4xl' />
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddMatchday(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-4xl' />
        </NavLink>
      }

    </>
  )
}

export default ManageMatchdays


