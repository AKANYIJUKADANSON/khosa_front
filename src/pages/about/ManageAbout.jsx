import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { IoMdAddCircle, IoMdCloudUpload } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { NavLink, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BiPencil } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

const ManageAbout = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const about = useLoaderData();

  const [isUpdate, setIsUpdate] = useState(false);
  const [updatedAbout, setUpdatedAbout] = useState('');
  const [aboutPreviewUrl, setAboutPreviewUrl] = useState('');
  const [about_file, setAboutFile] = useState(null);

  // Validating the file type
  const handleFileChange = (event) => {
    const selected_file = event.target.files[0];
    if (selected_file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(selected_file.type)) {
        setAboutFile(selected_file);
        setAboutPreviewUrl(URL.createObjectURL(selected_file));  // Create preview URL
        console.log('Selected File:', selected_file);
      } else {
        toast.error('Please select a valid image file (JPEG or JPG)');
        setAboutFile(null);
        aboutPreviewUrl('');

      }
    }
  };

  // clearing the image url
  const removeFile = () => {
    setAboutFile(null);
    setAboutPreviewUrl('');
    const fileInput = document.getElementById('dropzone-file');
    if (fileInput) {
      fileInput.value = '';  // Reset file input
    }
    if (aboutPreviewUrl) {
      URL.revokeObjectURL(aboutPreviewUrl);  // Clean up memory
    }
  };

  useEffect(() => {
    if(about){
      setUpdatedAbout(about.about);
      setAboutFile(about.logo)
      setAboutPreviewUrl(about.logo);
    }
  }, [about]);

  const submitFormData = async (e) => {
      e.preventDefault();
  
      const dt = {
        'about_file': about_file,
        'about': updatedAbout,
      }
  
      console.log("Updated_data:", dt);
  
      const formData = new FormData();
  
      // if the a new file is selected then send the old file link along
      formData.append('old_post_file_link', about.logo);
      if (about_file) {
        formData.append('about_file', about_file);
      }
      formData.append('about', updatedAbout);
      const update_about = await fetch(`${apiUrl}/about/update`, {
        method: 'POST',
        body: formData
      });
  
      const response_data = await update_about.json();
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
      <div className={`grow p-2 h-full md:h-screen lg:h-screen mb-5 bg-gray-100 ml-16 md:ml-0`}>
        <div className="items-center my-2">
          {(!isUpdate) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ABOUT</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">UPDATE</h2>
          }
        </div>


        {(isUpdate) &&
          <div className="bg-gray-100 m-auto pb-10">

            <form onSubmit={submitFormData} action="" method="post" className='bg-white'>
              <div className=" block sm:block md:flex gap-2">


                <div className="md:w-40/100 bg-white  rounded">
                  <div className='my-2 w-full px-4'>
                    <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700">Logo </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col p-2 items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100  ">
                        <div className="flex flex-col items-center justify-center">
                          {!about_file ?

                            <>
                              <IoMdCloudUpload className=" text-5xl mb-4 text-gray-500 dark:text-gray-400 hover:text-orange-500" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                            </>

                            : (
                              <div className="relative w-full">  {/* h-48 height of container, fixed h-48 here (inherits from label) */}
                                <img
                                  className="w-full rounded-lg object-contain"
                                  src={aboutPreviewUrl}
                                  
                                  alt="Preview"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFile();
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-5 shadow-lg border-2 border-white"
                                >
                                  <IoClose size={20} />
                                </button>
                              </div>
                            )

                          }

                          <input name='about_file' id="dropzone-file" type="file" className='hidden'
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleFileChange}
                          />
                        </div>
                      </label>
                    </div>

                  </div>
                </div>

                <main className='md:w-60/100 md:mb-0 bg-white rounded-md whitespace-normal break-all'>
                  <div className="p-2">
                    <textarea name='updatedAbout' className='w-full p-2 border rounded' cols="30" rows="15" required
                      value={updatedAbout}
                      onChange={(e) => setUpdatedAbout(e.target.value)}
                    >
                    </textarea>
                  </div>
                </main>
              </div>

              <div className='m-5 pb-10'>
                <div className='space-x-5 my-2 flex justify-start'>
                  <button type='submit' className='cursor-pointer px-4 py-2 bg-yellow-400 hover:bg-teal-700 text-white rounded font-light'>UPDATE</button>
                </div>
              </div>
            </form>

          </div>
        }

        {(!isUpdate) &&
          <div className="bg-gray-100 m-auto pb-10">
            <div className=" block sm:block md:flex gap-2">

              <div className="md:w-40/100 bg-white whitespace-normal break-all rounded">
                <div className="flud">
                  <img src={about.logo} alt="" />
                </div>
              </div>

              <main className='md:w-60/100 md:mb-0 bg-white rounded-md whitespace-normal break-all'>
                <div className="p-2">
                  <p>{about.about}</p>
                </div>
              </main>
            </div>
          </div>
        }

        {(!isUpdate) ?
          <NavLink
            onClick={() => setIsUpdate(true)}
            className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
            <BiPencil className='text-4xl' />
          </NavLink>
          :
          <NavLink
            onClick={() => setIsUpdate(false)}
            className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
            <RxCross1 className='text-4xl' />
          </NavLink>
        }

      </div>
    </>
  )
}

// Fetch and export the fixture data using dataloader
const aboutLoader = async () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
  // The id parameter used in the App.js file should be the same as that used here
  const response = await fetch(`${apiUrl}/about`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error('Failed to fetch about data');
  }
  // console.log(params.hashing);
  return data.about;
};

export { ManageAbout as default, aboutLoader }