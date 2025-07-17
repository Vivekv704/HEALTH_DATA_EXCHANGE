import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import { addReportToPatient } from '../../utils/contract'
import { uploadToPinata } from '../../utils/pinata'

const AddPrescription = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Form state
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [includeReport, setIncludeReport] = useState(false)

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!description.trim()) {
      setError('Please enter a prescription description')
      return
    }

    if (includeReport && !selectedFile) {
      setError('Please select a file when including a report')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      let cid = ''
      
      if (includeReport && selectedFile) {
        // Upload file to IPFS
        const uploadResult = await uploadToPinata(selectedFile)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error)
        }
        cid = uploadResult.ipfsHash
      }

      // Add prescription to patient
      const result = await addReportToPatient(patient.hhNumber, cid, description)
      if (!result.success) {
        throw new Error(result.error)
      }

      setSuccess(true)
      setDescription('')
      setSelectedFile(null)
      setIncludeReport(false)
      
      // Reset file input
      const fileInput = document.getElementById('file-input')
      if (fileInput) {
        fileInput.value = ''
      }

    } catch (err) {
      console.error('Add prescription error:', err)
      setError(err.message || 'Failed to add prescription')
    } finally {
      setLoading(false)
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
        <section className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Add Prescription</h1>
            <button 
              onClick={() => navigate('/hospital/patients', { state: { user } })}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Patients
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Patient Information</h2>
            <p className="text-blue-700"><strong>Name:</strong> {patient.name}</p>
            <p className="text-blue-700"><strong>HH Number:</strong> {patient.hhNumber}</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-2xl mr-2">✅</div>
                <div>
                  <h3 className="text-green-800 font-semibold">Prescription Added Successfully!</h3>
                  <p className="text-green-700 text-sm">The prescription has been added to the patient's records.</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prescription Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Enter prescription details, dosage, instructions, etc."
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="include-report"
                checked={includeReport}
                onChange={(e) => setIncludeReport(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-report" className="ml-2 block text-sm text-gray-700">
                Include a medical report or document
              </label>
            </div>

            {includeReport && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Report/Document
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required={includeReport}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Prescription...
                  </span>
                ) : (
                  'Add Prescription'
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

export default AddPrescription 