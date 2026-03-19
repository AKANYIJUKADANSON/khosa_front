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
import { Toast } from 'bootstrap';


const Seasons = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  const userdata = JSON.parse(localStorage.getItem('userdata'));
  
  const [seasonList, setSeasonList] = useState([]);
  const [isAddSeason, setIsAddSeason] = useState(false);

  const [newSeason, setNewSeason] = useState('');
  const [isCurrent, setIsCurrent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    const get_season_list = async () => {
      const seasons = await fetch(`${apiUrl}/seasons`, {
        method: 'POST',
        body: formData
      });
      const data = await seasons.json();

      if(data.status == '401'){
        setTimeout(() => {
          toast.error(data.message);
        }, 1000);
        localStorage.clear();
        window.location.href = '/';
      }else if(data.status == '400'){
        toast.error(data.message);
        return;
      }else{
        // console.log("seasons: ", data.seasons);
        setSeasonList(data.seasons);
      }

    }

    get_season_list();
  }, [userdata, apiUrl]);


  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = seasonList.map((season) => ({
    ...season,
    combinedColumns: `
                ${season.season} 
                ${season.start_date} 
                ${season.end_date} 
                ${season.season_label} 
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
            <div className={`flex h-4 w-4 me-2 ${row.is_current == 1 ? 'bg-green-500' : 'bg-gray-300'} rounded-full `}></div>
            <div className='font-bold'>
              Season: {row.season}
            </div>
        </div>
      </>
    )
  };

  const endDateBody = (row) => {
    return (
      <>
        <div className='flex justify-left text-sm items-center'>
            <div className='font-bold'>
              { (row.end_date == '0000-00-00') ? <span className='text-green-700'>Ongoing</span> : (row.end_date == '') ? '--' : row.end_date }
            </div>
        </div>
      </>
    )
  };

  const onDeleteClick = async (hashing) => {
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    if (window.confirm("Are you sure you want to delete this record?")) {
      const delete_matchday = await fetch(`${apiUrl}/seasons/delete/${hashing}`, {
        method: 'POST',
        body: formData
      });

      const data = await delete_matchday.json();
      // console.log('Delete response: ', response);
      if(data.status == '401'){
        setTimeout(() => {
          toast.error(data.message);
        }, 1000);
        localStorage.clear();
        window.location.href = '/';
      }
      else if(data.status == '400'){
        toast.error(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      else{
        toast.success(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

  const actionBodyTemplate = (row) => {
    return (
      <>
        <div className='flex justify-center items-center mx-auto gap-3' >
          <NavLink to= {`/seasons/update/${row.hashing}`} >
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

    // const data = {
    //   new_season : newSeason,
    //   start_date : startDate,
    //   Is_current : isCurrent,
    // }

    // console.log('Form data: ', data);
    // initialise FormData and append the object with its key
    const formData = new FormData();

    formData.append('new_season', newSeason);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('is_current', (isCurrent) ? 1 : 0);

    // //Send data to the backend
    const create_season = await fetch(`${apiUrl}/seasons/create`, {
      method: 'POST',
      body: formData
    });

    const response_data = await create_season.json();

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
          {(!isAddSeason) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">SEASONS</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD SEASON</h2>
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

          {(isAddSeason) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">

                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Season*</label>
                      <input type='number' className='w-full p-2 border rounded' required
                      name="newSeason"
                      value={newSeason}
                      onChange={(e) => setNewSeason(e.target.value)}
                    />
                  </div>

                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Start Date*</label>
                      <input type='date' className='w-full p-2 border rounded' required
                      name="start_date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>End Date</label>
                      <input type='date' className='w-full p-2 border rounded'
                      name="end_date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                </div>

                <div className="flex space-x-3">
                    <input type="checkbox" className='h-5 w-5' name="isCurrent"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    />
                    <label className='my-auto'>Is Ongoing Season</label>   
                </div>

                <div className='mt-10'>
                  <div className='space-x-5 my-2 flex justify-start'>
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>SUBMIT</button>
                  </div>
                </div>

              </form>

            </div>
          }

          {(!isAddSeason) &&
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
                rowsPerPageOptions={[seasonList.length]}
              >
                <Column body={seasonBodyTemplate} header='Season' sortable sortField='season' ></Column>
                <Column field='start_date' sortable header='Start Date' ></Column>
                <Column body={endDateBody} header='End Date' sortable sortField='end_date' ></Column>
                <Column body={actionBodyTemplate} align={'center'} header='Actions' ></Column>

              </DataTable>
              {/* </div> */}
            </div>
          }

        </div>
      </div>

      {(!isAddSeason) ?
        <NavLink
          onClick={() => setIsAddSeason(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed rounded-full bottom-5 right-4 hover:bg-teal-700 flex items-center justify-center">
          <IoMdAddCircle className='text-4xl' />
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddSeason(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-4xl' />
        </NavLink>
      }

    </>
  )
}

export default Seasons


