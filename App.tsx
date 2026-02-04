
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { PatientSubmission } from './pages/PatientSubmission';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentRegistration } from './pages/StudentRegistration';
import { StudentLogin } from './pages/StudentLogin';
import { StudentDashboard } from './pages/StudentDashboard';
import { LegalDocs } from './pages/LegalDocs';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<PatientSubmission />} />
        
        {/* Legal Routes */}
        <Route path="/legal/:docId" element={<LegalDocs />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Student Routes */}
        <Route path="/student/register" element={<StudentRegistration />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </HashRouter>
  );
}

export default App;
