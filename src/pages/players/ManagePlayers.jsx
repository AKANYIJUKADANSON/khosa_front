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


const ManagePlayers = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [teams, setTeamList] = useState([]);
  const [playersList, setPlayersList] = useState([]);
  const [isAddPlayer, setIsAddPlayer] = useState(false);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState('');

  const [profile, setProfile] = useState(null);
  const [team_id, setTeamId] = useState('');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const get_teams = async () => {
      const teams_list = await fetch(`${apiUrl}/teams`);
      const data = await teams_list.json();
      console.log("Teams_list: ", data.teams);
      setTeamList(data.teams);
    }

    const get_players = async () => {
      const players_list = await fetch(`${apiUrl}/players`);
      const data = await players_list.json();
      console.log("Players_list: ", data.players);
      setPlayersList(data.players);
    }

    get_teams();
    get_players();
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
        setProfile(null);
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
    if (profilePreviewUrl) {
      URL.revokeObjectURL(profilePreviewUrl);  // Clean up memory
    }
  };


  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = playersList.map((player) => ({
    ...player,
    combinedColumns: `
                  ${player.player_name} 
                  ${player.team_name} 
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

  const playerBodyTemplate = (row) => {

    return (
      <>
      <NavLink to={`/players/${row.hashing}`} className="hover:text-blue-800 cursor-pointer" >
        <div className='text-sm font-light'>
          <div className="inline-flex items-center">
            <img src={row.logo} className="w-7 h-7 md:w-10 md:h-10 mx-2 rounded-full" />
            <span className="text-sm font-bold">{row.player_name}</span>
          </div>
        </div>
      </NavLink>
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
    if (profile) {
      formData.append('profile', profile);
    }
    formData.append('team_id', team_id);
    formData.append('player_name', playerName);

    //Send data to the backend
    const add_player = await fetch(`${apiUrl}/add_player`, {
      method: 'POST',
      body: formData
    });

    const response_data = await add_player.json();

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
          {(!isAddPlayer) ?
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">PLAYERS</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD TEAM PLAYER</h2>
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

          {(isAddPlayer) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-sm ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">

                  {/* <div className="w-fit"> */}
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
                                <div className="relative w-full">  {/* h-48 height of container, fixed h-48 here (inherits from label) */}
                                  <img
                                    className="w-fit rounded-lg object-contain h-50"
                                    src={profilePreviewUrl}
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

                            <input name='profile' id="dropzone-file" type="file" className='hidden'
                              accept="image/jpeg,image/png, image/jpg"
                              onChange={handleFileChange}
                            />
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>
                  {/* </div> */}


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
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>SUBMIT</button>
                  </div>
                </div>

              </form>

            </div>
          }

          {(!isAddPlayer) &&
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
                rowsPerPageOptions={[10, 20, 30, 40, 50, playersList.length]}
              >
                <Column body={playerBodyTemplate} sortable sortField='player_name' header='Player' ></Column>
                <Column field='total_goals' align={'center'} sortable header='Goals' ></Column>
              </DataTable>
              {/* </div> */}
            </div>
          }

        </div>
      </div>

      {(!isAddPlayer) ?
        <NavLink
          onClick={() => setIsAddPlayer(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
          <IoMdAddCircle className='text-4xl' />
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddPlayer(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <RxCross1 className='text-4xl' />
        </NavLink>
      }

    </>
  )
}

export default ManagePlayers