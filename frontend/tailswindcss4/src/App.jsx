import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientProfile from './pages/patient/PatientProfile'
import PatientReports from './pages/patient/PatientReports'
import PatientUpload from './pages/patient/PatientUpload'
import PatientPermissions from './pages/patient/PatientPermissions'

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorProfile from './pages/doctor/DoctorProfile'
import DoctorPatients from './pages/doctor/DoctorPatients'
import DoctorPatientDetails from './pages/doctor/PatientDetails'
import DoctorAddPrescription from './pages/doctor/AddPrescription'
import DoctorPatientReports from './pages/doctor/PatientReports'

// Hospital pages
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import HospitalProfile from './pages/hospital/HospitalProfile'
import HospitalPatients from './pages/hospital/HospitalPatients'
import HospitalPatientDetails from './pages/hospital/PatientDetails'
import HospitalAddPrescription from './pages/hospital/AddPrescription'
import HospitalPatientReports from './pages/hospital/PatientReports'
import EmergencyShare from './pages/hospital/EmergencyShare'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/reports" element={<PatientReports />} />
        <Route path="/patient/upload" element={<PatientUpload />} />
        <Route path="/patient/permissions" element={<PatientPermissions />} />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/patient-details" element={<DoctorPatientDetails />} />
        <Route path="/doctor/add-prescription" element={<DoctorAddPrescription />} />
        <Route path="/doctor/patient-reports" element={<DoctorPatientReports />} />
        
        {/* Hospital Routes */}
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />
        <Route path="/hospital/patients" element={<HospitalPatients />} />
        <Route path="/hospital/patient-details" element={<HospitalPatientDetails />} />
        <Route path="/hospital/add-prescription" element={<HospitalAddPrescription />} />
        <Route path="/hospital/patient-reports" element={<HospitalPatientReports />} />
        <Route path="/hospital/emergency-share" element={<EmergencyShare />} />
      </Routes>
    </Router>
  )
}

export default App
