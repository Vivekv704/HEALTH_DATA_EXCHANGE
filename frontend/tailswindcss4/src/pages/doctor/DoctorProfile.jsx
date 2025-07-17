import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'

const roleLabels = ['None', 'Patient', 'Doctor', 'Hospital']

const DoctorProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeUser = () => {
      // First try to get user from location state
      let userData = location.state?.user
      
      if (!userData) {
        // Try to get from localStorage
        const storedUser = localStorage.getItem('doctorUser')
        if (storedUser) {
          userData = JSON.parse(storedUser)
        }
      }
      
      if (userData) {
        setUser(userData)
      }
      
      setLoading(false)
    }

    initializeUser()
  }, [location.state])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <LogoutButton />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-4">⏳</div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <LogoutButton />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-red-600">No user data found. Please login.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <LogoutButton />
      <main className="flex items-center justify-center py-16 px-4">
        <section className="max-w-xl w-full bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Doctor Profile</h1>
            <button 
              onClick={() => navigate('/doctor/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
          <div className="space-y-4">
            <div><span className="font-semibold">Name:</span> {user.name || 'N/A'}</div>
            <div><span className="font-semibold">Email:</span> {user.email || 'N/A'}</div>
            <div><span className="font-semibold">Phone:</span> {user.phone || 'N/A'}</div>
            <div><span className="font-semibold">HH Number:</span> {user.hhNumber || 'N/A'}</div>
            <div><span className="font-semibold">Address:</span> {user.addr || 'N/A'}</div>
            <div><span className="font-semibold">Role:</span> {roleLabels[parseInt(user.role) || 0]}</div>
            <div><span className="font-semibold">Wallet Address:</span> {user.wallet || 'N/A'}</div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DoctorProfile 