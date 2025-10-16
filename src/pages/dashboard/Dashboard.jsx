import React from 'react'
import { useState, useEffect } from 'react'
import { SiDavinciresolve } from 'react-icons/si'
import { VscTasklist } from 'react-icons/vsc'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Card from '../../components/Card'
import { BiCalendar, BiSolidReceipt, BiTask } from 'react-icons/bi'
import { GrInProgress } from 'react-icons/gr'
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom'
import SupportOfficerModel from '../../components/supportOfficerModel';
import { BsPeopleFill, BsPerson, BsPersonFill, BsPersonWorkspace } from "react-icons/bs";
import { GiTicket } from "react-icons/gi";
import { BsPersonFillCheck } from "react-icons/bs";
import { BsPersonFillDash } from "react-icons/bs";

// import { barChart, pieChart } from '../../assets/Chartdata'
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend
)
ModuleRegistry.registerModules([AllCommunityModule]);

const Dashboard = () => {

    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    const [authenticatedUser, setAuthenticatedUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [tickets, setTickets] = useState([]);
    const [supportOfficers, setSupportOfficers] = useState([]);
    const [occupiedSupportOfficers, setOccupiedSupportOfficers] = useState([]);
    const [freeSupportOfficers, setFreeSupportOfficers] = useState([]);

    // unassigned tickets
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const [inprogressTickets, setInprogressTickets] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState([]);
    const [closedTickets, setClosedTickets] = useState([]);
    const [assignedTickets, setAssignedTickets] = useState([]);

    // Priority status
    const [normalPriorityTickets, setNormalPriorityTickets] = useState([]);
    const [urgentPriorityTickets, setUrgentPriorityTickets] = useState([]);
    const [veryUrgentPriorityTickets, setveryUrgentPriorityTickets] = useState([]);

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', description: '' });


    const handleOpenModal = (title, description) => {
        setModalContent({
            title,
            description

        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent({ title: '', description: '' });
    };

    // State for the chart data
    const [pieChartData, setPieChartData] = useState({
        labels: [],
        datasets: []
    });

    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: []
    });


    useEffect(() => {
        // Gte authenticated user data from local storage
        const loged_id_user = JSON.parse(localStorage.getItem('authenticated_user')).authenticated_userdata;
        // const auth_status = localStorage.getItem('authenticated');
        // console.log('dashboard_auth_status', auth_status);
        setAuthenticatedUser(loged_id_user);


        if ((loged_id_user.role === 'supervisor') || (loged_id_user.role === 'superadmin')){
            const fetchData = async () => {
                try {
                    const [ticketsRes, supportOfficersRes, occupiedRes, freeSupportOfficersRes, assignedRes, unassignedRes, inprogressRes, resolvedRes, closedRes, normalPriorityTicketsRes, urgentPriorityTicketsRes, veryUrgentPriorityTicketsRes] = await Promise.all([
                        fetch(`${apiUrl}/tickets`),
                        fetch(`${apiUrl}/tickethandlers`),
                        fetch(`${apiUrl}/occupied`),
                        fetch(`${apiUrl}/free`),

                        fetch(`${apiUrl}/tickets/status/assigned`),
                        fetch(`${apiUrl}/tickets/status/unassigned`),
                        fetch(`${apiUrl}/tickets/status/ongoing`),
                        fetch(`${apiUrl}/tickets/status/resolved`),
                        fetch(`${apiUrl}/tickets/status/closed`),
                        
                        fetch(`${apiUrl}/tickets/priority/normal`),
                        fetch(`${apiUrl}/tickets/priority/urgent`),
                        fetch(`${apiUrl}/tickets/priority/vurgent`)
                    ]);

                    // const tickets = await ticketsRes.json();
                    const tickets = await ticketsRes.json();
                    const unassigned = await unassignedRes.json();
                    const assigned = await assignedRes.json();
                    const inprogress = await inprogressRes.json();
                    const resolved = await resolvedRes.json();
                    const closed = await closedRes.json();

                    // Priority
                    const normal = await normalPriorityTicketsRes.json();
                    const urgent = await urgentPriorityTicketsRes.json();
                    const veryUrgent = await veryUrgentPriorityTicketsRes.json();

                    // setTickets(tickets.slice(0, numberOfTickets)); // || 10 Default to 4 if numberOfTickets is not set
                    setTickets(tickets);
                    setUnassignedTickets(unassigned);
                    setInprogressTickets(inprogress);
                    setResolvedTickets(resolved);
                    setClosedTickets(closed);
                    setAssignedTickets(assigned);

                    // Priority
                    setNormalPriorityTickets(normal);
                    setUrgentPriorityTickets(urgent);
                    setveryUrgentPriorityTickets(veryUrgent);

                    //fetch the number of Ticket handlers who are occupied
                    const occupiedSupportOfficers = await occupiedRes.json();
                    setOccupiedSupportOfficers(occupiedSupportOfficers);


                    //fetch the number of infousers available
                    const freeSupportOfficers = await freeSupportOfficersRes.json();
                    setFreeSupportOfficers(freeSupportOfficers);

                    const ticketHandlers = await supportOfficersRes.json();
                    setSupportOfficers(ticketHandlers.ticket_handlers);

                    //slight delay to ensure the state has been updated before using it
                    // setTimeout(updateChartData, 100)

                } catch (error) {
                    console.log("Error fetching ticket data:", error);
                } finally {
                    setLoading(false);
                }

            }

            fetchData();
        }


        if (loged_id_user.role === 'sysadmin'){
            const fetchData = async () => {
                try {
                    const [ticketsRes, assignedRes, inprogressRes, resolvedRes, closedRes, normalPriorityTicketsRes, urgentPriorityTicketsRes, veryUrgentPriorityTicketsRes] = await Promise.all([
                        fetch(`${apiUrl}/tickets`),

                        fetch(`${apiUrl}/tickets/status/assigned/${loged_id_user.hashing}`),
                        fetch(`${apiUrl}/tickets/status/ongoing/${loged_id_user.hashing}`),
                        fetch(`${apiUrl}/tickets/status/resolved/${loged_id_user.hashing}`),
                        fetch(`${apiUrl}/tickets/status/closed/${loged_id_user.hashing}`),
                        
                        fetch(`${apiUrl}/tickets/priority/normal/${loged_id_user.hashing}`),
                        fetch(`${apiUrl}/tickets/priority/urgent/${loged_id_user.hashing}`),
                        fetch(`${apiUrl}/tickets/priority/vurgent/${loged_id_user.hashing}`)
                    ]);

                    // const tickets = await ticketsRes.json();
                    const tickets = await ticketsRes.json();
                    const assigned = await assignedRes.json();
                    const inprogress = await inprogressRes.json();
                    const resolved = await resolvedRes.json();
                    const closed = await closedRes.json();

                    // Priority
                    const normal = await normalPriorityTicketsRes.json();
                    const urgent = await urgentPriorityTicketsRes.json();
                    const veryUrgent = await veryUrgentPriorityTicketsRes.json();

                    // setTickets(tickets.slice(0, numberOfTickets)); // || 10 Default to 4 if numberOfTickets is not set
                    setTickets(tickets);

                    setInprogressTickets(inprogress);
                    setResolvedTickets(resolved);
                    setClosedTickets(closed);
                    setAssignedTickets(assigned);

                    // Priority
                    setNormalPriorityTickets(normal);
                    setUrgentPriorityTickets(urgent);
                    setveryUrgentPriorityTickets(veryUrgent);

                    //slight delay to ensure the state has been updated before using it
                    // setTimeout(updateChartData, 100)

                } catch (error) {
                    console.log("Error fetching ticket data:", error);
                } finally {
                    setLoading(false);
                }

            }

            fetchData();
        }

    }, []);

    useEffect(() => {
        // Only update column chart when all 4 are fetched
        if (
            unassignedTickets.length > 0 ||
            assignedTickets.length > 0 ||
            inprogressTickets.length > 0 ||
            resolvedTickets.length > 0 ||
            closedTickets.length > 0
        ) {
            const labels = ['Unassigned', 'Assigned', 'Ongoing', 'Resolved', 'Closed'];
            const data = [
                unassignedTickets.length,
                assignedTickets.length,
                inprogressTickets.length,
                resolvedTickets.length,
                closedTickets.length
            ];

            const backgroundColors = ['#fa2c37', '#00bcd4', '#FFD700', '#0047AB', '#00c950'];

            const dataset = {
                labels,
                datasets: [{
                    label: 'Ticket Count',
                    data,
                    backgroundColor: backgroundColors
                }]
            };

            setBarChartData(dataset);
        }
    }, [unassignedTickets, assignedTickets, inprogressTickets, resolvedTickets, closedTickets]);


    /**
     * --------------------------------------------------------------------------------------------
     * -----------------------------  Ticket priority Chart  --------------------------------------
     * --------------------------------------------------------------------------------------------
     */
    useEffect(() => {
        // Only update doughnutchart when all 4 are fetched
        if (
            normalPriorityTickets.length > 0 ||
            urgentPriorityTickets.length > 0 ||
            veryUrgentPriorityTickets.length > 0
        ) {
            const labels = ['VeryUrgent', 'Urgent', 'Normal'];
            const data = [
                veryUrgentPriorityTickets.length,
                urgentPriorityTickets.length,
                normalPriorityTickets.length,
            ];

            const backgroundColors = ['#D2042D', '#FF7518', '#2E8B57'];

            const dataset = {
                labels,
                datasets: [{
                    label: 'Ticket Count',
                    data,
                    backgroundColor: backgroundColors
                }]
            };

            setPieChartData(dataset);
        }
    }, [normalPriorityTickets, urgentPriorityTickets, veryUrgentPriorityTickets]);



    return (
        loading ? (
            <div className='bg-gray-100'>Loading...</div>
        ) : (
            <div className='grow p-2 ml-16 md:ml-0 bg-gray-100'>

                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 `}>
                    
                    <Card icon={<BsPeopleFill />} title={"Teams"} value={unassignedTickets.length} bgColor={"bg-green-300"} nav_link={`/tickets/filter/${'unassigned'}`} />

                    <Card icon={<BiCalendar />} title={"Fixtures"} value={assignedTickets.length} bgColor={"bg--300"} nav_link={`/tickets/filter/${'assigned'}`} />

                    <Card icon={<BiSolidReceipt />} title={"Results"} value={inprogressTickets.length} bgColor={"bg-yellow-200"} nav_link={`/tickets/filter/${'ongoing'}`} />

                    <Card icon={<BsPersonFill />} title={"Players"} value={resolvedTickets.length} bgColor={"bg-blue-200"} nav_link={`/tickets/filter/${'resolved'}`} />

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart Section */}
                    <div className="bg-white  shadow-md p-4 ">
                        <h3 className="text-md font-bold text-[#082f6b] mb-6">Ticket Status comparison Summary</h3>
                        <div className="h-[300px] ">
                            {barChartData.labels.length > 0 && (
                                <Bar
                                    data={barChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        // cutout: '70%', // controls the doughnut hole size
                                        // borderRadius: 50, // rounds the edges of each arc
                                        // // borderWidth: 4, // makes the rounding more visible
                                        plugins: {
                                            legend: {
                                                display: true,
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

                    {/* Pie Chart Section */}
                    <div className="bg-white shadow-md p-6">
                        <h3 className="text-md font-bold text-[#082f6b] mb-6">Ticket Priority Summary</h3>
                        <div className="h-[300px] flex items-center justify-center">
                            {pieChartData.labels.length > 0 && (
                                <Doughnut
                                    data={pieChartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    boxWidth: 12,
                                                    padding: 15,
                                                },
                                            },
                                        },
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {(authenticatedUser.role === 'supervisor' || authenticatedUser.role === 'superadmin') ?
                    <div className="bg-white shadow-md p-3 w-full mb-4 mt-4">

                        {/* Stats Cards */}
                        <h2 className="text-xl font-bold text-[#082f6b] p-1">Support resources overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Card 1 */}
                            <div>
                                <div className="shadow  p-2 flex flex-col space-y-1 hover:scale-105 hover:shadow-lg transition-transform duration-300" onClick={() => handleOpenModal("Total support officers overview", `You have a total of ${supportOfficers.length} support officer(s) in the system. \n\n Right now ${occupiedSupportOfficers.length} support officer(s)  are occupied. \n\n Right now ${freeSupportOfficers.length} support officer(s) are free to be assigned new tickets.`)}>
                                    {/* <h3 className="text-sm text-gray-500 font-medium">Total Available support Officers</h3>
                                    <p className="text-2xl font-bold text-gray-800">{supportOfficers.length}</p> */}

                                    <div className="flex row items-center space-x-2">
                                        <span className=' p-1 text-teal-500'><BsPersonWorkspace /></span>
                                        <h3 className="text-sm text-[#082f6b] font-medium">Total Available support Officers</h3>
                                    </div>
                                    <p className="p-1 text-2xl font-bold text-gray-800">{supportOfficers.length}</p>
                                    <span className="h-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold w-fit"></span>

                                </div>
                                <SupportOfficerModel
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    title={modalContent.title}
                                    description={modalContent.description}
                                />
                            </div>

                            {/* Card 2 */}
                            <div>
                                <div className="shadow  p-2 flex flex-col space-y-1 hover:scale-105 hover:shadow-lg transition-transform duration-300" onClick={() => handleOpenModal("Occupied Support officers overview", `you have ${occupiedSupportOfficers.length} occupied support officer(s)`)}>
                                    <div className="flex row items-center space-x-2">
                                        <span className=' p-1 text-teal-500'><BsPersonFillCheck /></span>
                                        <h3 className="text-sm text-[#082f6b] font-medium">Occupied support Officers</h3>
                                    </div>
                                    <p className="p-1 text-2xl font-bold text-gray-800">{occupiedSupportOfficers.length}</p>
                                    <span className="h-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold w-fit"></span>
                                </div>
                                <SupportOfficerModel
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    title={modalContent.title}
                                    description={modalContent.description}
                                />
                            </div>

                            {/* Card 3 */}
                            <div>
                                <div className="shadow  p-2 flex flex-col space-y-1 hover:scale-105 hover:shadow-lg transition-transform duration-300" onClick={() => handleOpenModal("Free support officers, overview", `you have ${freeSupportOfficers.length} free support officer(s)  available to be assigned new tickets.`)}>
                                    {/* <h3 className="text-sm text-gray-500 font-medium">Free support officers</h3>
                                    <p className="text-2xl font-bold text-gray-800">{freeSupportOfficers.length}</p>
                                    <span className="h-2  text-xs bg-red-100 text-green-800 px-2 py-0.5 rounded-full font-semibold w-fit"></span> */}
                                    <div className="flex row items-center space-x-2">
                                        <span className=' p-1 text-teal-500'><BsPersonFillDash /></span>
                                        <h3 className="text-sm text-[#082f6b] font-medium">Free support officer</h3>
                                    </div>
                                    <p className="p-1 text-2xl font-bold text-gray-800">{freeSupportOfficers.length}</p>
                                    <span className="h-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold w-fit"></span>
                                </div>
                                <SupportOfficerModel
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    title={modalContent.title}
                                    description={modalContent.description}
                                />
                            </div>


                            {/* Card 4 */}
                            <div className="shadow p-2 flex flex-col space-y-1 hover:scale-105 hover:shadow-lg transition-transform duration-300 " onClick={() => navigate(`/tickets`)} >
                                {/* <h3 className="text-sm text-gray-500 font-medium">Total Tickets Overall</h3>
                                <p className="text-2xl font-bold text-gray-800">{tickets.length}</p>
                                <span className="h-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold w-fit"></span> */}
                                <div className="flex row items-center space-x-2">
                                    <span className=' p-1 text-teal-500'><GiTicket /></span>
                                    <h3 className="text-sm text-[#082f6b] font-medium">Total Tickets Overall</h3>
                                </div>
                                <p className="p-1 text-2xl font-bold text-gray-800">{tickets.length}</p>
                                <span className="h-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold w-fit"></span>
                            </div>
                        </div>
                    </div>
                    : ''}

            </div>
        )

    )
}

export default Dashboard