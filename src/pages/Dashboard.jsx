import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function Dashboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [averageScore, setAverageScore] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchScores(user.id)
      }
    }
    
    getUser()
  }, [])

  const fetchScores = async (userId) => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('scroes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching scores:', error)
    } else {
      setScores(data)
      if (data.length > 0) {
        const total = data.reduce((sum, score) => sum + score.score, 0)
        setAverageScore(total / data.length)
      }
    }
    
    setLoading(false)
  }

  const addScore = async (scoreValue) => {
    if (!user) return
    
    const { error } = await supabase
      .from('scroes')
      .insert([{ 
        user_id: user.id, 
        score: scoreValue 
      }])
    
    if (error) {
      console.error('Error adding score:', error)
    } else {
      fetchScores(user.id)
    }
  }

  const updateScore = async (id, newScore) => {
    if (!user) return
    
    const { error } = await supabase
      .from('scroes')
      .update({ score: newScore })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating score:', error)
    } else {
      fetchScores(user.id)
    }
  }

  const deleteScore = async (id) => {
    if (!user) return
    
    const { error } = await supabase
      .from('scroes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting score:', error)
    } else {
      fetchScores(user.id)
    }
  }

  if (loading) {
    return <div className="loading">Loading your scores...</div>
  }

  return (
    <div className="dashboard">
      <h1>🏌️ Golf Score Dashboard</h1>
      
      <div className="stats">
        <h2>Average Score: {averageScore.toFixed(1)}</h2>
        <p>Total Rounds: {scores.length}</p>
      </div>

      <div className="quick-add">
        <h3>Quick Add Score</h3>
        <button onClick={() => addScore(100)}>Add 100</button>
        <button onClick={() => addScore(85)}>Add 85</button>
        <button onClick={() => addScore(92)}>Add 92</button>
        <button onClick={() => addScore(78)}>Add 78</button>
      </div>

      <div className="scores-list">
        <h3>Your Score History</h3>
        {scores.length === 0 ? (
          <p>No scores yet. Add your first round!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score.id}>
                  <td>{new Date(score.created_at).toLocaleDateString()}</td>
                  <td>{score.score}</td>
                  <td>
                    <button onClick={() => updateScore(score.id, score.score + 1)}>+</button>
                    <button onClick={() => updateScore(score.id, score.score - 1)}>-</button>
                    <button onClick={() => deleteScore(score.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  )
}

export default Dashboard