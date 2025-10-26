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
import ManageGallery from './pages/gallery/ManageGallery';
import ManagePlayers from './pages/players/ManagePlayers';
import ManageAbout from './pages/about/ManageAbout';
import TestResults from './pages/results/TestResults';
import AddWallHero from './pages/teams/AddWallHero';


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
        <Route path='/gallery' element={ <ManageGallery />} />
        <Route path='/about' element={ <ManageAbout />} />

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
