import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App                 from './App.jsx'
import PathwayPage         from './pages/PathwayPage.jsx'
import RecoveryPage        from './pages/RecoveryPage.jsx'
import EducationPage       from './pages/EducationPage.jsx'
import EmployabilityPage   from './pages/EmployabilityPage.jsx'
import ChecklistPage       from './pages/ChecklistPage.jsx'
import CareerSuggesterPage from './pages/CareerSuggesterPage.jsx'
import AcademyPage         from './pages/AcademyPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<App />} />
        <Route path="/pathway"    element={<PathwayPage />} />
        <Route path="/recovery"   element={<RecoveryPage />} />
        <Route path="/education"  element={<EducationPage />} />
        <Route path="/jobs"       element={<EmployabilityPage />} />
        <Route path="/checklist"  element={<ChecklistPage />} />
        <Route path="/careers"    element={<CareerSuggesterPage />} />
        <Route path="/academy"    element={<AcademyPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
