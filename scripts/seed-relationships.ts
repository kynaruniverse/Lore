import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../src/lib/supabaseClient'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function seedRelationships() {
  // Get page IDs
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title')
    .in('title', ['Walter White', 'Jesse Pinkman', 'Gustavo Fring', 'Albuquerque'])

  if (!pages) return

  const pageMap = Object.fromEntries(pages.map(p => [p.title, p.id]))

  const relationships = [
    {
      source_page_id: pageMap['Walter White'],
      target_page_id: pageMap['Jesse Pinkman'],
      type: 'ally_of',
      label: 'Partner'
    },
    {
      source_page_id: pageMap['Walter White'],
      target_page_id: pageMap['Gustavo Fring'],
      type: 'enemy_of',
      label: 'Nemesis'
    },
    {
      source_page_id: pageMap['Walter White'],
      target_page_id: pageMap['Albuquerque'],
      type: 'located_in',
      label: 'Home'
    },
    {
      source_page_id: pageMap['Jesse Pinkman'],
      target_page_id: pageMap['Walter White'],
      type: 'ally_of',
      label: 'Partner'
    },
    {
      source_page_id: pageMap['Jesse Pinkman'],
      target_page_id: pageMap['Albuquerque'],
      type: 'located_in',
      label: 'Home'
    }
  ]

  for (const rel of relationships) {
    if (!rel.source_page_id || !rel.target_page_id) continue
    
    const { error } = await supabase
      .from('relationships')
      .insert(rel)
    
    if (error) {
      console.error('Error seeding relationship:', error)
    } else {
      console.log(`Seeded relationship: ${rel.label}`)
    }
  }
}

seedRelationships().then(() => {
  console.log('Relationship seeding complete')
  process.exit(0)
}).catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
