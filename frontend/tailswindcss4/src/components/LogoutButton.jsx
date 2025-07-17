import React from 'react'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear all stored user data
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear any cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Replace current history entry to prevent back navigation
    window.history.replaceState(null, '', '/')
    
    // Navigate to home page
    navigate('/', { replace: true })
    
    // Force page reload to clear any remaining state
    window.location.reload()
  }

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  )
}

export default LogoutButton 