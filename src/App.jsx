import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="auth-container">
        {showLogin ? (
          <>
            <Login />
            <button onClick={() => setShowLogin(false)}>Need an account? Sign Up</button>
          </>
        ) : (
          <>
            <Signup />
            <button onClick={() => setShowLogin(true)}>Already have an account? Login</button>
          </>
        )}
      </div>
    )
  }

  return <Dashboard />
}

export default App