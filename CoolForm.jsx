
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