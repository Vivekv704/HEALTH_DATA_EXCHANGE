import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import DashboardCard from '../../components/patient/DashboardCard'
import { getUserByHhNumber } from '../../utils/contract'

const PatientDashboard = () => {
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
        const storedUser = localStorage.getItem('patientUser')
        if (storedUser) {
          userData = JSON.parse(storedUser)
        }
      }
      
      if (userData) {
        setUser(userData)
        // Store in localStorage for persistence
        localStorage.setItem('patientUser', JSON.stringify(userData))
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
      icon: '👤',
      title: 'View Profile',
      description: 'View your registration details and personal information',
      onClick: () => handleNavigation('/patient/profile')
    },
    {
      icon: '📋',
      title: 'View Reports',
      description: 'Access and view all your health reports',
      onClick: () => handleNavigation('/patient/reports')
    },
    {
      icon: '📤',
      title: 'Upload Reports',
      description: 'Upload new health reports and medical documents',
      onClick: () => handleNavigation('/patient/upload')
    },
    {
      icon: '🔐',
      title: 'Grant Permission',
      description: 'Grant or revoke access to doctors and hospitals',
      onClick: () => handleNavigation('/patient/permissions')
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name}!</p>
          <p className="text-gray-600">Manage your health records and permissions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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

export default PatientDashboard 