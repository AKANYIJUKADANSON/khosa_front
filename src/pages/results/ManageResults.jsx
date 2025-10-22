
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/soho-light/theme.css';


import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { IoMdAddCircle } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import CustomTooltip from '../../components/CustomTooltip';

const ManageResults = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const [isAddResult, setIsAddResult] = useState(false);

  // State for form inputs
  const [formData, setFormData] = useState({
    season_id: '',
    matchday_id: '',
    match_date: '',
    home_team: '',
    away_team: '',
    home_score: '',
    away_score: '',
    home_had_lady: false,
    away_had_lady: false,
    home_scorers: [{ name: '', goals: '' }],
    away_scorers: [{ name: '', goals: '' }],
    win_type: '',
  });

  // State for player datalists
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  const [results, setResults] = useState([]);
  const [teamsList, setTeamList] = useState([]);
  const [players, setPlayersList] = useState([]);
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

    const get_players_list = async () => {
      const players_list = await fetch(`${apiUrl}/players`);
      const data = await players_list.json();
      console.log("Players_list: ", data.players);
      setPlayersList(data.players);
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
    get_players_list();
    get_season_list();
    get_results();
    get_teams();

  }, [apiUrl]);

  // Organize players by team
  const playersByTeam = players.reduce((acc, player) => {
    if (!acc[player.team_id]) {
      acc[player.team_id] = [];
    }
    acc[player.team_id].push(player.name);
    return acc;
  }, {});

  // Update datalist based on selected team
  const updateDatalist = (teamType) => {
    const teamId = formData[`${teamType}_team`];
    const players = playersByTeam[teamId] || [];
    if (teamType === 'home') {
      setHomePlayers(players);
    } else {
      setAwayPlayers(players);
    }
  };

  // Initialize datalists on component mount or when teams change
  useEffect(() => {
    if (formData.home_team) updateDatalist('home');
    if (formData.away_team) updateDatalist('away');
  }, [formData.home_team, formData.away_team]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle team selection change
  const handleTeamChange = (e, teamType) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    updateDatalist(teamType);
  };

  // Handle scorer input changes
  const handleScorerChange = (e, index, team, field) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedScorers = [...prev[`${team}_scorers`]];
      updatedScorers[index] = { ...updatedScorers[index], [field]: value };
      return { ...prev, [`${team}_scorers`]: updatedScorers };
    });
  };

  // Add scorer row
  const addScorer = (team) => {
    setFormData((prev) => ({
      ...prev,
      [`${team}_scorers`]: [...prev[`${team}_scorers`], { name: '', goals: '' }],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    // Append individual form fields
    formDataToSend.append('season_id', formData.season_id);
    formDataToSend.append('matchday_id', formData.matchday_id);
    formDataToSend.append('win_type', formData.win_type);
    formDataToSend.append('match_date', formData.match_date);
    formDataToSend.append('home_team', formData.home_team);
    formDataToSend.append('away_team', formData.away_team);
    formDataToSend.append('home_score', formData.home_score);
    formDataToSend.append('away_score', formData.away_score);
    formDataToSend.append('home_had_lady', formData.home_had_lady ? '1' : '0');
    formDataToSend.append('away_had_lady', formData.away_had_lady ? '1' : '0');

    // Append scorer arrays
    formData.home_scorers.forEach((scorer) => {
      if (scorer.name && scorer.goals) { // Only append if name and goals are provided
        formDataToSend.append('home_scorer_name[]', scorer.name);
        formDataToSend.append('home_scorer_goals[]', scorer.goals);
      }
    });
    formData.away_scorers.forEach((scorer) => {
      if (scorer.name && scorer.goals) { // Only append if name and goals are provided
        formDataToSend.append('away_scorer_name[]', scorer.name);
        formDataToSend.append('away_scorer_goals[]', scorer.goals);
      }
    });


    try {
      // Send data to the backend
      const send_match_data = await fetch(`${apiUrl}/add_result`, {
        method: 'POST',
        body: formDataToSend
      });

      const response_data = await send_match_data.json();

      console.log("CI_3 Response: ", response_data);

      if (response_data.status === '200') {
        toast.success(response_data.message);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
        
      } else {
        toast.error(response_data.message);
        return;
      }


    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while saving.');
    }
  };


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
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">CURRENT RESULTS</h2>
            :
            <h2 className="text-md text-left text-teal-500 font-bold my-auto">ADD MATCH RESULT</h2>
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

          {(isAddResult) &&
            <div className="flex border-0 w-full">
              <form onSubmit={handleSubmit} className='space-y-4 w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4'>
                <div className="block md:flex space-x-6">
                  <div className='w-full'>
                    <label>Season: </label>
                    <select
                      name="season_id"
                      value={formData.season_id}
                      onChange={handleInputChange}
                      className=" block w-full p-3 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled value="">Choose...</option>
                      {seasonList.map((season) => (
                        <option key={season.id} value={season.id}>
                          Season {season.season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-full'>
                    <label>Matchday: </label>
                    <select
                      name="matchday_id"
                      value={formData.matchday_id}
                      onChange={handleInputChange}
                      className=" overflow-auto block w-full p-3 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                      
                    >
                      <option disabled value="">Choose...</option>
                      {matchdayList.map((matchday) => (
                        <option key={matchday.id} value={matchday.id}>
                          Matchday {matchday.matchday}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-full'>
                    <label>Date: </label>
                    <input
                      type="date"
                      name="match_date"
                      value={formData.match_date}
                      onChange={handleInputChange}
                      required
                      className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'

                    />
                  </div>

                  <div className='w-full'>
                    <label>Win Type: </label>
                    <select
                      name="win_type"
                      value={formData.win_type}
                      onChange={handleInputChange}
                      className=" block w-full p-3 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled value="">Choose...</option>
                      
                        <option value='Normal'>Normal</option>
                        <option value='Walkover'>WalkOver</option>
                      
                    </select>
                  </div>


                </div>
                <br />

                <div className="block md:flex space-x-6">
                  <div className='w-full'>
                    <label>Home Team: </label>
                    <select
                      name="home_team"
                      value={formData.home_team}
                      onChange={(e) => handleTeamChange(e, 'home')}
                      className="block w-full p-3 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled value="">Choose...</option>
                      {teamsList.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-fit flex justify-center items-center'>
                    <span className='font-bold text-center text-xl text-red-500'> vs </span>
                  </div>

                  <div className='w-full'>
                    <label>Away Team: </label>
                    <select
                      name="away_team"
                      value={formData.away_team}
                      onChange={(e) => handleTeamChange(e, 'away')}
                      className="block w-full p-3 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option disabled value="">Choose...</option>
                      {teamsList.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <br />

                <div className="block md:flex space-x-6">
                  <div className='w-full'>
                    <label>Home Score: </label>
                    <input
                      type="number"
                      name="home_score"
                      value={formData.home_score}
                      onChange={handleInputChange}
                      min="0"
                      className="block w-full p-3 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label>Away Score: </label>
                    <input
                      type="number"
                      name="away_score"
                      value={formData.away_score}
                      onChange={handleInputChange}
                      min="0"
                      className="block w-full p-3 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>

                <div className="block md:flex space-x-6">
                  <div className='w-full md:my-2 lg:my-2'>
                    <span className='font-bold text-teal-700'>
                      <label className="inline-flex items-center">
                        <span className="text-sm">Home Had Lady</span>
                        <input
                          type="checkbox"
                          name="home_had_lady"
                          checked={formData.home_had_lady}
                          onChange={handleInputChange}
                          className="w-5 h-5 mx-2 text-teal-600"
                        />

                      </label>
                    </span>
                  </div>

                  <div className='w-full md:my-2 lg:my-2'>
                    <span className='font-bold text-teal-700'>
                      <label className="inline-flex items-center">
                        <span className="text-sm">Away Had Lady</span>
                        <input
                          type="checkbox"
                          name="away_had_lady"
                          checked={formData.away_had_lady}
                          onChange={handleInputChange}
                          className="w-5 h-5 mx-2 text-teal-600"
                        />

                      </label>
                    </span>
                  </div>
                </div>

                <div className="space-x-6 w-full">
                  <label>Home Scorers:</label><br />

                  <div id="home_scorers" className="">
                    {formData.home_scorers.map((scorer, index) => (
                      <div key={`home_scorer_${index}`} className="scorer-row my-2">
                        <label>Name: </label>
                        <input
                          type="text"
                          value={scorer.name}
                          onChange={(e) => handleScorerChange(e, index, 'home', 'name')}
                          list="home_players_datalist"
                          className='w-fit mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required

                        />
                        <label>Goals: </label>
                        <input
                          type="number"
                          value={scorer.goals}
                          onChange={(e) => handleScorerChange(e, index, 'home', 'goals')}
                          min="1"
                          className='w-fit mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                        />
                      </div>
                    ))}

                    <button type='button'
                      onClick={() => addScorer('home')}
                      className='bg-teal-600 text-white p-1 text-sm font-light rounded my-1'>
                      Add Home Scorer
                    </button>
                  </div>


                  <datalist id="home_players_datalist">
                    {homePlayers.map((player, index) => (
                      <option key={`home_player_${index}`} value={player} />
                    ))}
                  </datalist>
                </div>

                <div className='space-x-6 w-full'>
                  <label>Away Scorers:</label>
                  <div id="away_scorers">
                    {formData.away_scorers.map((scorer, index) => (
                      <div key={`away_scorer_${index}`} className="scorer-row my-2">
                        <label>Name: </label>
                        <input
                          type="text"
                          value={scorer.name}
                          onChange={(e) => handleScorerChange(e, index, 'away', 'name')}
                          list="away_players_datalist"
                          className='w-fit mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                        />
                        <label>Goals: </label>
                        <input
                          type="number"
                          value={scorer.goals}
                          onChange={(e) => handleScorerChange(e, index, 'away', 'goals')}
                          min="1"
                          className='w-fit mx-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
                        />
                      </div>
                    ))}
                    <button type="button"
                      className='bg-teal-600 text-white p-1 text-sm font-light rounded my-1'
                      onClick={() => addScorer('away')}>
                      Add Away Scorer
                    </button>
                  </div>
                  <datalist id="away_players_datalist">
                    {awayPlayers.map((player, index) => (
                      <option key={`away_player_${index}`} value={player} />
                    ))}
                  </datalist>
                </div>
                <br />

                <input
                  type="submit"
                  value="Save Result"
                  className='cursor-pointer px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded font-light' />
              </form>
            </div >
          }
          {(!isAddResult) &&
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