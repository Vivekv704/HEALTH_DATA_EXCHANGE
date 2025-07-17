import React, { useState } from 'react'

const roles = [
  { label: 'Patient', value: 1 },
  { label: 'Doctor', value: 2 },
  { label: 'Hospital', value: 3 },
]

const RegisterForm = ({ onRegister, loading, resetForm }) => {
  const [role, setRole] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    hhNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!/^\d{6}$/.test(form.hhNumber)) {
      setError('HH Number must be 6 digits')
      return
    }
    onRegister({ ...form, role })
  }

  // Reset form when resetForm prop is true
  React.useEffect(() => {
    if (resetForm) {
      setForm({
        name: '',
        email: '',
        phone: '',
        hhNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
      })
      setRole(1)
      setError('')
    }
  }, [resetForm])

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
        <label className="block text-slate-700 mb-1" htmlFor="name">Name</label>
        <input id="name" name="name" type="text" className="w-full border border-slate-300 rounded px-3 py-2" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-slate-700 mb-1" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="w-full border border-slate-300 rounded px-3 py-2" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-slate-700 mb-1" htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="text" className="w-full border border-slate-300 rounded px-3 py-2" value={form.phone} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-slate-700 mb-1" htmlFor="hhNumber">HH Number</label>
        <input id="hhNumber" name="hhNumber" type="text" className="w-full border border-slate-300 rounded px-3 py-2" value={form.hhNumber} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-slate-700 mb-1" htmlFor="address">Address</label>
        <input id="address" name="address" type="text" className="w-full border border-slate-300 rounded px-3 py-2" value={form.address} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-slate-700 mb-1" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="w-full border border-slate-300 rounded px-3 py-2" value={form.password} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-slate-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" className="w-full border border-slate-300 rounded px-3 py-2" value={form.confirmPassword} onChange={handleChange} required />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

export default RegisterForm 