import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()
      
      setIsAdmin(data?.is_admin === true)
    } catch (err) {
      // If email matches, set as admin
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email === 'veerakumari123@gmail.com') {
        setIsAdmin(true)
        // Update profile to set is_admin
        await supabase
          .from('profiles')
          .upsert({ id: userId, email: user.email, is_admin: true })
      }
    }
  }

  if (!session) {
    return (
      <div className="auth-container">
        {showLogin ? (
          <>
            <Login />
            <button onClick={() => setShowLogin(false)} className="switch-btn">
              Need an account? Sign Up
            </button>
          </>
        ) : (
          <>
            <Signup />
            <button onClick={() => setShowLogin(true)} className="switch-btn">
              Already have an account? Login
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <h2>🏌️ Golf App</h2>
        <div>
          <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
          {isAdmin && (
            <button onClick={() => setCurrentPage('admin')}>Admin Panel</button>
          )}
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'admin' && isAdmin && <Admin />}
    </div>
  )
}

export default App