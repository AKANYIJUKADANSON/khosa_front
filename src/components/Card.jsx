import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const Card = ({icon, title, value, nav_link}) => {

  const navigate = useNavigate();

  const getColorClass = () => {
    switch (title) {
      case 'Teams':
        return 'text-red-500';
      case 'Fixtures':
        return 'text-blue-500';
      case 'Results':
        return 'text-green-500';
      case 'Players':
        return 'text-yellow-500';
    }
  }

  const getIndicatorColorClass = () => {
    switch (title) {
      case 'Teams':
        return 'bg-red-500';
      case 'Fixtures':
        return 'bg-blue-500';
      case 'Results': 
        return 'bg-green-500';
      case 'Players':
        return 'bg-yellow-500';
    }
  };

  return (


    <div className="bg-white p-4 shadow-md border border-gray-200 h-32 hover:scale-105 transition-transform duration-300"
    // onClick={ () => navigate(nav_link)}
    >
      <div className={`w-3 mb-3 float-end top-2 right-2 ${getIndicatorColorClass()} text-white text-xs font-semibold px-5 py-2 rounded-full`}>
        
      </div>
      <div className="flex flex-col h-full space-y-3">
        <div className={`text-lg ${getColorClass()}`}>
          {icon}
        </div>
        <div>
          <p className={`text-md  ${getColorClass()}`}>{title}</p>
          <h3 className="text-2xl font-bold text-[#082f6b]">{value}</h3>
        </div>
      </div>
    </div>
  )
}

export default Card