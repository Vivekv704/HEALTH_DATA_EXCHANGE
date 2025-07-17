import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import { uploadToPinata } from '../../utils/pinata'
import { uploadReport } from '../../utils/contract'

const PatientUpload = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
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
      }
    }

    initializeUser()
  }, [location.state])

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please select a file')
      return
    }
    
    setLoading(true)
    setMessage('')
    setError('')
    
    try {
      // Step 1: Upload file to Pinata IPFS
      setMessage('Uploading file to IPFS...')
      const pinataResult = await uploadToPinata(selectedFile, {
        name: selectedFile.name,
        description: description,
        patientHhNumber: user.hhNumber,
        uploadDate: new Date().toISOString()
      })
      
      if (!pinataResult.success) {
        throw new Error(`IPFS upload failed: ${pinataResult.error}`)
      }
      
      // Step 2: Store IPFS hash on blockchain
      setMessage('Storing report on blockchain...')
      const blockchainResult = await uploadReport(pinataResult.ipfsHash, description)
      
      if (!blockchainResult.success) {
        throw new Error(`Blockchain upload failed: ${blockchainResult.error}`)
      }
      
      setMessage(`Report uploaded successfully! IPFS Hash: ${pinataResult.ipfsHash}`)
      
      // Reset form
      setSelectedFile(null)
      setDescription('')
      
      // Reset file input
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
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
        <section className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Upload Reports</h1>
            <button 
              onClick={() => navigate('/patient/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 mb-2 font-semibold">Select Report File</label>
              <input 
                id="file-input"
                type="file" 
                onChange={handleFileChange}
                className="w-full border border-slate-300 rounded px-3 py-2"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
              </p>
            </div>
            
            <div>
              <label className="block text-slate-700 mb-2 font-semibold">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2"
                rows="4"
                placeholder="Describe the report (e.g., Blood test results, X-ray report, etc.)"
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !selectedFile}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Uploading...' : 'Upload Report'}
            </button>
          </form>
          
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
              {error}
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Reports are uploaded to IPFS for secure, decentralized storage and then referenced on the blockchain.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PatientUpload 