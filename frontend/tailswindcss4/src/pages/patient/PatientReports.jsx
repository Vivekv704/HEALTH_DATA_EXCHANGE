import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import { getPatientReports } from '../../utils/contract'
import { getPinataUrl } from '../../utils/pinata'

const PatientReports = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const initializeUser = () => {
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
        fetchReports()
      } else {
        setError('No user data found')
        setLoading(false)
      }
    }

    initializeUser()
  }, [location.state])

  const fetchReports = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getPatientReports()
      if (result.success) {
        setReports(result.reports)
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
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString()
  }

  const handleViewReport = (cid) => {
    const url = getPinataUrl(cid)
    window.open(url, '_blank')
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
        <section className="max-w-4xl w-full bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">View Reports</h1>
            <div className="flex gap-2">
              <button 
                onClick={fetchReports}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button 
                onClick={() => navigate('/patient/dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4">⏳</div>
              <p className="text-gray-600">Loading your reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4">❌</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchReports}
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
                You haven't uploaded any health reports yet.
              </p>
              <button 
                onClick={() => navigate('/patient/upload')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Upload Your First Report
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Health Reports ({reports.length})
              </h2>
              {reports.map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Report #{index + 1}
                      </h3>
                      <p className="text-gray-600 mb-2">{report.description}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Uploaded: {formatDate(report.timestamp)}</p>
                        <p>IPFS Hash: {report.cid}</p>
                        <p>Uploader: {report.uploader}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewReport(report.cid)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        View Report
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

export default PatientReports 