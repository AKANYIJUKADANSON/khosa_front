import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Logout = () => {
    // If used vite to create the react app
    // const apiUrl = import.meta.env.VITE_API_URL;

    // initiate the navigate function
    const navigate = useNavigate();

    useEffect( () => {
        const logoutUser = async () => {
            // clear local storage data
            localStorage.clear();
            return navigate('/login');
        }

        logoutUser();

    }, [ navigate]);

}

export default Logout