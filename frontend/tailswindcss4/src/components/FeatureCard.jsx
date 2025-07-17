import React from 'react'

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
    <div className="text-blue-600 text-4xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm">{description}</p>
  </div>
)

export default FeatureCard 