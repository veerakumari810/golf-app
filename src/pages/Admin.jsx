import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Admin() {
  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Get all users
    const { data: userData } = await supabase
      .from('profiles')
      .select('*')
    
    if (userData) setUsers(userData)
    
    // Get all scores
    const { data: scoreData } = await supabase
      .from('scores')
      .select('*, profiles(id, email)')
      .order('created_at', { ascending: false })
    
    if (scoreData) setScores(scoreData)
    
    setLoading(false)
  }

  const deleteScore = async (id) => {
    if (confirm('Delete this score?')) {
      await supabase.from('scores').delete().eq('id', id)
      fetchData()
    }
  }

  if (loading) return <div className="loading">Loading admin panel...</div>

  return (
    <div className="admin-panel">
      <h1>🔧 Admin Dashboard</h1>
      
      <div className="admin-card">
        <h2>👥 Users ({users.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Admin</th>
              <th>Charity %</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.is_admin ? '✅ Yes' : '❌ No'}</td>
                <td>{user.charity_percentage || 10}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h2>⛳ All Scores ({scores.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Score</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(score => (
              <tr key={score.id}>
                <td>{score.user_id}</td>
                <td><strong>{score.score}</strong></td>
                <td>{score.score_date}</td>
                <td>
                  <button onClick={() => deleteScore(score.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admin