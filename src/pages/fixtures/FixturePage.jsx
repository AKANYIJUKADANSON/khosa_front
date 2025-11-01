import { useLoaderData, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { SplitTime } from '../../components/SplitTime';

const FixturePage = ({ initIsUpdateFixture }) => {

    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Get the fixture data from the loader
    const selected_fixture = useLoaderData();
    console.log('Selected_Fixture', selected_fixture);

    const [isUpdateFixture, setIsUpdateFixture] = useState(initIsUpdateFixture ? initIsUpdateFixture : false);

    const [teamsList, setTeamList] = useState([]);
    const [seasonList, setSeasonList] = useState([]);
    const [matchdayList, setMatchdayList] = useState([]);

    const [season, setSeason] = useState('');
    const [matchday_id, setMatchday] = useState('');
    const [match_date, setMatchDate] = useState('');
    const [home_team, setHomeTeam] = useState('');
    const [away_team, setAwayTeam] = useState('');

    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [meridian, setMeridian] = useState('');

    /**
     * Setting up the initial values for the input fields
    */
    const split_time = SplitTime(selected_fixture.time);
    console.log("Splited Time:", split_time);

    useEffect(() => {
        if (selected_fixture) {
            setSeason(selected_fixture.season_id);
            setMatchday(selected_fixture.matchday_id);
            setHomeTeam(selected_fixture.home_team_id);
            setAwayTeam(selected_fixture.away_team_id);
            setMatchDate(selected_fixture.date);

            setHours(String(split_time.hour));
            setMinutes(String(split_time.minute));
            setMeridian(String(split_time.period));
        }

    }, [selected_fixture, split_time]);

    useEffect(() => {
        const get_teams = async () => {
            const teams_list = await fetch(`${apiUrl}/teams`);
            const data = await teams_list.json();
            // console.log("Teams_list: ", data.teams);
            setTeamList(data.teams);
        }

        const get_season_list = async () => {
            const seasons_list = await fetch(`${apiUrl}/seasons`);
            const data = await seasons_list.json();
            // console.log("seasons List: ", data.seasons);
            setSeasonList(data.seasons);
        }

        const get_matchday_list = async () => {
            const matchday_list = await fetch(`${apiUrl}/matchdays`);
            const data = await matchday_list.json();
            // console.log("Matchday_list: ", data.matchdays);
            setMatchdayList(data.matchdays);
        }

        get_matchday_list();
        get_season_list();
        get_teams();
    }, [apiUrl]);

    // capture and set data
    const submitFormData = async (e) => {
        e.preventDefault();

        const match_time = hours + ':' + minutes + meridian;

        // const match_result_data = {
        //   updated_season: season,
        //   updated_matchday_id: matchday_id,
        //   updated_match_date: match_date,
        //   updated_match_time: match_time,
        //   updated_home_team_id: home_team,
        //   updated_away_team_id: away_team,
        // }

        // console.log('Fixture Result Data:', match_result_data);

        // initialise FormData and append the object with its key
        const formData = new FormData();

        // Append all data to the formdata array
        formData.append('season_id', season);
        formData.append('matchday_id', matchday_id);
        formData.append('match_date', match_date);
        formData.append('match_time', match_time);

        formData.append('home_team_id', home_team);
        formData.append('away_team_id', away_team);

        //Send data to the backend
        const update_fixture = await fetch(`${apiUrl}/fixtures/update/${selected_fixture.hashing}`, {
            method: 'POST',
            body: formData
        });

        const response_data = await update_fixture.json();
        // console.log("CI_3 Response: ", response_data);  

        if (response_data.status === '200') {
            toast.success(response_data.message);
            setTimeout(() => {
                navigate('/fixtures');
            }, 3000);
        } else {
            toast.error(response_data.message);
            return;
        }

    }

    return (
        <>

            <div className='gselected_fixture p-2 h-screen bg-gray-100 ml-16 md:ml-0'>
                <div className="items-center my-2">
                    {(isUpdateFixture) ?
                        <h2 className="text-md text-left text-teal-500 font-bold my-auto">UPDATE FIXTURE</h2>
                        :
                        <h2 className="text-md text-left text-teal-500 font-bold my-auto">FIXTURE DETAILS</h2>
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

                    {(isUpdateFixture) &&
                        <div className="flex border-0 w-full">
                            <form onSubmit={submitFormData} className='space-y-4 w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4' >

                                <div className="block md:flex space-x-6">

                                    <div className='w-full'>
                                        <label className='block mb-1 text-sm font-medium text-gray-700'>Season*</label>

                                        <select
                                            name="season"
                                            value={season}
                                            onChange={(e) => setSeason(e.target.value)}
                                            className="mt-1 block w-full p-3 border text-teal-700 pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            required
                                        >
                                            <option disabled value="">Choose..</option>
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
                                            name="matchday_id"
                                            value={matchday_id}
                                            onChange={(e) => setMatchday(e.target.value)}
                                            className="mt-1 block w-full p-3 text-teal-700 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                                            className='w-full p-2 border text-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300' required
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
                                                className='w-full mx-2 p-3 text-teal-700 border font-light rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
                                                placeholder='00'
                                                required
                                            />

                                            <input
                                                name="minutes"
                                                value={minutes}
                                                onChange={(e) => setMinutes(e.target.value)}
                                                type='number'
                                                min={0} max={59}
                                                className='w-full mx-2 p-3 border font-light text-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
                                                placeholder='00'
                                                required
                                            />

                                            <select
                                                name="meridian"
                                                value={meridian}
                                                onChange={(e) => setMeridian(e.target.value)}
                                                className="mt-1 block w-full p-3 border font-light text-teal-700 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                            >
                                                <option disabled value="">choose...</option>
                                                <option value='am'>am</option>
                                                <option value='pm'>pm</option>
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
                                                className="mt-1 block w-full p-3 text-teal-700 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                <option disabled value="">Choose..</option>
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
                                                className="mt-1 block w-full p-3 text-teal-700 border pr-6 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                <option disabled value="">Choose..</option>
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
                                        <button type='submit' className='cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-700 text-white rounded font-light'>UPDATE</button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    }

                    {(!isUpdateFixture) &&
                        <div className="flex border-0 w-full ">
                            <div className='space-y-2 w-full shadow-xl/20 ring-1 ring-gray-200 my-2 bg-white text-black rounded p-4 justify-center items-center' >

                                <div className='flex justify-left text-sm items-center'>
                                    <div className="block md:flex space-x-4">
                                        <div className='font-light md:text-md'>
                                            Season: <span className='text-teal-900 text-md font-bold'>{selected_fixture.season}</span>
                                        </div>

                                        <div className='font-light md:text-md'>
                                            Matchday: <span className='text-teal-900 text-md font-bold'>{selected_fixture.matchday}</span>
                                        </div>

                                        <div className='font-light md:text-md'>
                                            Date: <span className='text-teal-900 text-md font-bold'>{selected_fixture.date}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                                <hr />
                                <div className='flex justify-center items-center'>
                                    <div className='text-sm font-light text-center'>
                                        <img src={selected_fixture.home_team_logo} alt="" className='h-7 w-7 md:h-15 md:w-15 mx-auto rounded-full' />
                                        <span className='font-bold md:text-2xl'>{selected_fixture.home_team}</span><br />
                                    </div>

                                    <div className="font-bold text-red-600 mx-2 mt-10 text-center">
                                        <span className='font-bold md:text-3xl md:mx-10'>vs</span><br />
                                        <span className='font-extralight text-sm md:font-bold'>{selected_fixture.time}</span><br />
                                    </div>

                                    <div className='text-sm font-light text-center'>
                                        <img src={selected_fixture.away_team_logo} alt="" className='h-7 w-7 md:h-15 md:w-15 mx-auto rounded-full' />
                                        <span className='font-bold md:text-2xl'>{selected_fixture.away_team}</span><br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }


                </div>
            </div>


            {(!isUpdateFixture) ?
                <NavLink
                    onClick={() => setIsUpdateFixture(true)}
                    className="bg-teal-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-teal-700 flex items-center justify-center">
                    <BiPencil className='text-4xl' />
                </NavLink>
                :
                <NavLink
                    onClick={() => setIsUpdateFixture(false)}
                    className="bg-red-500 text-white p-2 md:p-3 shadow-lg fixed  rounded-full bottom-7 right-4 hover:bg-red-700 flex items-center justify-center">
                    <RxCross1 className='text-4xl' />
                </NavLink>
            }

        </>

    )
}

// Fetch and export the fixture data using dataloader
const fixtureLoader = async ({ params }) => {
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    // Get the hashed_id parameter sent in the link in the App.js file with the dataloader
    // The id parameter used in the App.js file should be the same as that used here
    const response = await fetch(`${apiUrl}/fixtures/${params.hashing}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch fixture data');
    }
    // console.log(params.hashing);
    return data.fixture;
};

export { FixturePage as default, fixtureLoader }