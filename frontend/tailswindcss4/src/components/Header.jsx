import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <header className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img src="/vite.svg" alt="Logo" className="h-10 w-10" />
      <span className="text-2xl font-bold text-blue-600">Secure Electronic Health Records</span>
    </div>
    <nav className="space-x-8">
      <Link to="/" className="text-slate-900 hover:text-blue-600 font-medium">Home</Link>
      <Link to="/about" className="text-slate-900 hover:text-blue-600 font-medium">About Us</Link>
      <Link to="/contact" className="text-slate-900 hover:text-blue-600 font-medium">Contact Us</Link>
      <Link to="/register" className="text-slate-900 hover:text-blue-600 font-medium">Register</Link>
      <Link to="/login" className="text-slate-900 hover:text-blue-600 font-medium">Login</Link>
    </nav>
  </header>
)

export default Header 