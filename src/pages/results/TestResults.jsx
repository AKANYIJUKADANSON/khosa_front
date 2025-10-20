
import React, { useState, useEffect } from 'react';
// import './MatchResultForm.css'; 
import '/src/assets/MatchResultForm.css'


const TestResults = () => {

    const seasons = [
        { id: 1, name: '2023-2024' },
        { id: 2, name: '2024-2025' },
    ];
    const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
    ];
    const players = [
        { team_id: 1, name: 'Player 1' },
        { team_id: 1, name: 'Player 2' },
        { team_id: 2, name: 'Player 3' },
    ];


    // State for form inputs
    const [formData, setFormData] = useState({
        season_id: '',
        match_date: '',
        home_team: '',
        away_team: '',
        home_score: '',
        away_score: '',
        home_had_lady: false,
        away_had_lady: false,
        home_scorers: [{ name: '', goals: '' }],
        away_scorers: [{ name: '', goals: '' }],
    });

    // State for player datalists
    const [homePlayers, setHomePlayers] = useState([]);
    const [awayPlayers, setAwayPlayers] = useState([]);

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
        // try {
            // const response = await fetch('https://your-api-endpoint/results/save', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData),
            // });
            // if (response.ok) {
            //     alert('Result saved successfully!');
            //     // Reset form or redirect as needed
            //     setFormData({
            //         season_id: '',
            //         match_date: '',
            //         home_team: '',
            //         away_team: '',
            //         home_score: '',
            //         away_score: '',
            //         home_had_lady: false,
            //         away_had_lady: false,
            //         home_scorers: [{ name: '', goals: '' }],
            //         away_scorers: [{ name: '', goals: '' }],
            //     });
            // } else {
            //     alert('Error saving result.');
            // }

            console.log("Result Details: ", JSON.stringify(formData));

        // } catch (error) {
        //     console.error('Submission error:', error);
        //     alert('An error occurred while saving.');
        // }
    };

    return (
        <>
            <div className='grow p-2 h-full md,lg:h-screen bg-gray-100 ml-16 md:ml-0'>
                <div className="items-center my-2">
                    <h2 className="text-md text-left text-blue-900 font-bold my-auto">ADD MATCH RESULT</h2>
                </div>
                {/* <div className='grid '> */}

                <div>
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
                                    <option value="">Select Season</option>
                                    {seasons.map((season) => (
                                        <option key={season.id} value={season.id}>
                                            {season.name}
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
                                    <option value="">Select Home Team</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='w-fit flex justify-center items-center'>
                                <span className='font-bold text-center text-2xl text-teal-500'> vs </span>
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
                                    <option value="">Select Away Team</option>
                                    {teams.map((team) => (
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
                                    <label class="inline-flex items-center">
                                        <span class="text-sm">Home Had Lady</span>
                                        <input
                                            type="checkbox"
                                            name="home_had_lady"
                                            checked={formData.home_had_lady}
                                            onChange={handleInputChange}
                                            class="w-5 h-5 mx-2 text-teal-600"
                                        />

                                    </label>
                                </span>
                            </div>

                            <div className='w-full md:my-2 lg:my-2'>
                                <span className='font-bold text-teal-700'>
                                    <label class="inline-flex items-center">
                                        <span class="text-sm">Away Had Lady</span>
                                        <input
                                            type="checkbox"
                                            name="away_had_lady"
                                            checked={formData.away_had_lady}
                                            onChange={handleInputChange}
                                            class="w-5 h-5 mx-2 text-teal-600"
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

                {/* </div> */}
            </div >
        </>
    )
}

export default TestResults