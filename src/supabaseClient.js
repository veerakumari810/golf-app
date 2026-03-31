import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl) // Check if this shows your actual URL

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials! Check your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)