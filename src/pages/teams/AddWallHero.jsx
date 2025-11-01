
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


const AddWallHero = () => {
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    const [teams, setTeamList] = useState([]);
    const [filePreviewUrl, setFilePreviewUrl] = useState('');

    const [fileToUpload, setFile] = useState(null);
    const [team_id, setTeamId] = useState('');
    const [file_category, setFileCategory] = useState('');

    useEffect(() => {
        const get_teams = async () => {
            const teams_list = await fetch(`${apiUrl}/teams`);
            const data = await teams_list.json();
            console.log("Teams_list: ", data.teams);
            setTeamList(data.teams);
        }

        get_teams();
    }, [apiUrl]);

    // Validating the file type
    const handleFileChange = (event) => {
        const selected_file = event.target.files[0];
        if (selected_file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (allowedTypes.includes(selected_file.type)) {
                setFile(selected_file);
                setFilePreviewUrl(URL.createObjectURL(selected_file));  // Create preview URL
                console.log('File file:', selected_file);
            } else {
                toast.error('Please select a valid image file (JPEG or JPG)');
                setFile(null);
                filePreviewUrl('');    // Reset preview URL

            }
        }
    };

    // clearing the image url
    const removeFile = () => {
        setFile(null);
        setFilePreviewUrl('');
        const fileInput = document.getElementById('dropzone-file');
        if (fileInput) {
            fileInput.value = '';  // Reset file input
        }
        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);  // Clean up memory
        }
    };

    // capture and set data
    const submitFormData = async (e) => {
        e.preventDefault();

        // initialise FormData and append the object with its key
        const formData = new FormData();

        /**
         * If an attachment was added, upload it too
         */
        if (fileToUpload) {
            formData.append('fileToUpload', fileToUpload);
        }
        formData.append('team_id', team_id);
        formData.append('file_category', file_category);

        //Send data to the backend
        const add_team_wallhero = await fetch(`${apiUrl}/add_wallhero`, {
            method: 'POST',
            body: formData
        });

        const response_data = await add_team_wallhero.json();

        // console.log("CI_3 Response: ", response_data);

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
            <div className='grow p-2 h-full md:h-screen lg:h-screen bg-gray-100 ml-16 md:ml-0'>
                <div className="items-center my-2">
                    <h2 className="text-sm text-left text-blue-900 font-bold my-auto">TEAM WALL-HERO MANAGEMENT</h2>
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

                                <div className='w-full'>
                                    <label className='block mb-1 text-sm font-medium text-gray-700'>Team*</label>

                                    <select
                                        name="team_id"
                                        value={team_id}
                                        onChange={(e) => setTeamId(e.target.value)}
                                        className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                        required
                                    >
                                        <option disabled defaultValue={''} value=''>Choose...</option>
                                        {teams.map((team) => (
                                            <option key={team.id} value={team.id}>{team.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='w-full my-4 md:my-0 lg:my-0'>
                                    <label className='block mb-1 text-sm font-medium text-gray-700'>Team Name*</label>

                                    <select
                                        name="file_category"
                                        value={file_category}
                                        onChange={(e) => setFileCategory(e.target.value)}
                                        className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                        required
                                    >   
                                        <option disabled defaultValue={''} value=''>Choose...</option>
                                        <option value='wallpaper'>Wallpaper Image</option>
                                        <option value='hero'>Hero Image</option>
                                    </select>
                                </div>

                            </div>

                            <div className="block md:flex space-x-6">
                                <div className='my-2 w-full h-fit'>
                                    <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700">File</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col p-2 items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100  ">
                                            <div className="flex flex-col items-center justify-center">
                                                {!fileToUpload ?

                                                    <>
                                                        <IoMdCloudUpload className=" text-5xl mb-4 text-gray-500 dark:text-gray-400 hover:text-orange-500" />
                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                                                    </>

                                                    : (
                                                        <div className="relative w-full">  {/* h-48 height of container, fixed h-48 here (inherits from label) */}
                                                            <img
                                                                className="w-full rounded-lg object-contain"
                                                                src={filePreviewUrl}
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

                                                <input name='fileToUpload' id="dropzone-file" type="file" className='hidden'
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



                </div>
            </div>

            <NavLink
                to='/teams'
                className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
                <CustomTooltip content={'Cancel'}>
                    <RxCross1 className='text-4xl' />
                </CustomTooltip>
            </NavLink>

        </>
    )
}

export default AddWallHero