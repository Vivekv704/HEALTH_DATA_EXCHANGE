import React from 'react'

const DashboardCard = ({ icon, title, description, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${className}`}
    >
      <div className="text-4xl mb-4 text-blue-600">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

export default DashboardCard 