import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App             from './App.jsx'
import PathwayPage     from './pages/PathwayPage.jsx'
import RecoveryPage    from './pages/RecoveryPage.jsx'
import EducationPage   from './pages/EducationPage.jsx'
import JobsCareersPage from './pages/JobsCareersPage.jsx'
import AcademyPage     from './pages/AcademyPage.jsx'
import SupportPage     from './pages/SupportPage.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AppProvider }   from './context/AppContext.jsx'
import './index.css'

// ThemeProvider (design tokens) + AppProvider (shared, persisted state:
// release stage, interests, saved items) wrap every route so the look and
// the user's choices stay consistent across navigation.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/"            element={<App />} />
            <Route path="/pathway"     element={<PathwayPage />} />
            <Route path="/recovery"    element={<RecoveryPage />} />
            <Route path="/education"   element={<EducationPage />} />
            <Route path="/support"     element={<SupportPage />} />
            <Route path="/jobs-careers" element={<JobsCareersPage />} />
            <Route path="/academy"     element={<AcademyPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
