import { createClient } from '@supabase/supabase-js'

// Helper to get env variables in any environment
const getEnvVar = (key: string): string => {
  // Check for import.meta.env (Vite browser environment)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key]
  }
  
  // Check for process.env (Node.js environment)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]
  }
  
  return ''
}

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY')

// Log for debugging (remove in production)
console.log('Supabase URL:', supabaseUrl ? '✓' : '✗')
console.log('Supabase Key:', supabaseAnonKey ? '✓' : '✗')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
