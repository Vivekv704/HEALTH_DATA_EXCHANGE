import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import { getPatientReportsByDoctor, emergencyShare } from '../../utils/contract'

const EmergencyShare = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareLoading, setShareLoading] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  
  // Form state
  const [selectedReports, setSelectedReports] = useState([])
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyReason, setEmergencyReason] = useState('')
  const [shareAll, setShareAll] = useState(false)
  // Add new state for recipient hospital HH number
  const [recipientHhNumber, setRecipientHhNumber] = useState('')

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

  const handleReportSelection = (reportIndex) => {
    if (selectedReports.includes(reportIndex)) {
      setSelectedReports(selectedReports.filter(index => index !== reportIndex))
    } else {
      setSelectedReports([...selectedReports, reportIndex])
    }
  }

  const handleShareAllToggle = () => {
    setShareAll(!shareAll)
    if (!shareAll) {
      setSelectedReports(reports.map((_, index) => index))
    } else {
      setSelectedReports([])
    }
  }

  const handleEmergencyShare = async (e) => {
    e.preventDefault()
    if (!recipientHhNumber || recipientHhNumber.length !== 6) {
      setError('Please enter a valid 6-digit recipient hospital HH Number')
      return
    }
    if (!emergencyContact.trim()) {
      setError('Please enter emergency contact information')
      return
    }
    if (!emergencyReason.trim()) {
      setError('Please provide a reason for emergency sharing')
      return
    }
    if (selectedReports.length === 0 && !shareAll) {
      setError('Please select at least one report to share')
      return
    }
    setShareLoading(true)
    setError('')
    setShareSuccess(false)
    try {
      // Call the contract's emergencyShare function
      const result = await emergencyShare(patient.hhNumber, recipientHhNumber)
      if (!result.success) {
        throw new Error(result.error)
      }
      setShareSuccess(true)
      setEmergencyContact('')
      setEmergencyReason('')
      setRecipientHhNumber('')
      setSelectedReports([])
      setShareAll(false)
    } catch (err) {
      console.error('Emergency share error:', err)
      setError(err.message || 'Failed to share reports in emergency')
    } finally {
      setShareLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
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
              <h1 className="text-3xl font-bold text-red-600">🚨 Emergency Share</h1>
              <p className="text-gray-600 mt-1">Emergency sharing for {patient.name}</p>
            </div>
            <button 
              onClick={() => navigate('/hospital/patients', { state: { user } })}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Patients
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <div className="text-2xl mr-2">⚠️</div>
              <h2 className="text-lg font-semibold text-red-800">Emergency Access Warning</h2>
            </div>
            <p className="text-red-700 text-sm">
              <strong>Important:</strong> Emergency sharing bypasses normal consent procedures. 
              This action will be logged and the patient will be notified. 
              Only use this feature in genuine emergency situations.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div><strong>Name:</strong> {patient.name}</div>
              <div><strong>HH Number:</strong> {patient.hhNumber}</div>
              <div><strong>Email:</strong> {patient.email}</div>
            </div>
          </div>

          {shareSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-2xl mr-2">✅</div>
                <div>
                  <h3 className="text-green-800 font-semibold">Emergency Access Granted!</h3>
                  <p className="text-green-700 text-sm">
                    Patient reports have been shared with the emergency contact. 
                    The patient has been notified of this emergency access.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-2xl mr-2">❌</div>
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleEmergencyShare} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Hospital HH Number *
                </label>
                <input
                  type="text"
                  value={recipientHhNumber}
                  onChange={(e) => setRecipientHhNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter 6-digit HH Number"
                  maxLength="6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact *
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Doctor name, hospital, or contact details"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Reason *
                </label>
                <input
                  type="text"
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Critical care, surgery, etc."
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="share-all"
                checked={shareAll}
                onChange={handleShareAllToggle}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="share-all" className="ml-2 block text-sm text-gray-700">
                Share all patient reports
              </label>
            </div>

            {!shareAll && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Reports to Share</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-2xl mb-4">⏳</div>
                    <p className="text-gray-600">Loading reports...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reports available for this patient.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {reports.map((report, index) => (
                      <div key={index} className="flex items-center p-3 border border-gray-200 rounded">
                        <input
                          type="checkbox"
                          id={`report-${index}`}
                          checked={selectedReports.includes(index)}
                          onChange={() => handleReportSelection(index)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`report-${index}`} className="ml-3 flex-1 cursor-pointer">
                          <div className="font-medium text-gray-800">
                            {report.description || 'No description'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(report.timestamp)}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={shareLoading || (selectedReports.length === 0 && !shareAll)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {shareLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sharing Reports...
                  </span>
                ) : (
                  '🚨 Grant Emergency Access'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/hospital/patients', { state: { user } })}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default EmergencyShare 