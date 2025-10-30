
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiCalendar } from 'react-icons/bi';
import { IoMdAddCircle, IoMdCloudUpload } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import CustomTooltip from '../../components/CustomTooltip';
import { IoClose } from 'react-icons/io5';
import { BsTicket } from 'react-icons/bs';
import { CgDockRight } from 'react-icons/cg';
import { FaCheckCircle } from 'react-icons/fa';


const ManageTeams = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = new useNavigate();

  const [isAddTeam, setIsAddTeam] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');

  const [teamsList, setTeamList] = useState([]);
  const [current_season, setCurrentSeason] = useState([]);

  const [season, setSeason] = useState('');
  const [team_name, setTeamName] = useState('');
  const [est, setEst] = useState('');
  const [about, setAbout] = useState('');

  const [logo, setLogo] = useState(null);



  useEffect(() => {

    const get_teams = async () => {
      const teams_list = await fetch(`${apiUrl}/teams`);
      const data = await teams_list.json();
      console.log("Teams_list: ", data.teams);
      setTeamList(data.teams);
    }

    const get_current_season = async () => {
      const current_season = await fetch(`${apiUrl}/current_season`);
      const data = await current_season.json();
      console.log("current_season: ", data.current_season);
      setCurrentSeason(data.current_season);
    }

    get_current_season();
    get_teams();
  }, [apiUrl]);

  // Validating the file type
  const handleLogoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(file.type)) {
        setLogo(file);
        setLogoPreviewUrl(URL.createObjectURL(file));  // Create preview URL
        console.log('File logo:', file);
      } else {
        toast.error('Please select a valid image file (JPEG or JPG)');
        setLogo(null);
        logoPreviewUrl('');    // Reset preview URL

      }
    }
  };

  // clearing the image url
  const removeLogo = () => {
    setLogo(null);
    setLogoPreviewUrl('');
    const fileInput = document.getElementById('dropzone-file');
    if (fileInput) {
      fileInput.value = '';  // Reset file input
    }
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);  // Clean up memory
    }
  };

  const initiateStandings = async () => {
    //Send data to the backend
    const init_team_standings = await fetch(`${apiUrl}/init_standings`);
    const response = await init_team_standings.json();
    console.log('Initialization Status:', response);

    if (response.status === '200') {
      toast.success(response.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(response.message);
      return;
    }


  }

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    // initialise FormData and append the object with its key
    const formData = new FormData();

    /**
     * If an attachment was added, upload it too
     */
    if (logo) {
      formData.append('logo', logo);
    }

    // Append all data to the formdata array
    formData.append('team_name', team_name);
    formData.append('established', est);
    formData.append('about', about);

    //Send data to the backend
    const add_team_data = await fetch(`${apiUrl}/add_team`, {
      method: 'POST',
      body: formData
    });

    const response_data = await add_team_data.json();

    // console.log("CI_3 Response: ", response_data);  

    if (response_data.status === '200') {
      toast.success(response_data.message);

      setTimeout(() => {
        navigate('/wallhero');
      }, 3000);
    } else {
      toast.error(response_data.message);
      return;
    }

  }

  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = teamsList.map((team) => ({
    ...team,
    combinedColumns: `
            ${team.name} 
            ${team.logo}
            ${team.hero_img}
            ${team.est}
            ${team.about}
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

  const teamBodyTemplate = (row) => {

    return (
      <>

        <div className=''>
          <div className="space-x-5">
            <div className='flex font-extralight'>
              <img src={row.logo} alt="" className='h-9 w-9 rounded-full' />
            </div>

            <div className='flex font-extralight'>
              Team: <span className='mx-2'>{row.name}</span>
            </div>

            <div className='font-extralight'>
              Est: {row.est}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Set the status bg and text color
  const activeStateColor = (state) => {
    if (state == '1') {
      return 'bg-green-600 text-white';
    } else if (state === '0') {
      return 'bg-red-300 text-red-800';
    }
  }

  // Ticket column(title, description, email and phone) template
  const teamStateBodyTemplate = (row) => {
    return (
      <>
        <span className={`p-1 px-3 rounded text-sm font-medium ${activeStateColor(row.is_active)}
                  `}>
          {row.is_active === '1' ? 'Active' : 'Inactive'}
        </span>
      </>
    )
  }

  return (
    <>
      <div className='grow p-2 h-full md:h-screen lg:h-screen bg-gray-100 ml-16 md:ml-0'>
        <div className="items-center my-2">
          {(!isAddTeam) ?
            <h2 className="text-md text-left text-blue-900 font-bold my-auto">TEAMS</h2>
            :
            <h2 className="text-md text-left text-blue-900 font-bold my-auto">ADD TEAM</h2>
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

          {(isAddTeam) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-md ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                <div className="block md:flex space-x-6">

                  <div className='w-full'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Season*</label>

                    <select
                      name="season"
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled defaultValue={''} value=''>Choose...</option>
                      <option value={current_season.id}>Season {current_season.season}</option>
                    </select>
                  </div>

                  <div className='w-full my-4 md:my-0 lg:my-0'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Team Name*</label>

                    <input
                      name="team_name"
                      value={team_name}
                      onChange={(e) => setTeamName(e.target.value)}
                      type='text'
                      className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                    />
                  </div>

                  <div className='w-full my-4 md:my-0 lg:my-0'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Est*</label>
                    <input
                      type='number'
                      name='est'
                      value={est}
                      onChange={(e) => setEst(e.target.value)}
                      className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                    />
                  </div>

                </div>

                <div className="block md:flex space-x-6">
                  <div className='w-full'>
                    <div className='my-2 md:my-0 lg:my-0'>
                      <label className='block text-sm font-medium text-gray-700'>About<span className='text-red-500 font-bold'>*</span></label>

                      <textarea name='description' className='w-full p-4 border rounded'
                        required
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  {/* 
                    ------------------------------------------------------------------------------
                    -----------------------------------| Logo Image |-----------------------------
                    ------------------------------------------------------------------------------
                  */}
                  <div className='my-2 w-full h-fit'>
                    <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700">Logo</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col p-2 items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100  ">
                        <div className="flex flex-col items-center justify-center">
                          {!logo ?

                            <>
                              <IoMdCloudUpload className=" text-5xl mb-4 text-gray-500 dark:text-gray-400 hover:text-orange-500" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                            </>

                            : (
                              <div className="relative w-full">  {/* h-48 height of container, fixed h-48 here (inherits from label) */}
                                <img
                                  className="w-fit h-52 rounded-lg object-contain"
                                  src={logoPreviewUrl}
                                  alt="Preview"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();      // Prevent label click from triggering file select
                                    e.stopPropagation();     // Stop event bubbling
                                    removeLogo();
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-5 shadow-lg border-2 border-white"
                                >
                                  <IoClose size={20} />
                                </button>
                              </div>
                            )

                          }

                          <input name='logo' id="dropzone-file" type="file" className='hidden'
                            accept="image/jpeg,image/png, image/jpg"
                            onChange={handleLogoFileChange}
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

          {(!isAddTeam) &&
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
              <DataTable value={data}
                ref={data}
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
                rowsPerPageOptions={[10, 20, 30, 40, 50, teamsList.length]}
              >
                <Column body={teamBodyTemplate} header='Team'></Column>
                <Column field='about' header='About'></Column>
                <Column body={teamStateBodyTemplate} header='Status'></Column>


              </DataTable>
            </div>
          }

        </div>

      </div>

      <div className="z-10 fixed bottom-20 right-10 flex flex-row-reverse gap-3 items-center ">
        <div className="transform transition-all duration-300 ease-in-out -translate-x-25 hover:scale-3d">
          <NavLink
            onClick={initiateStandings}
            className="bg-blue-800 text-white p-2 md:p-2 shadow-lg fixed transition-all  rounded-full hover:bg-teal-700 flex items-center justify-center">
            <FaCheckCircle className='text-3xl' />
          </NavLink>
        </div>

        <div className="transform transition-all duration-300 ease-in-out -translate-x-6 hover:scale-3d">

          {(!isAddTeam) ?
            <NavLink
              onClick={() => setIsAddTeam(true)}
              className="bg-teal-500 text-white p-2 md:p-2 shadow-lg fixed  rounded-full hover:bg-teal-700 flex items-center justify-center">
                <IoMdAddCircle className='text-3xl' />
            </NavLink>
            :
            <NavLink
              onClick={() => setIsAddTeam(false)}
              className="bg-red-500 text-white p-2 md:p-2 shadow-lg fixed  rounded-full hover:bg-red-700 flex items-center justify-center">
                <RxCross1 className='text-3xl' />
            </NavLink>
          }

        </div>
      </div>
    </>
  )
}

export default ManageTeams