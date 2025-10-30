import React from 'react'
import { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Card from '../../components/Card'
import { BiCalendar, BiSolidReceipt } from 'react-icons/bi'
// import { useNavigate } from 'react-router-dom';
import { BsPeopleFill, BsPersonFill } from "react-icons/bs";

// import { barChart, pieChart } from '../../assets/Chartdata'
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend
)
ModuleRegistry.registerModules([AllCommunityModule]);

const Dashboard = () => {

    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    const [teams, setTeams] = useState([]);
    const [results, setResults] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {

        // generate colors according to the number of teams
        const generateRandomHexColor = () => {
            return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0);
        }

        const colors = ['#FF2056', '#000080', '#FFDF20', '#008000', '#ff0000', '#1447E6', '#E7180B', '#800000', '#8A0194', '#9AE630', '#008080', '#800080', '#008000' ];
        
        if (
            teams.length > 0
        ) {
            const labels = [];
            const data = [];
            const backgroundColors = [];

            teams.map((team)=>{
                labels.push(team.name);
                data.push(team.points);
                for (let x = 0; x < teams.length; x++) {
                    if (teams.length > 20){
                        backgroundColors.push(generateRandomHexColor());
                    }else{
                        backgroundColors.push(colors[x]);
                    }
                }
                
            });

            

            const dataset = {
                labels,
                datasets: [{
                    // label: 'Teams',
                    data,
                    backgroundColor: backgroundColors
                }]
            };

            setBarChartData(dataset);
        }
    }, [apiUrl, teams]);

    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {

        const fetchData = async () => {
            try {
                const [teamsRes, resultsRes, fixturesRes, seasonsRes] = await Promise.all([
                    fetch(`${apiUrl}/teams`),
                    fetch(`${apiUrl}/results`),
                    fetch(`${apiUrl}/fixtures`),
                    fetch(`${apiUrl}/seasons`),
                ]);

                const teams_response = await teamsRes.json();
                const results_response = await resultsRes.json();
                const fixtures_response = await fixturesRes.json();
                const seasons_response = await seasonsRes.json();

                setTeams(teams_response.teams);
                console.log('Teams:', teams_response.teams);
                setResults(results_response.results);
                setFixtures(fixtures_response.fixtures);
                setSeasons(seasons_response.seasons);

            } catch (error) {
                console.log("Error fetching data:", error);
            }

        }

        fetchData();

    }, [apiUrl]);



    return (

        <div className='grow p-2 ml-16 md:ml-0 bg-gray-100 h-full mb-10'>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 `}>

                <Card icon={<BsPeopleFill />} title={"Teams"} value={teams.length} bgColor={"bg-green-300"} nav_link={`/teams`} />

                <Card icon={<BiCalendar />} title={"Fixtures"} value={fixtures.length} bgColor={"bg--300"} nav_link={`/fixtures`} />

                <Card icon={<BiSolidReceipt />} title={"Results"} value={results.length} bgColor={"bg-yellow-200"} nav_link={`/results`} />

                <Card icon={<BsPersonFill />} title={"Seasons"} value={seasons.length} bgColor={"bg-blue-200"} nav_link={`/seasons`} />

            </div>

            <div className="w-full gap-6">
                {/* Bar Chart Section */}
                <div className="bg-white  shadow-md p-4 ">
                    <h3 className="text-md font-bold text-[#082f6b] mb-6">Teams and Points Summary</h3>
                    <div className="h-[350px] w-full ">
                        {barChartData.labels.length > 0 && (
                            <Bar
                                data={barChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                            position: 'top',
                                            labels: {
                                                boxWidth: 10,
                                                padding: 15,
                                            },
                                        },
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                display: false,
                                            },
                                        },
                                        y: {
                                            grid: {
                                                color: '#f3f4f6',
                                            },
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Dashboard