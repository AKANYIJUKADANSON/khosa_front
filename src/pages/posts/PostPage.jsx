import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiCalendar, BiPencil, BiTrash } from 'react-icons/bi';
import { useLoaderData } from 'react-router-dom';
import { IoMdAddCircle, IoMdCloudUpload } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import CustomTooltip from '../../components/CustomTooltip';
import { IoClose } from 'react-icons/io5';
import { BsFillTrashFill, BsPencil } from 'react-icons/bs';


const PostPage = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  // Get the fixture data from the loader
  const selected_post = useLoaderData();
  console.log('Selected_post', selected_post);
  
  const [isUpdatePost, setIsUpdatePost] = useState(false);
  const [current_season, setCurrentSeason] = useState([]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [post_file, setPostFile] = useState('');
  const [post_type, setPostType] = useState('');
  const [season_id, setSeasonId] = useState('');
  const [created_on, setCreatedOn] = useState('');

  const [postFilePreviewUrl, setPostFilePreviewUrl] = useState('');

  useEffect(() => {
    const get_current_season = async () => {
      const current_season = await fetch(`${apiUrl}/current_season`);
      const data = await current_season.json();
      console.log("current_season: ", data.current_season);
      setCurrentSeason(data.current_season);
    }

    get_current_season();
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

  // Deleting fixture function
  const deletePost = async (hashing) => {
    if (window.confirm('Are you sure you want to delete this record? This process is irreversible!')) {
        const formData = new FormData();
        formData.append('file_to_delete_link', selected_post.attachment);
        
        const responseref = await fetch(`${apiUrl}/posts/delete/${hashing}`, {
          method: 'POST',
          body: formData
        });

        const delete_response = await responseref.json();
        console.log('Delete respo', delete_response);

        if (delete_response.status == '200') {
          toast.success(delete_response.message);
          setTimeout(() => {
              navigate('/posts');
          }, 2000);
        } else {
          toast.error(delete_response.message);
          return;
        }
    }
  };


  useEffect(() => {
    if (selected_post) {
      setSeasonId(selected_post.season_id);
      setTitle(selected_post.title);
      setBody(selected_post.body);
      setPostType(selected_post.type);
      setCreatedOn(selected_post.created_on);
      setPostFile(selected_post.attachment);
      setPostFilePreviewUrl(selected_post.attachment);
    }
  }, [apiUrl,selected_post ]);

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    // const dt = {
    //   'post_file': post_file,
    //   'title': title,
    //   'body': body,
    //   'created_on': created_on,
    //   'post_type': post_type,
    //   'season_id': season_id,
    // }

    // console.log("Updated_data:", dt);

    // initialise FormData and append the object with its key
    const formData = new FormData();

    // if the a new file is selected then send the old file link along
    formData.append('old_post_file_link', selected_post.attachment);

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
    const update_post = await fetch(`${apiUrl}/posts/update/${selected_post.hashing}`, {
      method: 'POST',
      body: formData
    });

    const response_data = await update_post.json();

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
      <div className='grow p-2 h-full md:h-screen lg:h-full bg-gray-100 ml-16 md:ml-0 mb-20'>
        <div className="items-center my-2">
          <div className="text-md text-left text-gray-500 font-semibold my-auto">
            <NavLink to='/dashboard' className=' hover:text-blue-800' >
            Home/
            </NavLink>
            <span> 
              <NavLink to='/posts' className=' hover:text-blue-800' >
              posts
              </NavLink>
              /{(!isUpdatePost) ? 'details' : 'update' }
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

          {(isUpdatePost) &&
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
                              <div className="relative w-full"> 
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
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>UPDATE</button>
                  </div>
                </div>

              </form>

            </div>
          }

          {(!isUpdatePost) &&
            <div className="flex border-0 w-full ">
              <div className=' w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4 justify-center items-center' >

                <div className='flex justify-left text-sm items-center'>
                  <div className="block min-[450px]:flex space-x-4">
                    <div className='font-light md:text-md'>
                      Season: <span className='text-teal-900 text-md font-bold'>{selected_post.season}</span>
                    </div>

                    <div className='font-light md:text-md'>
                      Posted On: <span className='text-teal-900 text-md font-bold'>{selected_post.created_on}</span>
                    </div>

                  </div>
                </div>
                <hr />

                <div className='my-6'>

                  <div className="block md:flex space-x-4">  
                    <div className='w-full md:w-60/100'>
                      <img src={selected_post.attachment} alt="" className='w-full rounded' />
                    </div>

                    <div className="font-bold text-sm w-full md:w-40/100 min-[450px]:text-md ">
                      <div className="flex w-full">
                        <span className='font-bold text-lg text-blue-800 overflow-hidden'>{selected_post.title}</span>
                      </div>

                      <div className="flex w-full my-4">
                        <p className='font-light break-words overflow-hidden'>{selected_post.body}</p>
                      </div>
                    </div>
                  </div>

                  <hr className='mt-10' />

                  <div className='block min-[450px]:flex text-sm justify-between'>
                    <div className="">
                      <span className='font-bold text-gray-400 italic'>Type: {selected_post.type}</span>
                    </div>

                    <div className="">
                      {selected_post.author ? 
                        <span className='font-bold text-gray-400 italic '>Author: {selected_post.author}</span>
                      : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

        </div>
      </div>

      {(!isUpdatePost) ?
      <>
          <NavLink
            onClick={() => setIsUpdatePost(true)}
            className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
            <BiPencil className='text-lg md:text-4xl' />
          </NavLink>

          <NavLink
            onClick={()=> deletePost(selected_post.hashing)}
            className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full 
              bottom-7 right-15 md:right-25 hover:bg-red-800 flex items-center justify-center">
            <BsFillTrashFill className='text-lg md:text-4xl' />
          </NavLink>
        </>
        :
        <NavLink
          onClick={() => setIsUpdatePost(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-lg md:text-4xl' />
        </NavLink>
      }

    </>
  )
}


// Fetch and export the fixture data using dataloader
const postLoader = async ({ params }) => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
  // The id parameter used in the App.js file should be the same as that used here
  const response = await fetch(`${apiUrl}/posts/${params.hashing}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error('Failed to fetch post data');
  }
  // console.log(params.hashing);
  return data.post;
};

export { PostPage as default, postLoader }


