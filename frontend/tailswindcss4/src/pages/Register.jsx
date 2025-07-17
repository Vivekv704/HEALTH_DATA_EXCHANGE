import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegisterForm from '../components/RegisterForm'
import { BrowserProvider, Contract } from 'ethers'
import healthExchangeAbi from '../../../../artifacts/contracts/HealthExchange.sol/HealthExchange.json'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resetForm, setResetForm] = useState(false)

  const handleRegister = async ({ name, email, phone, hhNumber, address, password, role }) => {
    setLoading(true)
    setMessage('')
    setError('')
    setResetForm(false)
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected')
      
      // Get the current account at registration time
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const currentAccount = accounts[0]
      
      if (!currentAccount) throw new Error('No account connected')
      
      console.log('Registering with account:', currentAccount)
      
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, healthExchangeAbi.abi, signer)
      
      console.log({ name, email, phone, hhNumber, address, password, role, CONTRACT_ADDRESS, account: currentAccount })
      
      const tx = await contract.register(name, email, phone, parseInt(hhNumber), address, password, role)
      await tx.wait()
      setMessage(`Registration successful! Account: ${currentAccount}`)
      setResetForm(true) // Reset the form after successful registration
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-16">
        <section className="w-full max-w-xl p-8 bg-white rounded-lg shadow">
          <h1 className="mb-4 text-3xl font-bold text-center text-blue-600">Register</h1>
          <div className="p-3 mb-4 text-sm border border-blue-200 rounded bg-blue-50">
            <strong>Note:</strong> Make sure you have the correct MetaMask account selected before registering.
          </div>
          <RegisterForm onRegister={handleRegister} loading={loading} resetForm={resetForm} />
          {message && <div className="mt-4 text-center text-green-600">{message}</div>}
          {error && <div className="mt-4 text-center text-red-600">{error}</div>}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Register 