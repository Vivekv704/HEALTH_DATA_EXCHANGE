import React, { useState } from 'react'

const roles = [
  { label: 'Patient', value: 1 },
  { label: 'Doctor', value: 2 },
  { label: 'Hospital', value: 3 },
]

const LoginForm = ({ onLogin, loading }) => {
  const [role, setRole] = useState(1)
  const [hhNumber, setHhNumber] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(hhNumber)) {
      setError('HH Number must be 6 digits')
      return
    }
    onLogin({ hhNumber, role })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex justify-center gap-4 mb-4">
        {roles.map(r => (
          <button
            type="button"
            key={r.value}
            className={`px-4 py-2 rounded font-semibold border transition ${role === r.value ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
            onClick={() => setRole(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div>
        <label className="block text-slate-700 mb-1" htmlFor="hhNumber">HH Number</label>
        <input id="hhNumber" name="hhNumber" type="text" className="w-full border border-slate-300 rounded px-3 py-2" value={hhNumber} onChange={e => setHhNumber(e.target.value)} required />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm 