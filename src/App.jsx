import React from 'react';
import './App.css';

import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements,
  RouterProvider 
  } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/dashboard/Dashboard';
import PageNotFound from './pages/PageNotFound';
import LoginPage from './pages/Auth/LoginPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import 'react-toastify/dist/ReactToastify.css'; 
import Logout from './pages/Auth/Logout';
import ManageFixtures from './pages/fixtures/ManageFixtures';
import ManageTeams from './pages/teams/ManageTeams';
import ManageResults from './pages/results/ManageResults';
import ManagePosts from './pages/posts/ManagePosts';
import ManagePlayers from './pages/players/ManagePlayers';
import ManageAbout, { aboutLoader } from './pages/about/ManageAbout';
import AddWallHero from './pages/teams/AddWallHero';
import FixturePage, { fixtureLoader } from './pages/fixtures/FixturePage';
import ResultPage, { resultLoader } from './pages/results/ResultPage';
import Matchdays, { matchdayLoader } from './pages/matchdays/Matchdays';
import PostPage, { postLoader } from './pages/posts/PostPage';
import PlayerPage, { playerLoader } from './pages/players/PlayerPage';
import ManageMatchdays from './pages/matchdays/ManageMatchdays';
import Seasons from './pages/seasons/Seasons';
import EditSeasons, { seasonLoader} from './pages/seasons/EditSeasons';
import Gallery from './pages/gallery/Gallery';
import Smlinks from './pages/sm/Smlinks';
import EditSm, { smlinkLoader } from './pages/sm/EditSm';


const router = createBrowserRouter(
  
  createRoutesFromElements(
    <>

      <Route path='/' element={ <AuthLayout /> }  >
        <Route index element={ <LoginPage />} /> 
        <Route path='/logout' element={ <Logout /> } />
        <Route path="/resetpassword" element={ <ResetPasswordPage />} /> 
      </Route>
      
      <Route  element={ <MainLayout /> }  >
        <Route path='/dashboard' element={ <Dashboard />} />
        <Route path='/fixtures' element={ <ManageFixtures />} />
        <Route path='/results' element={ <ManageResults />} />
        <Route path='/wallhero' element={ <AddWallHero />} />
        <Route path='/posts' element={ <ManagePosts />} />
        <Route path='/players' element={ <ManagePlayers />} />
        <Route path='/teams' element={ <ManageTeams />} />
        <Route path='/gallery' element={ <Gallery />} />
        <Route path='/seasons' element={ <Seasons />} />
        <Route path='/smlinks' element={ <Smlinks />} />
        <Route path='/matchdays' element={ <ManageMatchdays />} />
        <Route path='/matchdays/update/:hashing' element={ <Matchdays />} loader = {matchdayLoader} />
        <Route path='/seasons/update/:hashing' element={ <EditSeasons />} loader = {seasonLoader } />
        <Route path='/about' element={ <ManageAbout />} loader = {aboutLoader} />
        <Route path='/smlinks/update/:hashing' element={ <EditSm />} loader = {smlinkLoader} />

        <Route path='/fixtures/:hashing' element= { <FixturePage />} loader={fixtureLoader} />
        <Route path='/fixtures/update/:hashing' element= { <FixturePage initIsUpdateFixture = {true} />} loader={fixtureLoader} />

        <Route path='/results/:hashing' element= { <ResultPage />} loader={resultLoader} />
        <Route path='/results/update/:hashing' element= { <ResultPage initIsUpdateResult = {true} />} loader={resultLoader} />
        <Route path='/posts/:hashing' element= { <PostPage />} loader={postLoader} />

        <Route path='/players/:hashing' element= { <PlayerPage />} loader={playerLoader} />

        <Route path='/profile' element={ <ProfilePage />} /> 
      </Route>

      <Route path='*' element={ <PageNotFound />} /> 

    </>
  )
);

function App() {
  return <RouterProvider router = {router} />
}

export default App
