import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { BiCalendar } from 'react-icons/bi';
import { ToastContainer } from 'react-toastify';
import { IoMdAddCircle, IoMdCloudUpload } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomTooltip from '../../components/CustomTooltip';
import { IoClose } from 'react-icons/io5';


const ManageGallery = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [gallery, setGallery] = useState([]);
  const [isAddPhoto, setIsAddPhoto] = useState(false);
  const [current_season, setCurrentSeason] = useState([]);
  const [matchdayList, setMatchdayList] = useState([]);
  const [filterList, setFilterTypesList] = useState([]);

  const [imgFile, setImgFile] = useState(null);
  const [matchday, setMatchday] = useState('');
  const [season_id, setSeasonId] = useState('');
  const [filterType, setFilterType] = useState('');
  const [match_date, setMatchDate] = useState('');

  const [imgPreviewUrl, setImgPreviewUrl] = useState('');

  useEffect(() => {
    const get_gallery = async () => {
      const gallery = await fetch(`${apiUrl}/gallery`);
      const data = await gallery.json();
      console.log("gallery: ", data.gallery);
      setGallery(data.gallery);
    }

    const get_current_season = async () => {
      const current_season = await fetch(`${apiUrl}/current_season`);
      const data = await current_season.json();
      console.log("current_season: ", data.current_season);
      setCurrentSeason(data.current_season);
    }

    const get_matchday_list = async () => {
      const matchday_list = await fetch(`${apiUrl}/matchdays`);
      const data = await matchday_list.json();
      console.log("Matchday_list: ", data.matchdays);
      setMatchdayList(data.matchdays);
    }

    get_matchday_list();
    get_current_season();
    get_gallery();
  }, [apiUrl]);

  // Validating the file type
  const handleFileChange = (event) => {
    const selected_file = event.target.files[0];
    if (selected_file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(selected_file.type)) {
        setImgFile(selected_file);
        setImgPreviewUrl(URL.createObjectURL(selected_file));  // Create preview URL
        console.log('Selected File:', selected_file);
      } else {
        toast.error('Please select a valid image file (JPEG or JPG)');
        setImgFile(null);
        imgPreviewUrl('');

      }
    }
  };

  // clearing the image url
  const removeFile = () => {
    setImgFile(null);
    setImgPreviewUrl('');
    const fileInput = document.getElementById('dropzone-file');
    if (fileInput) {
      fileInput.value = '';  // Reset file input
    }
    if (imgPreviewUrl) {
      URL.revokeObjectURL(imgPreviewUrl);  // Clean up memory
    }
  };


  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = gallery.map((post) => ({
    ...post,
    combinedColumns: `
                  ${post.imgName} 
                  ${post.matchday} 
                  ${post.match_date} 
                  ${post.type} 
                  ${post.season} 
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

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    // initialise FormData and append the object with its key
    const formData = new FormData();

    /**
     * If an imgName was added, upload it too
    */
    if (imgFile) {
      formData.append('img_file', imgFile);
    }
    formData.append('matchday', matchday);
    formData.append('match_date', match_date);
    // formData.append('filterType', filterType);
    formData.append('season_id', season_id);

    //Send data to the backend
    const add_post = await fetch(`${apiUrl}/add_image`, {
      method: 'POST',
      body: formData
    });

    const response_data = await add_post.json();

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

  }

  return (
    <>
      <div className={`grow p-2 h-full md:h-screen ${(isAddPhoto) ? 'lg:h-screen' : 'lg:h-full'} mb-5 bg-gray-100 ml-16 md:ml-0`}>
        <div className="items-center my-2">
          {(!isAddPhoto) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">GALLERY</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD MATCHDAY PICTURE</h2>
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

          {(!isAddPhoto) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">
                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Season_id<span className='text-red-500 font-extrabold '>*</span></label>

                    <select
                      name="season_id"
                      value={season_id}
                      onChange={(e) => setSeasonId(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled defaultValue={''} value=''>Choose...</option>
                      <option key={current_season.id} value={current_season.id}>Season {current_season.season}</option>
                    </select>
                  </div>

                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Matchday<span className='text-red-500 font-extrabold '>*</span></label>

                    <select
                      name="matchday"
                      value={matchday}
                      onChange={(e) => setMatchday(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled value="">Choose..</option>
                      {matchdayList.map((matchday) => (
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

                  {/* <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Filter Type<span className='text-red-500 font-extrabold '>*</span></label>

                    <select
                      name="filter_type"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled value="">Choose..</option>
                      {filterList.map((filter_type) => (
                        <option key={filter_type.id} value={filter_type.id}>
                          {filter_type.filter_type}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>

                <div className="block md:flex space-x-6">
                  <div className='my-2 w-full'>
                    <label htmlFor="imgName" className="block text-left text-sm font-medium text-gray-700">Select image<span className='text-red-500 font-extrabold '>*</span> </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col p-2 items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100  ">
                        <div className="flex flex-col items-center justify-center">
                          {!imgFile ?

                            <>
                              <IoMdCloudUpload className=" text-5xl mb-4 text-gray-500 dark:text-gray-400 hover:text-orange-500" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                            </>

                            : (
                              <div className="relative w-full">  {/* h-48 height of container, fixed h-48 here (inherits from label) */}
                                <img
                                  className="w-full rounded-lg object-contain"
                                  src={imgPreviewUrl}
                                  alt="Preview"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();      // Prevent label click from triggering file select
                                    e.stopPropagation();     // Stop event bubbling
                                    removeFile();
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-5 shadow-lg border-2 border-white"
                                >
                                  <IoClose size={20} />
                                </button>
                              </div>
                            )

                          }

                          <input name='img_file' id="dropzone-file" type="file" className='hidden'
                            accept="image/jpeg,image/png, image/jpg"
                            onChange={handleFileChange}
                          />
                        </div>
                      </label>
                    </div>

                  </div>
                </div>


                <div className='mt-10'>
                  <div className='space-x-5 my-2 flex justify-start'>
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>SUBMIT</button>
                  </div>
                </div>

              </form>

            </div>
          }

          {(isAddPhoto) &&
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
                emptyMessage='No results available'
                paginator
                rows={10}
                sortMode="multiple"
                rowsPerPageOptions={[10, 20, 30, 40, 50, gallery.length]}
              >
                <Column field='img_name' sortable header='Image' ></Column>
                <Column field='season' align={'center'} sortable header='Season' ></Column>
                <Column field='matchday' align={'center'} sortable header='Matchday' ></Column>
                <Column field='filter_type' align={'center'} sortable header='Filter_type' ></Column>
                <Column field='match_date' align={'center'} sortable header='Date' ></Column>
              </DataTable>
              {/* </div> */}
            </div>
          }

        </div>
      </div>

      {(!isAddPhoto) ?
        <NavLink
          onClick={() => setIsAddPhoto(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
          <IoMdAddCircle className='text-4xl' />
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddPhoto(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-4xl' />
        </NavLink>
      }

    </>
  )
}

export default ManageGallery


