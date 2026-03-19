import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink} from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { BsFloppy2Fill} from 'react-icons/bs';


const Matchdays = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  const userdata = JSON.parse(localStorage.getItem('userdata'));

  // Get the fixture data from the loader
  const selected_matchday = useLoaderData();
  // console.log('Selected_matchday', selected_matchday);
  
  const [seasonList, setSeasonList] = useState([]);

  const [season_id, setSeasonId] = useState(selected_matchday.season_id);
  const [newMatchday, setNewMatchday] = useState(selected_matchday.matchday);
  const [gd_link, setGdLink] = useState(selected_matchday.gd_link);
  const [isMatchday, setIsMatchday] = useState((selected_matchday.is_matchday == '1') ? true : false );

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
        toast.error(data.message);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
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

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    formData.append('season_id', season_id);
    formData.append('newMatchday', newMatchday);
    formData.append('gd_link', gd_link);
    formData.append('is_matchday', (isMatchday) ? 1 : 0);

    // //Send data to the backend
    const create_matchday = await fetch(`${apiUrl}/matchdays/update/${selected_matchday.hashing}`, {
      method: 'POST',
      body: formData
    });

    const data = await create_matchday.json();
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
      toast.success(data.message);
      setTimeout(() => {
        window.location.href = '/matchdays';
      }, 1000);
    }

  }

  return (
    <>
      <div className='grow p-2 h-full md:h-screen lg:h-full bg-gray-100 ml-16 md:ml-0 mb-20'>
        <div className="items-center my-2">
          <div className="text-md text-left text-gray-500 font-semibold my-auto">
            <NavLink to='/dashboard' className=' hover:text-blue-800' >
            Home / 
            </NavLink>
            <span> 
              <NavLink to='/matchdays' className=' hover:text-blue-800' >
                <span className='mx-2'>Matchdays</span>
              </NavLink>
              / update / {selected_matchday.hashing}
               </span>
          </div>
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
                    <option defaultValue={''} value={selected_matchday.season_id}>Season {selected_matchday.season}</option>
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
                  <button type='submit'
                    className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed rounded-full bottom-7 right-20 hover:bg-teal-700 flex items-center justify-center">
                    <BsFloppy2Fill className='text-4xl p-0.5' />
                  </button>

                  <NavLink
                    to = '/matchdays'
                    className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
                    <RxCross1 className='text-4xl' />
                  </NavLink>
                </div>
              </div>

            </form>

          </div>
          
        </div>
      </div>
  
      

    </>
  )
}


// Fetch and export the fixture data using dataloader
const matchdayLoader = async ({ params }) => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
   const userdata = JSON.parse(localStorage.getItem('userdata'));

  const formData = new FormData();
  formData.append('loggedin_user_id', userdata.user_id);

  // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
  // The id parameter used in the App.js file should be the same as that used here
  const response = await fetch(`${apiUrl}/matchdays/${params.hashing}`, {
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
  }else if(data.status == '400'){
    toast.error(data.message);
    return;
  }else{
    return data.matchday;
  }
  
};

export { Matchdays as default, matchdayLoader }


