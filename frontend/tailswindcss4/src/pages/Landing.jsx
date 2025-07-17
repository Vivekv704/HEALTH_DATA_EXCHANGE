import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'

const features = [
  {
    icon: '🔒',
    title: 'Role-Based Authentication',
    description: 'Secure access for Patients, Doctors, and Hospitals with unique permissions.'
  },
  {
    icon: '📄',
    title: 'Patient Report Management',
    description: 'Upload, view, share, and revoke access to health reports securely.'
  },
  {
    icon: '👨‍⚕️',
    title: 'Doctor & Hospital Access',
    description: 'Doctors and hospitals can view/add reports with patient consent.'
  },
  {
    icon: '🛡️',
    title: 'Immutable Logs',
    description: 'Transparent, tamper-proof logs for all data access and modifications.'
  },
  {
    icon: '⚡',
    title: 'Blockchain & IPFS',
    description: 'Data stored securely using Ethereum and Pinata (IPFS).'  
  }
]

const Landing = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col w-full">
    <Header />
    <main className="flex-1 w-full">
      <section className="bg-blue-600 text-white py-16 px-4 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Secure Electronic Health Records on Blockchain</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8">Revolutionizing healthcare data management with role-based access, immutable logs, and secure sharing using blockchain and IPFS.</p>
        <a href="#" className="inline-block bg-cyan-400 text-blue-900 font-semibold px-8 py-3 rounded shadow hover:bg-cyan-300 transition">Get Started</a>
      </section>
      <section className="w-full py-16 px-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Key Features</h2>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
)

export default Landing 