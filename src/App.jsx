import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="auth-container">
        {showLogin ? (
          <Login onSwitch={() => setShowLogin(false)} />
        ) : (
          <Signup onSwitch={() => setShowLogin(true)} />
        )}
      </div>
    )
  }

  return <Dashboard />
}

export default App