import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink} from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { BsFloppy2Fill} from 'react-icons/bs';


const EditSeasons = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  const userdata = JSON.parse(localStorage.getItem('userdata'));
  // console.log('userdata', userdata);

  // Get the fixture data from the loader
  const selected_season = useLoaderData();

  
  const [newSeason, setNewSeason] = useState(selected_season.season);
  const [startDate, setStartDate] = useState(selected_season.start_date);
  const [endDate, setEndDate] = useState(selected_season.end_date);
  const [isCurrent, setIsCurrent] = useState((selected_season.is_current == '1') ? true : false);


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
    formData.append('loggedin_user_id', userdata.user_id);

    formData.append('new_season', newSeason);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('is_current', (isCurrent) ? 1 : 0);

    // //Send data to the backend
    const create_season = await fetch(`${apiUrl}/seasons/update/${selected_season.hashing}`, {
      method: 'POST',
      body: formData
    });

    const response_data = await create_season.json();

    // console.log("CI_3 Response: ", response_data);

    if (response_data.status == '200') {
      toast.success(response_data.message);
      setTimeout(() => {
        window.location.href = '/seasons';
      }, 2000);
    } else {
      toast.error(response_data.message);
      return;
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
              <NavLink to='/seasons' className=' hover:text-blue-800' >
                <span className='mx-2'>Seasons</span>
              </NavLink>
              / update / {selected_season.hashing}
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
                  <button type='submit'
                    className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed rounded-full bottom-7 right-20 hover:bg-teal-700 flex items-center justify-center">
                    <BsFloppy2Fill className='text-4xl p-0.5' />
                  </button>

                  <NavLink
                    to = '/seasons'
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
const seasonLoader = async ({ params }) => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;
  const userdata = JSON.parse(localStorage.getItem('userdata'));

  const formData = new FormData();
  formData.append('loggedin_user_id', userdata.user_id);

  // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
  // The id parameter used in the App.js file should be the same as that used here
  const response = await fetch(`${apiUrl}/seasons/${params.hashing}`, {
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
    return data.season;
  }

};

export { EditSeasons as default, seasonLoader }


