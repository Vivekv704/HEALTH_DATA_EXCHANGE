import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Contact = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col w-full">
    <Header />
    <main className="flex-1 w-full flex flex-col items-center justify-center py-16 px-4">
      <section className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">Contact Us</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-slate-700 mb-1" htmlFor="name">Name</label>
            <input id="name" type="text" className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-slate-700 mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-slate-700 mb-1" htmlFor="message">Message</label>
            <textarea id="message" className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows="4" placeholder="Your message..."></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">Send Message</button>
        </form>
        <div className="mt-8 text-center text-slate-500 text-sm">
          Or email us at <a href="mailto:info@sehr.com" className="text-blue-600 hover:underline">info@sehr.com</a>
        </div>
      </section>
    </main>
    <Footer />
  </div>
)

export default Contact 