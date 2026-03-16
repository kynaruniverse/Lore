import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { seedDatabase } from '../src/lib/seedData.js'

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Debug: Check if variables are loaded
console.log('Environment check:')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✓' : '✗')
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✓' : '✗')

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables')
  process.exit(1)
}

seedDatabase().then(() => {
  console.log('Seeding complete')
  process.exit(0)
}).catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
