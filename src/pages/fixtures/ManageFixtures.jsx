import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { BiCalendar } from 'react-icons/bi';
import { IoMdAddCircle } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import CustomTooltip from '../../components/CustomTooltip';


const ManageFixtures = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isAddFixture, setIsAddFixture] = useState(false);
  
  const [fixtures, setFixtures] = useState([]);
  const [teamsList, setTeamList] = useState([]);
  const [current_season, setCurrentSeason] = useState([]);
  const [matchdayList, setMatchdayList] = useState([]);

  const [season, setSeason] = useState('');
  const [matchday, setMatchday] = useState('');
  const [match_date, setMatchDate] = useState('');
  const [home_team, setHomeTeam] = useState('');
  const [away_team, setAwayTeam] = useState('');

  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [meridian, setMeridian] = useState('');






  useEffect(() => {
    const get_fixtures = async () => {
      const fixtures = await fetch(`${apiUrl}/fixtures`);
      const data = await fixtures.json();
      // console.log("Match fixtures: ", data.fixtures);
      setFixtures(data.fixtures);
    }

    const get_teams = async () => {
      const teams_list = await fetch(`${apiUrl}/teams`);
      const data = await teams_list.json();
      // console.log("Teams_list: ", data.teams);
      setTeamList(data.teams);
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
    get_fixtures();
    get_teams();
  }, [apiUrl]);

  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    const match_time = hours + ':' + minutes +  meridian;

    // const match_result_data = {
    //   season: season,
    //   matchday: matchday,
    //   match_date: match_date,
    //   match_time: match_time,
    //   home_team: home_team,
    //   away_team: away_team,
    // }

    // console.log('Fixture Result Data:', match_result_data);

    // initialise FormData and append the object with its key
    const formData = new FormData();

    // Append all data to the formdata array
    formData.append('season', season);
    formData.append('matchday', matchday);
    formData.append('match_date', match_date);
    formData.append('match_time', match_time);

    formData.append('home_team', home_team);
    formData.append('away_team', away_team);

    //Send data to the backend
    const add_fixture_data = await fetch(`${apiUrl}/add_fixture`, {
      method: 'POST',
      body: formData
    });

    const response_data = await add_fixture_data.json();

    // console.log("CI_3 Response: ", response_data);  

    if (response_data.status === '200') {
      toast.success(response_data.message);
      window.location.reload();
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

  const data = fixtures.map((fixture) => ({
    ...fixture,
    combinedColumns: `
            ${fixture.home_team} 
            ${fixture.away_team}
            ${fixture.date}
            ${fixture.matchday}
            ${fixture.season}
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

        <div className='flex justify-center items-center my-2'>
          <div className="block sm:flex md:flex space-x-5">
            <div className='font-extralight'>
              Matchday: {row.matchday}
            </div>

            <div className='font-extralight'>
              Date: {row.date}
            </div>
          </div>
        </div>

        <div className='flex justify-center items-center'>

          <div className='text-sm font-light text-center'>
            {/* <img src="" alt="" /> */}
            <span className='font-bold'>{row.home_team}</span><br />
          </div>

          <div className="font-bold text-red-600 mx-2 text-center">
            <span className='font-bold'>vs</span><br />
            
          </div>

          <div className='text-sm font-light text-center'>
            {/* <img src="" alt="" /> */}
            <span className='font-bold'>{row.away_team}</span><br />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='grow p-2 h-full md,lg:h-screen bg-gray-100 ml-16 md:ml-0'>
        <div className="items-center my-2">
          {(!isAddFixture) ?
            <h2 className="text-md text-left text-blue-900 font-bold my-auto">FIXTURES</h2>
            :
            <h2 className="text-md text-left text-blue-900 font-bold my-auto">ADD FIXTURE</h2>
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

          {(isAddFixture) &&
            <div className="flex border-0 w-full">

              <form onSubmit={submitFormData} className='space-y-4 w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

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
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Matchday*</label>

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

                </div>

                <div className="block md:flex space-x-6 mt-10">

                  <div className='w-full my-4 md:my-0 lg:my-0'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Match Date*</label>
                    <input
                      type='date'
                      name='match_date'
                      value={match_date}
                      onChange={(e) => setMatchDate(e.target.value)}
                      className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                    />
                  </div>

                  <div className='w-full my-4 md:my-0 lg:my-0'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Time*</label>

                    <div className="flex">

                      <input
                        name="hours"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        type='number'
                        min={1} max={12}
                        className='w-full mx-2 p-1 border text-center font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' 
                        placeholder='00'
                        required
                      />

                      <input
                        name="minutes"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        type='number'
                        min={0} max={59}
                        className='w-full text-center mx-2 p-1 border font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' 
                        placeholder='00'
                        required
                      />

                      <select
                        name="meridian"
                        value={meridian}
                        onChange={(e) => setMeridian(e.target.value)}
                        className="mt-1 block w-full text-center p-3 border font-bold rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        required
                      > 
                        <option disabled value="">choose...</option>
                        <option value='AM'>PM</option>
                        <option value='PM'>AM</option>
                      </select>
                    </div>
                  </div>

                </div>

                <div className="block md:flex space-x-6 mt-10">

                  <div className='w-full'>
                    <div className='my-2 md:my-0 lg:my-0'>
                      <label className='block text-sm font-medium text-gray-700'>Home Team<span className='text-red-500 font-bold'>*</span></label>

                      <select
                        name="home_team"
                        value={home_team}
                        onChange={(e) => setHomeTeam(e.target.value)}
                        className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <option value="">Choose..</option>
                        {teamsList.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className='w-full'>
                    <div className='my-2 md:my-0 lg:my-0'>
                      <label className='block text-sm font-medium text-gray-700'>Away Team<span className='text-red-500 font-bold'>*</span></label>

                      <select
                        name="away_team"
                        value={away_team}
                        onChange={(e) => setAwayTeam(e.target.value)}
                        className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <option value="">Choose..</option>
                        {teamsList.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                </div>

                <div className='mt-10'>
                  <div className='space-x-5 my-2 flex justify-start'>
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>ADD FIXTURE</button>
                  </div>
                </div>

              </form>

            </div>
          }

          {(!isAddFixture) &&
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
                rowsPerPageOptions={[10, 20, 30, 40, 50, fixtures.length]}
              >
                <Column body={teamBodyTemplate} ></Column>
              </DataTable>
            </div>
          }

        </div>
      </div>

      {(!isAddFixture) ?
        <NavLink
          onClick={() => setIsAddFixture(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
          <CustomTooltip content={'Add Fixture'}>
            <IoMdAddCircle className='text-4xl' />
          </CustomTooltip>
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddFixture(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <CustomTooltip content={'Cancel'}>
            <RxCross1 className='text-4xl' />
          </CustomTooltip>
        </NavLink>
      }

    </>
  )
}

export default ManageFixtures