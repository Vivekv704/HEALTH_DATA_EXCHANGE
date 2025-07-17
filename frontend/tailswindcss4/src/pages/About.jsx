import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const About = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col w-full">
    <Header />
    <main className="flex-1 w-full flex flex-col items-center justify-center py-16 px-4">
      <section className="max-w-3xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">About Us</h1>
        <p className="text-slate-700 mb-6 text-center">
          Secure Electronic Health Records is dedicated to revolutionizing healthcare data management by leveraging blockchain technology. Our mission is to empower patients, doctors, and hospitals with secure, transparent, and efficient access to health records.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Our Vision</h2>
        <p className="text-slate-600 mb-4">
          We envision a world where healthcare data is accessible, private, and immutable—enabling better patient outcomes and trust in the healthcare system.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Technology Stack</h2>
        <ul className="list-disc list-inside text-slate-600 mb-4">
          <li>React & Tailwind CSS for a modern, responsive UI</li>
          <li>Solidity & Hardhat for secure smart contracts</li>
          <li>Ether.js & Metamask for blockchain interaction</li>
          <li>Pinata (IPFS) for decentralized file storage</li>
        </ul>
        <p className="text-slate-700 text-center">
          By combining these technologies, we ensure data security, transparency, and user empowerment in healthcare.
        </p>
      </section>
    </main>
    <Footer />
  </div>
)

export default About 