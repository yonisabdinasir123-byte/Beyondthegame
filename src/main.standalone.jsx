import React from 'react'
import ReactDOM from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import App             from './App.jsx'
import PathwayPage     from './pages/PathwayPage.jsx'
import RecoveryPage    from './pages/RecoveryPage.jsx'
import EducationPage   from './pages/EducationPage.jsx'
import JobsCareersPage from './pages/JobsCareersPage.jsx'
import AcademyPage     from './pages/AcademyPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MemoryRouter>
      <Routes>
        <Route path="/"            element={<App />} />
        <Route path="/pathway"     element={<PathwayPage />} />
        <Route path="/recovery"    element={<RecoveryPage />} />
        <Route path="/education"   element={<EducationPage />} />
        <Route path="/jobs-careers" element={<JobsCareersPage />} />
        <Route path="/academy"     element={<AcademyPage />} />
      </Routes>
    </MemoryRouter>
  </React.StrictMode>,
)
