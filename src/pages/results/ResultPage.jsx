import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { IoMdAddCircle } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import CustomTooltip from '../../components/CustomTooltip';
import { FaPencil } from 'react-icons/fa6';
import { BiPencil } from 'react-icons/bi';

const ResultPage = ({ initIsUpdateResult }) => {

    const apiUrl = import.meta.env.VITE_API_URL;

    // Get the fixture data from the loader
    const selected_result = useLoaderData();
    // console.log('Selected_result', selected_result);

    const [isUpdateResult, setIsUpdateResult] = useState(initIsUpdateResult ? initIsUpdateResult : false);
    const [homeTeamMatchScorers, setHomeTeamMatchScorers] = useState([]);
    const [awayTeamMatchScorers, setAwayTeamMatchScorers] = useState([]);

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

    const [teamsList, setTeamList] = useState([]);
    const [players, setPlayersList] = useState([]);
    const [seasonList, setSeasonList] = useState([]);
    const [matchdayList, setMatchdayList] = useState([]);


    useEffect(() => {

        const get_teams = async () => {
            const teams_list = await fetch(`${apiUrl}/teams`);
            const data = await teams_list.json();
            // console.log("Teams_list: ", data.teams);
            setTeamList(data.teams);
        }

        const get_players_list = async () => {
            const players_list = await fetch(`${apiUrl}/players`);
            const data = await players_list.json();
            // console.log("Players_list: ", data.players);
            setPlayersList(data.players);
        }

        const get_season_list = async () => {
            const seasons_list = await fetch(`${apiUrl}/seasons`);
            const data = await seasons_list.json();
            // console.log("Seasons_list: ", data.seasons);
            setSeasonList(data.seasons);
        }

        const get_matchday_list = async () => {
            const matchday_list = await fetch(`${apiUrl}/matchdays`);
            const data = await matchday_list.json();
            // console.log("Matchday_list: ", data.matchdays);
            setMatchdayList(data.matchdays);
        }

        const get_home_team_match_goals = async () => {
            const home_team_match_goals = await fetch(`${apiUrl}/results/match_goals/${selected_result.id}/${selected_result.home_team_id}`);
            const data = await home_team_match_goals.json();
            // console.log("Home_team_match_goals: ", data.match_goals);
            setHomeTeamMatchScorers(data.match_goals);
        }

        const get_away_team_match_goals = async () => {
            const away_team_match_goals = await fetch(`${apiUrl}/results/match_goals/${selected_result.id}/${selected_result.away_team_id}`);
            const data = await away_team_match_goals.json();
            // console.log("Away_team_match_goals: ", data.match_goals);
            setAwayTeamMatchScorers(data.match_goals);
        }

        get_away_team_match_goals();
        get_home_team_match_goals();
        get_matchday_list();
        get_players_list();
        get_season_list();
        get_teams();

    }, [apiUrl, selected_result]);

    // Organize players by team
    const playersByTeam = players.reduce((acc, player) => {
        if (!acc[player.team_id]) {
            acc[player.team_id] = [];
        }
        // Adding the name of the players to the list
        acc[player.team_id].push(player.player_name);
        return acc;
    }, {});

    // Update datalist based on selected team
    const updateDatalist = (teamType) => {
        const teamId = formData[`${teamType}_team`];
        // console.log('Selected_team_id:', teamId);
        const players = playersByTeam[teamId] || [];
        // console.log('home_players:', players);
        if (teamType === 'home') {
            setHomePlayers(players);
            console.log('home_players:', players);
        } else {
            setAwayPlayers(players);
            console.log('away_players:', players);
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

    // Add scorer selected_result
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


    return (
        <>
            <div className={`grow p-2 ${isUpdateResult ? 'h-full' : 'h-screen'}  h-full bg-gray-200 ml-16 md:ml-0`}>
                <div className="items-center my-2">
                    <div className="text-md text-left text-gray-500 font-semibold my-auto">
                        <NavLink to='/dashboard' className=' hover:text-blue-800' >
                            Home/
                        </NavLink>
                        <span>
                            <NavLink to='/results' className=' hover:text-blue-800' >
                                results
                            </NavLink>
                            /{(!isUpdateResult) ? 'details' : 'update'}
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

                    {(isUpdateResult) &&
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
                                            <div key={`home_scorer_${index}`} className="scorer-selected_result my-2">
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
                                            <div key={`away_scorer_${index}`} className="scorer-selected_result my-2">
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

                    {(!isUpdateResult) &&
                        <div className="flex border-0 w-full ">
                            <div className=' w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4 justify-center items-center' >

                                <div className='flex justify-left text-sm items-center'>
                                    <div className="block md:flex space-x-4">
                                        <div className='font-light md:text-md'>
                                            Season: <span className='text-teal-900 text-md font-bold'>{selected_result.season}</span>
                                        </div>

                                        <div className='font-light md:text-md'>
                                            Matchday: <span className='text-teal-900 text-md font-bold'>{selected_result.matchday}</span>
                                        </div>

                                        <div className='font-light md:text-md'>
                                            Date: <span className='text-teal-900 text-md font-bold'>{selected_result.match_date}</span>
                                        </div>

                                    </div>
                                </div>
                                <hr />

                                <div className='flex justify-between items-center my-6'>

                                    <div className='
                                        text-sm 
                                        min-[450px]:text-lg
                                        min-[1020px]:text-4xl  
                                        font-light items-center text-center max-[450px]:block flex'>
                                        <img src={selected_result.home_team_logo} alt="" className='
                                            h-9 w-9 
                                            min-[1020px]:w-35 min-[1020px]:h-35 
                                            min-[450px]:w-16 min-[450px]:h-16 
                                            mx-auto rounded-full' />
                                        <span className='font-bold'>{selected_result.home_team}</span><br />
                                        {/* <span className='font-bold'>{selected_result.home_team_goals}</span> */}
                                    </div>

                                    <div className="font-bold text-teal-600
                                        text-sm 
                                        min-[450px]:text-2xl
                                        min-[1020px]:text-5xl
                                        mx-3 bg-teal-100 shadow-md px-1 md:px-5 md:py-2 rounded md:mx-4 flex justify-center items-center ">
                                        <div className="flex">
                                            <span className='font-bold'>{selected_result.home_team_goals}</span>
                                        </div>

                                        <div className="flex">
                                            <span className='font-bold mx-3 -mt-1 my-auto text-3xl'>-</span>
                                        </div>

                                        <div className="flex">
                                            <span className='font-bold'>{selected_result.away_team_goals}</span>
                                        </div>
                                    </div>

                                    <div className='text-sm 
                                        min-[450px]:text-lg
                                        min-[1020px]:text-4xl  
                                        font-light items-center text-center max-[450px]:block flex'>

                                        <img src={selected_result.away_team_logo} alt="" className='
                                            h-9 w-9 
                                            min-[1020px]:w-35 min-[1020px]:h-35 
                                            min-[450px]:w-16 min-[450px]:h-16 
                                            mx-auto rounded-full' />
                                        <span className='font-bold'>{selected_result.away_team}</span><br />
                                    </div>
                                </div>

                                <div className='flex justify-between'>
                                    <div className='
                                        text-sm 
                                        min-[450px]:text-md
                                        min-[1020px]:text-2xl  
                                        font-light items-start  max-[450px]:block'>
                                        <div className="block">
                                            {homeTeamMatchScorers.map((scorer) => (
                                                <div className='font-light text-md justify-left items-center'>
                                                    <span className=''>{scorer.player_name}:</span>
                                                    <span className='me-2 font-bold'>{scorer.goals}</span>
                                                </div>

                                            ))}
                                        </div>

                                    </div>

                                    <div className='
                                        text-sm 
                                        min-[450px]:text-md
                                        min-[1020px]:text-2xl  
                                        font-light text-end max-[450px]:block'>
                                        <div className="block">
                                            {awayTeamMatchScorers.map((scorer) => (
                                                <div className='font-light text-md justify-end'>
                                                    <span className=''>{scorer.player_name}:</span>
                                                    <span className='ms-2 font-bold'>{scorer.goals}</span>
                                                </div>

                                            ))}
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>

            {(!isUpdateResult) ?
                <NavLink
                    onClick={() => setIsUpdateResult(true)}
                    className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
                    <BiPencil className='text-4xl' />
                </NavLink>
                :
                <NavLink
                    onClick={() => setIsUpdateResult(false)}
                    className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
                    <CustomTooltip content={'Cancel'}>
                        <RxCross1 className='text-4xl' />
                    </CustomTooltip>
                </NavLink>
            }

        </>
    )
}

// Fetch and export the fixture data using dataloader
const resultLoader = async ({ params }) => {
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
    // The id parameter used in the App.js file should be the same as that used here
    const response = await fetch(`${apiUrl}/results/${params.hashing}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch result data');
    }
    // console.log(params.hashing);
    return data.result;
};

export { ResultPage as default, resultLoader } 