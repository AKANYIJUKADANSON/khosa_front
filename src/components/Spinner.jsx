import React from 'react';
import { ClipLoader } from 'react-spinners';

const override = {
    display: 'block',
    margin: '100px auto'
}
const Spinner = (loading) => {
  return (
    <ClipLoader
        color='#FFA500'
        loading={loading}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
  )
}

export default Spinner