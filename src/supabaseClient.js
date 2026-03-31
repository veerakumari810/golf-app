import { createClient } from '@supabase/supabase-js'

// Hardcoded for production deployment
const supabaseUrl = 'https://cnjvhomxmbbokdskgeco.supabase.co'
const supabaseAnonKey = 'sb_publishable_is8DKsF2MZPKrUAgBrK93g_8CSkhqek'

console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)