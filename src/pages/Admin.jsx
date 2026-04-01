import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Admin() {
  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Get all users
    const { data: userData } = await supabase.from('profiles').select('*')
    if (userData) setUsers(userData)
    
    // Get all scores
    const { data: scoreData } = await supabase.from('scores').select('*')
    if (scoreData) setScores(scoreData)
  }

  return (
    <div className="admin-panel">
      <h1>🔧 Admin Dashboard</h1>
      
      <div className="admin-card">
        <h2>👥 Users ({users.length})</h2>
        <table>
          <thead><tr><th>Email</th><th>Admin</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email || u.id}</td>
                <td>{u.is_admin ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h2>⛳ All Scores ({scores.length})</h2>
        <table>
          <thead><tr><th>User ID</th><th>Score</th><th>Date</th></tr></thead>
          <tbody>
            {scores.map(s => (
              <tr key={s.id}>
                <td>{s.user_id?.slice(0,8)}...</td>
                <td><strong>{s.score}</strong></td>
                <td>{s.score_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admin