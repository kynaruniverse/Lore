/**
 * @file Supabase client initialization and configuration.
 * @module lib/supabaseClient
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * The Supabase project URL, retrieved from environment variables.
 * @type {string}
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
/**
 * The Supabase anonymous key, retrieved from environment variables.
 * @type {string}
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  )
}

/**
 * Initializes and exports the Supabase client.
 * @type {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
