import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi';
import { useLoaderData } from 'react-router-dom';
import { IoMdCloudUpload } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { BsFillTrashFill } from 'react-icons/bs';


const PlayerPage = () => {
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Get the fixture data from the loader
    const selected_player = useLoaderData();
    console.log('Selected_player', selected_player);

    const [isUpdatePlayer, setIsUpdatePlayer] = useState(false);

    const [profilePreviewUrl, setProfilePreviewUrl] = useState('');
    const [profile, setProfile] = useState(null);
      const [teams, setTeamList] = useState([]);

    const [team_id, setTeamId] = useState('');
    const [playerName, setPlayerName] = useState('');

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
                setProfile(selected_file);
                setProfilePreviewUrl(URL.createObjectURL(selected_file));  // Create preview URL
                console.log('Selected File:', selected_file);
            } else {
                toast.error('Please select a valid image file (JPEG or JPG)');
                profile(null);
                profilePreviewUrl('');

            }
        }
    };

    // clearing the image url
    const removeFile = () => {
        setProfile(null);
        setProfilePreviewUrl('');
        const fileInput = document.getElementById('dropzone-file');
        if (fileInput) {
            fileInput.value = '';  // Reset file input
        }
        if (postFilePreviewUrl) {
            URL.revokeObjectURL(postFilePreviewUrl);  // Clean up memory
        }
    };

    // Deleting fixture function
    const deletePlayer = async (hashing) => {
        if (window.confirm('Are you sure you want to delete this record? This process is irreversible!')) {
            const formData = new FormData();
            formData.append('file_to_delete_link', selected_player.image);

            const responseref = await fetch(`${apiUrl}/players/delete/${hashing}`, {
                method: 'POST',
                body: formData
            });

            const delete_response = await responseref.json();
            console.log('Delete respo', delete_response);

            if (delete_response.status == '200') {
                toast.success(delete_response.message);
                setTimeout(() => {
                    navigate('/players');
                }, 2000);
            } else {
                toast.error(delete_response.message);
                return;
            }
        }
    };

    useEffect(() => {
        if (selected_player) {
            setTeamId(selected_player.team_id);
            setPlayerName(selected_player.player_name);
            setProfile(selected_player.image);
            setProfilePreviewUrl(selected_player.image);
        }
    }, [apiUrl, selected_player]);

    // capture and set data
    const submitFormData = async (e) => {
        e.preventDefault();

        // initialise FormData and append the object with its key
          const formData = new FormData();

        // if the a new file is selected then send the old file link along
        formData.append('old_post_file_link', selected_player.image);

          /**
           * If an attachment was added, upload it too
           */
          if (profile) {
            formData.append('profile', profile);
          }
          formData.append('team_id', team_id);
          formData.append('player_name', playerName);

          //Send data to the backend
          const add_player = await fetch(`${apiUrl}/players/update/${selected_player.hashing}`, {
            method: 'POST',
            body: formData
          });

          const response_data = await add_player.json();

        //   console.log("CI_3 Response: ", response_data);

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
            <div className='grow p-2 h-full md:h-screen lg:h-full bg-gray-100 ml-16 md:ml-0 mb-20'>
                <div className="items-center my-2">
                    <div className="text-md text-left text-gray-500 font-semibold my-auto">
                        <NavLink to='/dashboard' className=' hover:text-blue-800' >
                            Home/
                        </NavLink>
                        <span>
                            <NavLink to='/players' className=' hover:text-blue-800' >
                                players
                            </NavLink>
                            /{(!isUpdatePlayer) ? 'details' : 'update'}
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

                    {(isUpdatePlayer) &&
                        <div className="flex border-0 w-full">
                            <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                                <div className="block md:flex space-x-6">
   
                                    <div className="block w-fit md:flex">
                                        <div className='my-2 w-full'>
                                            <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700">Profile Image <span className='text-green-400'>(optional)</span> </label>
                                            <div className="flex items-center justify-center w-full">
                                                <label className="flex flex-col p-2 items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100  ">
                                                    <div className="flex flex-col items-center justify-center">
                                                        {!profile ?

                                                            <>
                                                                <IoMdCloudUpload className=" text-5xl mb-4 text-gray-500 dark:text-gray-400 hover:text-orange-500" />
                                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                                                            </>

                                                            : (
                                                                <div className="relative w-full">
                                                                    <img
                                                                        className="w-fit rounded-lg object-contain h-50"
                                                                        src={profilePreviewUrl}
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

                                                        <input name='profile' id="dropzone-file" type="file" className='hidden'
                                                            accept="image/jpeg,image/png, image/jpg"
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                </label>
                                            </div>

                                        </div>
                                    </div>


                                    <div className="block space-x-6 w-full">
                                        <div className='w-full my-2'>
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

                                        <div className='w-full my-4'>
                                            <label className='block mb-1 text-sm font-medium text-gray-700'>Player Name*</label>

                                            <input
                                                name="playerName"
                                                value={playerName}
                                                onChange={(e) => setPlayerName(e.target.value)}
                                                className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                            />
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

                    {(!isUpdatePlayer) &&
                        <div className="flex border-0 w-full ">
                            <div className=' w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4 justify-center items-center' >

                                <div className='my-6'>
                                    <div className="block md:flex space-x-4">
                                        <div className='w-full md:w-40/100'>
                                            <img src={selected_player.image} alt="" className='w-full rounded' />
                                        </div>

                                        <div className="font-bold text-sm w-full md:w-60/100 min-[450px]:text-md ">
                                            <div className="flex w-full">
                                                <span className='font-bold text-2xl text-blue-800 overflow-hidden'>{selected_player.player_name}</span>
                                            </div>

                                            <div className="flex w-full text-lg my-2">
                                                <img src={selected_player.logo} className='h-5 w-5 me-1' alt="" />
                                                <p className='font-light break-words overflow-hidden'> {selected_player.team_name} FC</p>
                                            </div>

                                            <div className="flex w-full text-lg my-2">
                                                <p className='font-light break-words overflow-hidden'>Goals: {selected_player.total_goals}                                                    
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>

            {(!isUpdatePlayer) ?
                <>
                    <NavLink
                        onClick={() => setIsUpdatePlayer(true)}
                        className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
                        <BiPencil className='text-lg md:text-4xl' />
                    </NavLink>

                    <NavLink
                        onClick={() => deletePlayer(selected_player.hashing)}
                        className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed rounded-full 
              bottom-7 right-15 md:right-25 hover:bg-red-800 flex items-center justify-center">
                        <BsFillTrashFill className='text-lg md:text-4xl' />
                    </NavLink>
                </>
                :
                <NavLink
                    onClick={() => setIsUpdatePlayer(false)}
                    className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
                    <RxCross1 className='text-lg md:text-4xl' />
                </NavLink>
            }

        </>
    )
}


// Fetch and export the fixture data using dataloader
const playerLoader = async ({ params }) => {
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
    // The id parameter used in the App.js file should be the same as that used here
    const response = await fetch(`${apiUrl}/players/${params.hashing}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch post data');
    }
    // console.log(params.hashing);
    return data.player;
};

export { PlayerPage as default, playerLoader }


