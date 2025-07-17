import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LoginForm from '../components/LoginForm'
import { BrowserProvider, Contract } from 'ethers'
import healthExchangeAbi from '../../../../artifacts/contracts/HealthExchange.sol/HealthExchange.json'
import { useNavigate } from 'react-router-dom'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async ({ hhNumber, role }) => {
    setLoading(true)
    setError('')
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected')
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, healthExchangeAbi.abi, signer)
      
      // Get the address mapped to this HH number
      const userAddress = await contract.hhToAddress(parseInt(hhNumber))
      if (userAddress === '0x0000000000000000000000000000000000000000') throw new Error('User not found')
      
      const user = await contract.users(userAddress)
      console.log('Raw user data from contract:', user)
      
      if (parseInt(user[5]) !== role) throw new Error('Role does not match')
      
      // Map the array-like structure to named properties
      const userData = {
        name: user[0],           // name
        email: user[1],          // email
        phone: user[2],          // phone
        hhNumber: user[3].toString(), // hhNumber (BigNumber)
        addr: user[4],           // addr
        role: user[5].toString(), // role (BigNumber)
        wallet: user[6],         // wallet
        exists: user[7]          // exists
      }
      
      console.log('Processed user data:', userData)
      
      // Redirect based on role
      if (role === 1) { // Patient
        navigate('/patient/dashboard', { state: { user: userData } })
      } else if (role === 2) { // Doctor
        navigate('/doctor/dashboard', { state: { user: userData } })
      } else if (role === 3) { // Hospital
        navigate('/hospital/dashboard', { state: { user: userData } })
      } else {
        navigate('/profile', { state: { user: userData } })
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-16">
        <section className="w-full max-w-xl p-8 bg-white rounded-lg shadow">
          <h1 className="mb-4 text-3xl font-bold text-center text-blue-600">Login</h1>
          <LoginForm onLogin={handleLogin} loading={loading} />
          {error && <div className="mt-4 text-center text-red-600">{error}</div>}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Login 