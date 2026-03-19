import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink, useLoaderData } from 'react-router-dom';
import { IoMdAddCircle} from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';


const EditSm = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  const userdata = JSON.parse(localStorage.getItem('userdata'));

  const selected_smlink = useLoaderData();
  // console.log('Selected_smlinkiee', selected_smlink);
  
  const [seasonList, setSeasonList] = useState([]);

  const [season_id, setSeasonId] = useState(selected_smlink.season_id);
  const [embed_link, setEmbedLink] = useState(selected_smlink.embed_link);
  const [platform, setPlatform] = useState(selected_smlink.platform);


  useEffect(() => {

    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    const get_season_list = async () => {
      const seasons_list = await fetch(`${apiUrl}/seasons`, {
        method: 'POST',
        body: formData
      });
      const data = await seasons_list.json();
      // console.log("seasons List: ", data.seasons);
      setSeasonList(data.seasons);
    }

    get_season_list();
  }, [userdata, apiUrl]);


  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    formData.append('season_id', season_id);
    formData.append('platform', platform);
    formData.append('smlink', embed_link);


    // //Send data to the backend
    const create_season = await fetch(`${apiUrl}/smlinks/update/${selected_smlink.hashing}`, {
      method: 'POST',
      body: formData
    });

    const response_data = await create_season.json();

    // console.log("CI_3 Response: ", response_data);

    if (response_data.status == '200') {
      toast.success(response_data.message);
      setTimeout(() => {
        window.location.href = '/smlinks';
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
          <h2 className="text-md text-left text-teal-500 font-bold my-auto">EDIT SM LINK</h2>
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
          
        </div>
      </div>

      <NavLink
        to = {'/smlinks'}
        className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-5 right-3 hover:bg-red-700 flex items-center justify-center">
        <RxCross1 className='text-4xl' />
      </NavLink>
    </>
  )
}


// Fetch and export the fixture data using dataloader
const smlinkLoader = async ({ params }) => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  const userdata = JSON.parse(localStorage.getItem('userdata'));
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

  // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
  // The id parameter used in the App.js file should be the same as that used here
  const response = await fetch(`${apiUrl}/smlinks/${params.hashing}`, {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  if(data.status == '401'){
        setTimeout(() => {
        toast.error(data.message);
        }, 1000);
        localStorage.clear();
        window.location.href = '/';
    }
    else if(data.status == '400'){
        toast.error(data.message);
        return;
    }else{
        return data.smlink;
    }
    
};

export { EditSm as default, smlinkLoader }


