import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import { getPatientsWithAccess } from '../../utils/contract'

const HospitalPatients = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        fetchPatients(userData.wallet)
      } else {
        setError('No user data found')
        setLoading(false)
      }
    }

    initializeUser()
  }, [location.state])

  const fetchPatients = async (hospitalAddress) => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getPatientsWithAccess(hospitalAddress)
      if (result.success) {
        setPatients(result.patients)
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Fetch patients error:', err)
      setError('Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  const handleViewPatientDetails = (patient) => {
    navigate('/hospital/patient-details', { state: { patient, user } })
  }

  const handleAddPrescription = (patient) => {
    navigate('/hospital/add-prescription', { state: { patient, user } })
  }

  const handleViewReports = (patient) => {
    navigate('/hospital/patient-reports', { state: { patient, user } })
  }

  const handleEmergencyShare = (patient) => {
    navigate('/hospital/emergency-share', { state: { patient, user } })
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
        <section className="max-w-6xl w-full bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Patient List</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => fetchPatients(user.wallet)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button 
                onClick={() => navigate('/hospital/dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4">⏳</div>
              <p className="text-gray-600">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4">❌</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchPatients(user.wallet)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Patients Found</h2>
              <p className="text-gray-600 mb-6">
                No patients have granted you access to their health records yet.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Patients need to grant you permission from their dashboard before you can access their records.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Patients ({patients.length})
              </h2>
              {patients.map((patient, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {patient.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>HH Number:</strong> {patient.hhNumber}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                        <p><strong>Phone:</strong> {patient.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleViewPatientDetails(patient)}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleAddPrescription(patient)}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                      >
                        Add Prescription
                      </button>
                      <button
                        onClick={() => handleViewReports(patient)}
                        className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
                      >
                        View Reports
                      </button>
                      <button
                        onClick={() => handleEmergencyShare(patient)}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                      >
                        Emergency Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default HospitalPatients 