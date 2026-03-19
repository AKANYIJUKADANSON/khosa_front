
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { BiCalendar, BiTrashAlt } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import { IoMdAddCircle, IoMdCloudUpload } from "react-icons/io";
// import { RxCross1 } from 'react-icons/rx';
// import { NavLink } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import CustomTooltip from '../../components/CustomTooltip';
import { IoClose, IoTrashBin } from 'react-icons/io5';
import { MdUploadFile } from 'react-icons/md';
import { BsPencilSquare, BsTrash2Fill, BsTrashFill } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import { NavLink } from 'react-router-dom';


const Gallery = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isAddImages, setIsAddImages] = useState(false);
  const [gallery, setGallery] = useState([]);

  const [seasons, setSeasons] = useState([]);
  const [matchdays, setMatchdays] = useState([]);

  const [uploads, setUploads] = useState([]);
  const [matchday_id, setMatchdayId] = useState('');
  const [season_id, setSeasonId] = useState('');
  const [match_date, setMatchDate] = useState('');

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    const get_gallery = async () => {
      const gallery = await fetch(`${apiUrl}/gallery`, {
        method: 'POST',
        body: formData
      });
      
      const data = await gallery.json();
      // console.log("gallery: ", data.gallery);
      setGallery(data.gallery);
    }

    const get_seasons = async () => {
      const seasons_list = await fetch(`${apiUrl}/seasons`, {
        method: 'POST',
        body: formData
      });
      const data = await seasons_list.json();
      // console.log("seasons List: ", data.seasons);
      setSeasons(data.seasons);
    }

    get_gallery();
    get_seasons();

  }, [apiUrl] )

  const get_season_matchdays = async (event) =>{

    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);


    const selected_season_id = event.target.value;

    // Set season id
    setSeasonId(selected_season_id);

    // console.log('Selected_season_id:', selected_season_id);

    const matchday_list = await fetch(`${apiUrl}/season_matchdays/${selected_season_id}`, {
      method: 'POST',
      body: formData
    });

    const data = await matchday_list.json();
    // console.log("season_matchday_list: ", data.season_matchdays);
    setMatchdays(data.season_matchdays);

  }

  const handleFileChange = (e) => {
    // get images
    const selected_images = Array.from(e.target.files);

    const imgs_to_upload = selected_images.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setUploads((previousImages) => previousImages.concat(imgs_to_upload));
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const img_list = gallery.map((image) => ({
    ...image,
    combinedColumns: `
      ${image.img_name} 
      ${image.matchday} 
      ${image.match_date} 
      ${image.type} 
      ${image.season} 
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

  const onDeleteClick = async (hashing) => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);

    if (window.confirm("Are you sure you want to delete this record?")) {
      const delete_image = await fetch(`${apiUrl}/gallery/delete/${hashing}`, {
        method: 'POST',
        body: formData
      });

      const data = await delete_image.json();
      // console.log('Delete response: ', data);

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
          window.location.reload();
        }, 1000);
      }
    }
  }

  const actionBodyTemplate = (row) => {
    return (
      <>
        <div className='flex gap-3' >
          {/* <NavLink to= {`/gallery/update/${row.hashing}`} >
              <BsPencilSquare className='text-2xl items-center font-bold rounded hover:text-blue-900 ' />
          </NavLink> */}

          <NavLink onClick={() =>  onDeleteClick(row.hashing)} >
              <BsTrashFill className='text-2xl text-red-500 items-center font-bold rounded ' />
          </NavLink>
        </div>
      </>
    )
  };


  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    // console.log("Images_to_upload: ", uploads);

    // initialise FormData and append the object with its key
    const formData = new FormData();
    uploads.forEach((img_data) => {
      formData.append('images[]', img_data.file);
    })

    formData.append('season_id', season_id);
    formData.append('matchday_id', matchday_id);
    formData.append('match_date', match_date);
    

    //Send data to the backend
    try{
      const uploading = await fetch(`${apiUrl}/upload_gallery`, {
        method: 'POST',
        body: formData
      });

      const response_data = await uploading.json();

      console.log("CI_3 Response: ", response_data);

      if (response_data.status === '200') {
        toast.success(response_data.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(response_data.message);
        return;
      }

    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Network error: ' + err.message);
    }

  }

  return (
    <>
      <div className={`grow p-2 h-full md:h-screen lg:h-screen mb-5 bg-gray-100 ml-16 md:ml-0`}>
        <div className="items-center my-2">
          {(!isAddImages) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">GALLERY</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD MATCHDAY GALLERY</h2>
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

          {isAddImages && 
            <>
              <div className="flex border-0 w-full">
                <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >


                  <div className="block md:flex space-x-6">
                    <div className='w-full my-2'>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>Season_id<span className='text-red-500 font-extrabold '>*</span></label>

                      <select
                        name="season_id"
                        value={season_id}
                        onChange={get_season_matchdays}
                        className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        required
                      >
                        <option disabled value="">Choose..</option>
                        {seasons.map((season) => (
                          <option key={season.id} value={season.id}>
                            Season {season.season}
                          </option>
                        ))}

                      </select>
                    </div>

                      <div className='w-full my-2'>
                        <label className='block mb-1 text-sm font-medium text-gray-700'>Matchday<span className='text-red-500 font-extrabold '>*</span></label>

                        <select
                          name="matchday_id"
                          value={matchday_id}
                          onChange={(e) => setMatchdayId(e.target.value)}
                          className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                          required
                        >
                          <option disabled value="" selected>Choose..</option>
                          {matchdays.map((matchday) => (
                            <option key={matchday.id} value={matchday.id}>
                              Matchday {matchday.matchday}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='w-full my-2'>
                        <label className='block mb-1 text-sm font-medium text-gray-700'>Match date<span className='text-red-500 font-extrabold '>*</span></label>

                        <input
                          name="match_date"
                          type='date'
                          value={match_date}
                          onChange={(e) => setMatchDate(e.target.value)}
                          className="mt-1 block w-full p-2 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                          required
                        />
                      </div>
                  </div>

                  <div className="block md:flex space-x-6">
                    <div className='my-2 w-full'>
                      <label htmlFor="imgName" className="block mb-3 text-left text-sm font-medium text-gray-700">Select images<span className='text-red-500 font-extrabold '>*</span> </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col p-2 h-40 items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100  ">
                          <div className="flex flex-col items-center justify-center">

                            <IoMdCloudUpload className=" text-5xl mb-4 text-teal-500 dark:text-gray-400 hover:text-orange-500" />
                            <p className="mb-2 text-sm text-teal-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-teal-500 dark:text-gray-400">PNG, JPG & JPEG</p>

                            <input name='images[]' multiple id="dropzone-file" type="file" className='hidden'
                              accept="image/jpeg,image/png, image/jpg"
                              onChange={handleFileChange}
                            />
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>


                  <div className='mt-5'>
                    <div className='space-x-5 my-2 flex justify-start'>
                      <button type='submit' className='cursor-pointer flex items-center fw-light gap-1 px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>
                        <MdUploadFile className='text-xl' /> <span className='text-md' >UPLOAD</span>
                      </button>
                    </div>
                  </div>

                </form>
              </div>

            </>
          }

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 `}>
            { uploads && 
              uploads.map((image, index)=>{
                return (
                  <div className="relative" key={index}>
                    <img src={image.preview} alt="" className='rounded-tr-md ' />

                    <button 
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-5 shadow-lg border-2 border-white"
                      onClick={()=>{
                        setUploads(uploads.filter((e) => e !== image));
                      }}
                      >
                      <IoClose size={20} />
                    </button>
                  </div>
                )
              })
            }
          </div>

          {(!isAddImages) &&
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
              
              <DataTable value={img_list}
                tableStyle={{ minWidth: '10rem' }}
                filters={filters}
                globalFilterFields={['combinedColumns']}
                className='datatable-responsive mt-6'
                currentPageReportTemplate='showing {first} to {last} of {totalRecords} results'
                paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                removableSort
                dataKey={img_list.id}
                emptyMessage='No results available'
                paginator
                rows={10}
                sortMode="multiple"
                rowsPerPageOptions={[10, 20, 30, 40, 50, gallery.length]}
              >
                <Column field='img_name' sortable header='Image' ></Column>
                <Column field='season' align={'center'} sortable header='Season' ></Column>
                <Column field='matchday' align={'center'} sortable header='Matchday' ></Column>
                <Column field='match_date' align={'center'} sortable header='Match Date' ></Column>
                <Column body={actionBodyTemplate} header='Actions' ></Column>
              </DataTable>
            </div>
          }

        </div>

      </div>

      {(!isAddImages) ?
        <button
          onClick={() => setIsAddImages(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
          <IoMdAddCircle className='text-4xl' />
        </button>
        :
        <button
          onClick={() => setIsAddImages(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-4xl' />
        </button>
      }

    </>
  )
}

export default Gallery


