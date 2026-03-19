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


const Smlinks = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [sm_links, setSmLinks] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [isAddSmLink, setIsAddSmLink] = useState(false);

  const [season_id, setSeasonId] = useState('');
  const [embed_link, setEmbedLink] = useState('');
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);
    
    const get_sm_links = async () => {
      const seasons = await fetch(`${apiUrl}/smlinks`, {
        method: 'POST',
        body: formData
      });
      const data = await seasons.json();
      // console.log("Sm_Links: ", data.smlinks);
      setSmLinks(data.smlinks);
    }

    const get_season_list = async () => {
      const seasons_list = await fetch(`${apiUrl}/seasons`, {
        method: 'POST',
        body: formData
      });
      const data = await seasons_list.json();
      // console.log("seasons List: ", data.seasons);
      setSeasonList(data.seasons);
    }

    get_sm_links();
    get_season_list();
  }, [apiUrl]);


  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = sm_links.map((smlink) => ({
    ...smlink,
    combinedColumns: `
                ${smlink.platform} 
                ${smlink.embed_link} 
                ${smlink.created_on} 
                ${smlink.season_label} 
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

  const actionBodyTemplate = (row) => {
    return (
      <>
        <div className='flex gap-3' >
          <NavLink to= {`/smlinks/update/${row.hashing}`} >
              <BsPencilSquare className='text-2xl items-center font-bold rounded hover:text-blue-900 ' />
          </NavLink>

          <NavLink onClick={() => onDeleteClick(row.hashing)} >
              <BsTrashFill className='text-2xl text-red-500 items-center font-bold rounded ' />
          </NavLink>
        </div>
      </>
    )
  };

  const seasonBodyTemplate = (row) => {
    return (
      <>
        <div className='flex gap-3' >
          SN{row.season}
        </div>
      </>
    )
  };


  const onDeleteClick = async (hashing) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const delete_matchday = await fetch(`${apiUrl}/smlinks/delete/${hashing}`, {
        method: 'DELETE'
      });

      const response = await delete_matchday.json();
      console.log('Delete response: ', response);
      if (response.status == '200'){
        toast.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
      else{
        toast.error(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    // const data = {
    //   new_season : season,
    //   start_date : startDate,
    //   Is_current : platform,
    // }

    // console.log('Form data: ', data);
    // initialise FormData and append the object with its key
    const formData = new FormData();

    formData.append('season_id', season_id);
    formData.append('platform', platform);
    formData.append('smlink', embed_link);


    // //Send data to the backend
    const create_season = await fetch(`${apiUrl}/smlinks/create`, {
      method: 'POST',
      body: formData
    });

    const response_data = await create_season.json();

    console.log("CI_3 Response: ", response_data);

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
          {(!isAddSmLink) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">SM LINKS</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD SM LINK</h2>
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

          {(isAddSmLink) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">

                  <div className='w-full'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Season*</label>

                    <select
                      name="season_id"
                      value={season_id}
                      onChange={(e) => setSeasonId(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option selected defaultValue={''}>Choose..</option>
                      {seasonList.map((season) => (
                          <option key={season.id} value={season.id}>
                              Season {season.season}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Platform*</label>
                      <input type='text' className='w-full p-2 border rounded' placeholder='Twitter, Facebook ...' required
                      name="platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    />
                  </div>

                </div>

                <div className="block space-x-6">
                  <label className='block mb-2'>Embed Link</label>
                  <textarea name='embed_link' className='w-full p-2 border rounded' placeholder='Embed link'
                    value={embed_link}
                    onChange={(e) => setEmbedLink(e.target.value)}
                  ></textarea>
                </div>

                <div className='mt-10'>
                  <div className='space-x-5 my-2 flex justify-start'>
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>SUBMIT</button>
                  </div>
                </div>

              </form>

            </div>
          }

          {(!isAddSmLink) &&
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
                rowsPerPageOptions={[sm_links.length]}
              >
                <Column field='embed_link' sortable header='Embed Link' ></Column>
                <Column field='platform' sortable header='Platform' ></Column>
                <Column body={seasonBodyTemplate} align={'center'} header='SN' ></Column>
                <Column body={actionBodyTemplate} align={'center'} header='Actions' ></Column>

              </DataTable>
            </div>
          }

        </div>
      </div>

      {(!isAddSmLink) ?
        <NavLink
          onClick={() => setIsAddSmLink(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed rounded-full bottom-5 right-4 hover:bg-teal-700 flex items-center justify-center">
          <IoMdAddCircle className='text-4xl' />
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddSmLink(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-4xl' />
        </NavLink>
      }

    </>
  )
}

export default Smlinks


