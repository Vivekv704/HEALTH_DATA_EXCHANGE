import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import { getPatientReportsByDoctor } from '../../utils/contract'

const PatientReports = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const initializeData = async () => {
      const userData = location.state?.user
      const patientData = location.state?.patient
      
      if (userData) {
        setUser(userData)
      }
      
      if (patientData) {
        setPatient(patientData)
        fetchReports(patientData.hhNumber)
      }
    }

    initializeData()
  }, [location.state])

  const fetchReports = async (patientHhNumber) => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getPatientReportsByDoctor(patientHhNumber)
      if (result.success) {
        setReports(result.reports || [])
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Fetch reports error:', err)
      setError('Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const openReport = (cid) => {
    if (cid) {
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`
      window.open(url, '_blank')
    }
  }

  if (!user || !patient) {
    return (
      <div className="min-h-screen flex flex-col">
        <LogoutButton />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-red-600">No data found. Please go back to patient list.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate('/hospital/patients')}>Back to Patients</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <LogoutButton />
      <main className="flex items-center justify-center py-16 px-4">
        <section className="max-w-4xl w-full bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Patient Reports</h1>
              <p className="text-gray-600 mt-1">Viewing reports for {patient.name}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fetchReports(patient.hhNumber)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button 
                onClick={() => navigate('/hospital/add-prescription', { state: { patient, user } })}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Add Prescription
              </button>
              <button 
                onClick={() => navigate('/hospital/emergency-share', { state: { patient, user } })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Emergency Share
              </button>
              <button 
                onClick={() => navigate('/hospital/patients', { state: { user } })}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Back to Patients
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div><strong>Name:</strong> {patient.name}</div>
              <div><strong>HH Number:</strong> {patient.hhNumber}</div>
              <div><strong>Email:</strong> {patient.email}</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4">⏳</div>
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4">❌</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchReports(patient.hhNumber)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Reports Found</h2>
              <p className="text-gray-600 mb-6">
                This patient doesn't have any reports yet.
              </p>
              <button
                onClick={() => navigate('/hospital/add-prescription', { state: { patient, user } })}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Add First Report
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Reports ({reports.length})
                </h2>
                <button
                  onClick={() => navigate('/hospital/add-prescription', { state: { patient, user } })}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Add New Report
                </button>
              </div>
              
              {reports.map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Report #{index + 1}
                        </span>
                        {report.cid && (
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            Has File
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {report.description || 'No description provided'}
                      </h3>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Date:</strong> {formatDate(report.timestamp)}</p>
                        {report.cid && (
                          <p><strong>File ID:</strong> {report.cid}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {report.cid && (
                        <button
                          onClick={() => openReport(report.cid)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                        >
                          View File
                        </button>
                      )}
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

export default PatientReports 