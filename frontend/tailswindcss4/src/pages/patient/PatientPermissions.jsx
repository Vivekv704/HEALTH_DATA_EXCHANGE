import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'
import { grantAccess, revokeAccess, getUserByHhNumber } from '../../utils/contract'

const PatientPermissions = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [granteeHhNumber, setGranteeHhNumber] = useState('')
  const [action, setAction] = useState('grant') // 'grant' or 'revoke'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [granteeInfo, setGranteeInfo] = useState(null)

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

  const handleHhNumberChange = async (e) => {
    const hhNumber = e.target.value
    setGranteeHhNumber(hhNumber)
    setMessage('')
    setError('')
    setGranteeInfo(null)

    if (hhNumber.length === 6 && /^\d{6}$/.test(hhNumber)) {
      try {
        const result = await getUserByHhNumber(hhNumber)
        if (result.success) {
          setGranteeInfo(result.user)
        } else {
          setError('User not found with this HH Number')
        }
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(granteeHhNumber)) {
      setError('Please enter a valid 6-digit HH Number')
      return
    }
    
    if (!granteeInfo) {
      setError('Please enter a valid HH Number of an existing user')
      return
    }

    // Check if grantee is doctor or hospital
    const granteeRole = parseInt(granteeInfo.role)
    if (granteeRole !== 2 && granteeRole !== 3) {
      setError('You can only grant access to doctors or hospitals')
      return
    }
    
    setLoading(true)
    setMessage('')
    setError('')
    
    try {
      let result
      if (action === 'grant') {
        result = await grantAccess(user.hhNumber, granteeHhNumber)
      } else {
        result = await revokeAccess(user.hhNumber, granteeHhNumber)
      }
      
      if (result.success) {
        setMessage(`${action === 'grant' ? 'Access granted' : 'Access revoked'} successfully! Transaction: ${result.txHash}`)
        setGranteeHhNumber('')
        setGranteeInfo(null)
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Permission error:', err)
      setError(err.message || `${action === 'grant' ? 'Grant' : 'Revoke'} permission failed`)
    } finally {
      setLoading(false)
    }
  }

  const roleLabels = ['None', 'Patient', 'Doctor', 'Hospital']

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
            <h1 className="text-3xl font-bold text-blue-600">Grant Permission</h1>
            <button 
              onClick={() => navigate('/patient/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 mb-2 font-semibold">Action</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    value="grant" 
                    checked={action === 'grant'}
                    onChange={(e) => setAction(e.target.value)}
                    className="mr-2"
                    disabled={loading}
                  />
                  Grant Access
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    value="revoke" 
                    checked={action === 'revoke'}
                    onChange={(e) => setAction(e.target.value)}
                    className="mr-2"
                    disabled={loading}
                  />
                  Revoke Access
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-slate-700 mb-2 font-semibold">
                {action === 'grant' ? 'Grant Access to' : 'Revoke Access from'} (HH Number)
              </label>
              <input 
                type="text" 
                value={granteeHhNumber}
                onChange={handleHhNumberChange}
                className="w-full border border-slate-300 rounded px-3 py-2"
                placeholder="Enter 6-digit HH Number"
                maxLength="6"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the HH Number of the doctor or hospital you want to {action} access to.
              </p>
            </div>

            {granteeInfo && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">User Found:</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Name:</strong> {granteeInfo.name}</p>
                  <p><strong>Role:</strong> {roleLabels[parseInt(granteeInfo.role)]}</p>
                  <p><strong>Email:</strong> {granteeInfo.email}</p>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading || !granteeHhNumber || !granteeInfo}
              className={`w-full font-semibold py-2 rounded transition ${
                action === 'grant' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              } disabled:bg-gray-400`}
            >
              {loading ? 'Processing...' : `${action === 'grant' ? 'Grant' : 'Revoke'} Access`}
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
            <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Enter the HH Number of a doctor or hospital</li>
              <li>• The system will verify the user exists and has the correct role</li>
              <li>• Grant access to allow them to view your reports</li>
              <li>• Revoke access to remove their permissions</li>
              <li>• All actions are recorded on the blockchain for transparency</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PatientPermissions 