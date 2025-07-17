import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const roleLabels = ['None', 'Patient', 'Doctor', 'Hospital']

const Profile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state?.user

  console.log('Profile component - location.state:', location.state)
  console.log('Profile component - user data:', user)

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-red-600">No user data found. Please login.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <section className="max-w-xl w-full bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Registration Details</h1>
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
      <Footer />
    </div>
  )
}

export default Profile 