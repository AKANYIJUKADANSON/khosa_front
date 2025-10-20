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

const ManageResults = () => {
  // If used vite to create the react app
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isAddResult, setIsAddResult] = useState(false);
  const [season, setSeason] = useState('');
  const [matchday, setMatchday] = useState('');
  const [match_date, setMatchDate] = useState('');

  const [home_team, setHomeTeam] = useState('');
  const [away_team, setAwayTeam] = useState('');
  const [home_had_lady, setHomeHadLady] = useState();
  const [away_had_lady, setAwayHadLady] = useState();


  const [home_score, setHomeScore] = useState('');
  const [away_score, setAwayScore] = useState('');


  const [results, setResults] = useState([]);
  const [teamsList, setTeamList] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [matchdayList, setMatchdayList] = useState([]);



  useEffect(() => {
    const get_results = async () => {
      const results = await fetch(`${apiUrl}/results`);
      const data = await results.json();
      // console.log("Match results: ", data.results);
      setResults(data.results);
    }

    const get_teams = async () => {
      const teams_list = await fetch(`${apiUrl}/teams`);
      const data = await teams_list.json();
      console.log("Teams_list: ", data.teams);
      setTeamList(data.teams);
    }

    const get_season_list = async () => {
      const seasons_list = await fetch(`${apiUrl}/seasons`);
      const data = await seasons_list.json();
      console.log("Seasons_list: ", data.seasons);
      setSeasonList(data.seasons);
    }


    const get_matchday_list = async () => {
      const matchday_list = await fetch(`${apiUrl}/matchdays`);
      const data = await matchday_list.json();
      console.log("Matchday_list: ", data.matchdays);
      setMatchdayList(data.matchdays);
    }

    get_matchday_list();
    get_season_list();
    get_results();
    get_teams();

  }, [apiUrl]);

  // Add a scorer
  const addScorer = (team) => {
    const container = document.getElementById(team + '_scorers');
    const row = document.createElement('div');
    row.className = 'scorer-row';
    row.innerHTML = `
        Name: <input type="text" name="${team}_scorer_name[]" list="${team}_players_datalist">
        Goals: <input type="number" name="${team}_scorer_goals[]" min="1">
    `;
    container.appendChild(row);
  }




  // capture and set data
  const submitFormData = async (e) => {
    e.preventDefault();

    const match_result_data = {
        season : season,
        matchday : matchday,
        match_date : match_date,

        home_team : home_team,
        away_team : away_team,
        home_had_lady : home_had_lady,
        away_had_lady : away_had_lady,
    }

    console.log('Match Result Data:', match_result_data);

    // initialise FormData and append the object with its key
    // const formData = new FormData();

    // Append all data to the formdata array
    // formData.append('season', season);
    // formData.append('match_date', match_date);

    // Send data to the backend
    // const send_match_data = await fetch(`${apiUrl}/add_match`, {
    //   method: 'POST',
    //   body: formData
    // });

    // const response_data = await send_match_data.json();

    // console.log("CI_3 Response: ", response_data);  

    // if (response_data.status === '200') {
    //   toast.success(response_data.message);
    //   window.location.reload();
    // } else {
    //   toast.error(response_data.message);
    //   return;
    // }

  }

  /**
   * ----------------------------------------------------------------------------------------------
   * ------------------------------ TABLE DATA ----------------------------------------------------
   * ----------------------------------------------------------------------------------------------
  */

  const data = results.map((result) => ({
    ...result,
    combinedColumns: `
            ${result.home_team} 
            ${result.away_team}
            ${result.home_team_goals}
            ${result.away_team_goals}
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
              Date: {row.match_date}
            </div>
          </div>
        </div>

        <div className='flex justify-center items-center'>

          <div className='text-sm font-light text-center'>
            {/* <img src="" alt="" /> */}
            <span className='font-bold'>{row.home_team}</span><br />
            <span className='font-bold'>{row.home_team_goals}</span>
          </div>

          <div className="font-bold text-red-600 mx-2 text-center">
            <span className='font-bold'>vs</span><br />
            <span className=' text-teal-500 font-bold text-sm'>
              {(row.win_type === 'Walkover') ? 'W' : 'N'}
            </span>
          </div>

          <div className='text-sm font-light text-center'>
            {/* <img src="" alt="" /> */}
            <span className='font-bold'>{row.away_team}</span><br />
            <span className='font-bold'>{row.away_team_goals}</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='grow p-2 h-full md,lg:h-screen bg-gray-100 ml-16 md:ml-0'>
        <div className="items-center my-2">
          {(!isAddResult) ?
            <h2 className="text-md text-left text-blue-900 font-bold my-auto">CURRENT RESULTS</h2>
            :
            <h2 className="text-md text-left text-blue-900 font-bold my-auto">ADD MATCH RESULT</h2>
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

          {(!isAddResult) &&
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
                    >
                      <option value="">Choose..</option>
                      {seasonList.map((season) => (
                        <option key={season.id} value={season.id}>
                          Season {season.season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-full my-4 md:my-0 lg:my-0'>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>Matchday*</label>

                    <select
                      name="matchday"
                      value={matchday}
                      onChange={(e) => setMatchday(e.target.value)}
                      className="mt-1 block w-full p-3 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      <option value="">Choose..</option>
                      {matchdayList.map((matchday) => (
                        <option key={matchday.id} value={matchday.id}>
                          Matchday {matchday.matchday}
                        </option>
                      ))}
                    </select>
                  </div>

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

                </div>

                <div className="block md:flex space-x-6 mt-14">

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

                    <div className='my-4 md:my-2 lg:my-2'>
                      <label className='block text-sm font-medim text-gray-700'>Goals Scored<span className='text-red-500 font-bold'>*</span></label>

                      <input
                        name="home_score"
                        value={home_score}
                        onChange={(e) => setHomeScore(e.target.value)}
                        type='number'
                        min={0}
                        className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                      />
                    </div>

                    <div className='mt-10 w-full '>
                      <hr className='bg-red-500 h-0.5' />
                      <label className='block text-sm font-medim text-gray-700'>Home Team Scorers<span className='text-red-500 font-bold'>*</span></label>

                      <div className="block md:flex w-full ">
                        <label class="inline-flex items-center mt-4 "> 
                          <span class="">Name</span>
                          <input
                            name="home_scorer_name[]" list="home_players_datalist"
                            type='text'
                            className='w-full mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                          />
                        </label>

                        <label class="inline-flex items-center mt-4">
                          <span class="">Goals</span>
                          <input
                            type='number'
                            name="home_scorer_goals[]" min="1"
                            className='w-full mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                          />
                        </label>

                      </div>

                      <button 
                        type="button"
                        onclick="addScorer('home')" 
                        className='bg-teal-600 text-white p-1 text-sm font-light rounded my-1'>
                          Add Home Scorer
                      </button>

                    </div>

                    <div className='my-4 md:my-2 lg:my-2'>
                      <span className='font-bold text-teal-700'>
                        <label class="inline-flex items-center">
                          <span class="text-sm">Home had lady</span>
                          <input 
                            name="home_had_lady"
                            value={home_had_lady}
                            onChange={(e) => setHomeHadLady(e.target.value)}
                            type="checkbox" 
                            class="w-5 h-5 mx-2 text-teal-600" />
                        </label>
                      </span>
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

                    <div className='my-4 md:my-2 lg:my-2'>
                      <label className='block text-sm font-medim text-gray-700'>Goals Scored<span className='text-red-500 font-bold'>*</span></label>

                      <input
                        name="away_score"
                        value={away_score}
                        onChange={(e) => setAwayScore(e.target.value)}
                        type='number'
                        min={0}
                        className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                      />
                    </div>


                    <div className='mt-10 w-full '>
                      <hr className='bg-blue-500 h-0.5' />
                      <label className='block text-sm font-medim text-gray-700'>Away Team Scorers<span className='text-red-500 font-bold'>*</span></label>

                      <div className="block md:flex w-full">
                        <label class="inline-flex items-center mt-4 "> 
                          <span class="">Name</span>
                          <input
                            // name="home_scorer"
                            // value={home_team_goals}
                            // onChange={(e) => setHomeTeamGoals(e.target.value)}
                            name="away_scorer_name[]" list="away_players_datalist"
                            type='text'
                            className='w-full mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                          />
                        </label>

                        <label class="inline-flex items-center mt-4">
                          <span class="">Goals</span>
                          <input
                            // name="home_team_goals"
                            // value={home_team_goals}
                            // onChange={(e) => setHomeTeamGoals(e.target.value)}
                            // type='number'
                            name="away_scorer_goals[]" min="1"
                            className='w-full mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                          />
                        </label>

                      </div>

                      <button
                        onclick="addScorer('away')"
                        className='bg-teal-600 text-white p-1 text-sm font-light rounded my-1'>
                          Add Away Scorer
                      </button>

                    </div>

                    <div className='my-4 md:my-2 lg:my-2'>
                      <span className='font-bold text-teal-700'>
                        <label class="inline-flex items-center">
                          <span class="text-sm">Away Lady Played</span>
                          <input 
                            name="away_had_lady"
                            value={away_had_lady}
                            onChange={(e) => setAwayHadLady(e.target.value)}
                            type="checkbox" 
                            class="w-5 h-5 mx-2 text-teal-600" 
                            
                          />

                        </label>
                      </span>
                    </div>
                    
                  </div>

                </div>

                <div className='mt-10'>
                  <div className='space-x-5 my-2 flex justify-start'>
                    <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>ADD RESULT</button>
                  </div>
                </div>

              </form>

              <datalist id="home_players_datalist"></datalist>
              <datalist id="away_players_datalist"></datalist>
              
            </div>
          }

          {(isAddResult) &&
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
                ref={data}
                tableStyle={{ minWidth: '10rem' }}
                filters={filters}
                globalFilterFields={['combinedColumns']}
                className='datatable-responsive mt-6'
                currentPageReportTemplate='showing {first} to {last} of {totalRecords} results'
                paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                removableSort
                // showGridlines
                // stripedRows
                dataKey='id'
                // header={header}
                emptyMessage='No results available'
                paginator
                rows={10}
                sortMode="multiple"
                rowsPerPageOptions={[10, 20, 30, 40, 50, results.length]}
              >
                <Column body={teamBodyTemplate} ></Column>
              </DataTable>
              {/* </div> */}
            </div>
          }

        </div>
      </div>

      {(!isAddResult) ?
        <NavLink
          onClick={() => setIsAddResult(true)}
          className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
          <CustomTooltip content={'Add Match Result'}>
            <IoMdAddCircle className='text-4xl' />
          </CustomTooltip>
        </NavLink>
        :
        <NavLink
          onClick={() => setIsAddResult(false)}
          className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
          <CustomTooltip content={'Cancel'}>
            <RxCross1 className='text-4xl' />
          </CustomTooltip>
        </NavLink>
      }

    </>
  )
}

export default ManageResults