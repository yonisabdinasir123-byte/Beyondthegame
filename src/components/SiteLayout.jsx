/**
 * SiteLayout.jsx
 * Shared chrome (header + footer + auth modals) for inner pages so they match
 * the main Beyond the Game homepage. Reuses the exact Navbar, FooterSection and
 * modal components from App.jsx, single source of truth, no duplication.
 *
 * Usage:
 *   <SiteLayout>
 *     ...page content...
 *   </SiteLayout>
 */
import { useState, useCallback } from 'react'
import {
  SkipLink,
  FooterSection,
  LoginModal,
  SignupModal,
  ForgotPasswordModal,
  BackToTop,
} from '../App.jsx'
import FloatingNav from './FloatingNav.jsx'

export default function SiteLayout({ children }) {
  const [modal, setModal] = useState(null) // 'login' | 'signup' | 'forgot' | null

  const openLogin  = useCallback(() => setModal('login'),  [])
  const openSignup = useCallback(() => setModal('signup'), [])
  const openForgot = useCallback(() => setModal('forgot'), [])
  const closeModal = useCallback(() => setModal(null),     [])

  return (
    <>
      <SkipLink />
      <FloatingNav onLogin={openLogin} onSignup={openSignup} />

      <main id="main-content" className="site-main">
        {children}
      </main>

      <FooterSection onLogin={openLogin} onSignup={openSignup} />
      <BackToTop />

      {/* Auth modals, same behaviour as the homepage */}
      <LoginModal
        isOpen={modal === 'login'}
        onClose={closeModal}
        onForgotPassword={openForgot}
        onSignup={openSignup}
      />
      <SignupModal
        isOpen={modal === 'signup'}
        onClose={closeModal}
        onLogin={openLogin}
      />
      <ForgotPasswordModal
        isOpen={modal === 'forgot'}
        onClose={closeModal}
        onBack={openLogin}
      />
    </>
  )
}
