import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import DashboardCard from '../../components/hospital/DashboardCard'

const HospitalDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeUser = async () => {
      // First try to get user from location state
      let userData = location.state?.user
      
      if (!userData) {
        // Try to get from localStorage
        const storedUser = localStorage.getItem('hospitalUser')
        if (storedUser) {
          userData = JSON.parse(storedUser)
        }
      }
      
      if (userData) {
        setUser(userData)
        // Store in localStorage for persistence
        localStorage.setItem('hospitalUser', JSON.stringify(userData))
      } else {
        // If no user data, redirect to login
        navigate('/login')
        return
      }
      
      setLoading(false)
    }

    initializeUser()
  }, [location.state, navigate])

  const handleNavigation = (path) => {
    navigate(path, { state: { user } })
  }

  const dashboardItems = [
    {
      icon: '🏥',
      title: 'View Profile',
      description: 'View your hospital registration details and information',
      onClick: () => handleNavigation('/hospital/profile')
    },
    {
      icon: '👥',
      title: 'View Patient Lists',
      description: 'Access patients who have granted you permission to view their reports',
      onClick: () => handleNavigation('/hospital/patients')
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <LogoutButton />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-2xl mb-4">⏳</div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <LogoutButton />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">No user data found. Please login.</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <LogoutButton />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name}!</p>
          <p className="text-gray-600">Manage your patients and their health records</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HospitalDashboard 