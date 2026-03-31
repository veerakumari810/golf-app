const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setError(error.message)
  }
  // No need to navigate - session change will trigger re-render
  setLoading(false)
}