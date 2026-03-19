import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const Logout = () => {
    // If used vite to create the react app
    const apiUrl = import.meta.env.VITE_API_URL;

    // initiate the navigate function
    const navigate = useNavigate();

    const userdata = JSON.parse(localStorage.getItem('userdata'));

    useEffect( () => {
        const logoutUser = async () => {
            try{
                const logout = await fetch(`${apiUrl}/logout/${userdata.hashing}`)

                const data = await logout.json();
                // console.log('CI3_response', data);

                if (data.status === '200') { 
                    localStorage.clear();
                    navigate('/');
                } else {
                    return;
                }
                
            }catch(error){
                toast.error(error.message + '. Internal server error. please try again later.');
                return;
            }
        }

        logoutUser();

    }, [ userdata.hashing, apiUrl, navigate ]);

}

export default Logout