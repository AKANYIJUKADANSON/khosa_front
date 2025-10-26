import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { BiCalendar } from 'react-icons/bi';
import { IoMdAddCircle, IoMdCloudUpload } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import CustomTooltip from '../../components/CustomTooltip';
import { IoClose } from 'react-icons/io5';


const ManagePosts = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [posts, setPosts] = useState([]);
  const [isAddPost, setIsAddPost] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [current_season, setCurrentSeason] = useState([]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [post_file, setPostFile] = useState('');
  const [post_type, setPostType] = useState('');
  const [season_id, setSeasonId] = useState('');
  const [created_on, setCreatedOn] = useState('');

  const [postFilePreviewUrl, setPostFilePreviewUrl] = useState('');

  useEffect(() => {
    const get_posts = async () => {
      const posts = await fetch(`${apiUrl}/posts`);
      const data = await posts.json();
      console.log("posts: ", data.posts);
      setPosts(data.posts);
    }

    const get_current_season = async () => {
      const current_season = await fetch(`${apiUrl}/current_season`);
      const data = await current_season.json();
      console.log("current_season: ", data.current_season);
      setCurrentSeason(data.current_season);
    }

    get_current_season();
    get_posts();
  }, [apiUrl]);

  // Validating the file type
  const handleFileChange = (event) => {
    const selected_file = event.target.files[0];
    if (selected_file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(selected_file.type)) {
        setPostFile(selected_file);
        setPostFilePreviewUrl(URL.createObjectURL(selected_file));  // Create preview URL
        console.log('Selected File:', selected_file);
      } else {
        toast.error('Please select a valid image file (JPEG or JPG)');
        setPostFile(null);
        postFilePreviewUrl('');

      }
    }
  };

  // clearing the image url
  const removeFile = () => {
    setPostFile(null);
    setPostFilePreviewUrl('');
    const fileInput = document.getElementById('dropzone-file');
    if (fileInput) {
      fileInput.value = '';  // Reset file input
    }
    if (postFilePreviewUrl) {
      URL.revokeObjectURL(postFilePreviewUrl);  // Clean up memory
    }
  };


  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = posts.map((post) => ({
    ...post,
    combinedColumns: `
                  ${post.title} 
                  ${post.body} 
                  ${post.created_on} 
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

  const postBodyTemplate = (row) => {

    return (
      <>
        <div className='block md:flex justify-start  items-center'>
          <div className="hidden md:flex lg:flex">
            <img src={row.attachment} className="w-fit h-fit md:w-50 mx-2 rounded" />
          </div>
          <div className="md:ms-6">
            <div className="text-md text-blue-900 font-bold my-4 md:my-0 lg:my-0">{row.title}</div>
            <div className="text-sm">
              {(!showFullDescription) ? row.body.slice(0, 99, ) + ' ........' : row.body}
              
            </div>
          </div>

        </div>
      </>
    )
  }

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    // initialise FormData and append the object with its key
    const formData = new FormData();

    /**
     * If an attachment was added, upload it too
     */
    if (post_file) {
      formData.append('post_file', post_file);
    }
    formData.append('title', title);
    formData.append('body', body);
    formData.append('created_on', created_on);
    formData.append('post_type', post_type);
    formData.append('season_id', season_id);

    //Send data to the backend
    const add_post = await fetch(`${apiUrl}/add_post`, {
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
      <div className='grow p-2 h-full md:h-screen lg:h-full bg-gray-100 ml-16 md:ml-0'>
        <div className="items-center my-2">
          {(!isAddPost) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">POSTS</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD POST</h2>
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

          {(isAddPost) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">
                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Season_id*</label>

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
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Post Type*</label>

                    <select
                      name="post_type"
                      value={post_type}
                      onChange={(e) => setPostType(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled defaultValue={''} value=''>Choose...</option>
                      <option value='Post'>Post</option>
                      <option value='Transfer'>Transfer</option>
                      <option value='TOTW'>Team of The Week</option>
                      <option value='POTW'>Player of The Week</option>
                    </select>
                  </div>

                  <div className='w-full my-2'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Posted On*</label>

                    <input
                      name="created_on"
                      type='date'
                      value={created_on}
                      onChange={(e) => setCreatedOn(e.target.value)}
                      className="mt-1 block w-full p-2 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>

                <div className="block space-x-6">
                    <label className='block mb-2 '>Title*</label>
                    <input type='text' name='title' className='w-full p-2 border rounded' placeholder='Enter post title' required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="block space-x-6">
                  <label className='block mb-2'>Description*</label>
                  <textarea name='body' className='w-full p-2 border rounded' placeholder='Enter post description' required
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                  ></textarea>
                </div>

                <div className="block md:flex space-x-6">
                  <div className='my-2 w-full'>
                    <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700">Attachment <span className='text-green-400'>(optional)</span> </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col p-2 items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100  ">
                        <div className="flex flex-col items-center justify-center">
                          {!post_file ?

                            <>
                              <IoMdCloudUpload className=" text-5xl mb-4 text-gray-500 dark:text-gray-400 hover:text-orange-500" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                            </>

                            : (
                              <div className="relative w-full">  {/* h-48 height of container, fixed h-48 here (inherits from label) */}
                                <img
                                  className="w-full rounded-lg object-contain"
                                  src={postFilePreviewUrl}
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

                          <input name='post_file' id="dropzone-file" type="file" className='hidden'
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

          {(!isAddPost) &&
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
                rowsPerPageOptions={[10, 20, 30, 40, 50, posts.length]}
              >
                <Column body={postBodyTemplate} sortable sortField='title' header='Post' ></Column>
                <Column field='created_on' align={'center'} sortable header='Posted' ></Column>
              </DataTable>
              {/* </div> */}
            </div>
          }

        </div>
      </div>

      {(!isAddPost) ?
        <NavLink
          onClick={() => setIsAddPost(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
          <IoMdAddCircle className='text-4xl' />
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddPost(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-4xl' />
        </NavLink>
      }

    </>
  )
}

export default ManagePosts


