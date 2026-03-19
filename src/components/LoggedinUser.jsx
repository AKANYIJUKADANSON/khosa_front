import React from 'react'

const LoggedinUser = () => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const formData = new FormData();
    formData.append('loggedin_user_id', userdata.user_id);
}

export default LoggedinUser