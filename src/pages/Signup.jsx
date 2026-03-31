import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Signup({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Check your email for confirmation!')
    }
    setLoading(false)
  }

  return (
    <div className="signup-form">
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <button onClick={onSwitch}>Already have an account? Login</button>
    </div>
  )
}

export default Signup