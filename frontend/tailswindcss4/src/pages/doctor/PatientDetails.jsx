import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'

const PatientDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)

  useEffect(() => {
    const initializeData = () => {
      const userData = location.state?.user
      const patientData = location.state?.patient
      
      if (userData) {
        setUser(userData)
      }
      
      if (patientData) {
        setPatient(patientData)
      }
    }

    initializeData()
  }, [location.state])

  if (!user || !patient) {
    return (
      <div className="min-h-screen flex flex-col">
        <LogoutButton />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-red-600">No data found. Please go back to patient list.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate('/doctor/patients')}>Back to Patients</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <LogoutButton />
      <main className="flex items-center justify-center py-16 px-4">
        <section className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Patient Details</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/doctor/add-prescription', { state: { patient, user } })}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Add Prescription
              </button>
              <button 
                onClick={() => navigate('/doctor/patients', { state: { user } })}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Back to Patients
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-lg text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">HH Number</label>
                  <p className="mt-1 text-lg text-gray-900">{patient.hhNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <p className="mt-1 text-lg text-gray-900">{patient.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="mt-1 text-lg text-gray-900">{patient.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Access Information</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800">Access granted to view health records</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800">Permission to add prescriptions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800">Access to view medical reports</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/doctor/add-prescription', { state: { patient, user } })}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                  <span className="mr-2">💊</span>
                  Add Prescription
                </button>
                <button
                  onClick={() => navigate('/doctor/patient-reports', { state: { patient, user } })}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                  <span className="mr-2">📋</span>
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PatientDetails 