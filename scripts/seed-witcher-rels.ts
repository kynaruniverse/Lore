import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../src/lib/supabaseClient'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function seedWitcherRelationships() {
  // Get page IDs
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title')
    .in('title', ['Geralt of Rivia', 'Yennefer of Vengerberg', 'Ciri', 'Kaer Morhen'])

  if (!pages) return

  const pageMap = Object.fromEntries(pages.map(p => [p.title, p.id]))

  const relationships = [
    {
      source_page_id: pageMap['Geralt of Rivia'],
      target_page_id: pageMap['Yennefer of Vengerberg'],
      type: 'ally_of',
      label: 'True Love'
    },
    {
      source_page_id: pageMap['Geralt of Rivia'],
      target_page_id: pageMap['Ciri'],
      type: 'ally_of',
      label: 'Adoptive Father'
    },
    {
      source_page_id: pageMap['Yennefer of Vengerberg'],
      target_page_id: pageMap['Ciri'],
      type: 'ally_of',
      label: 'Adoptive Mother'
    },
    {
      source_page_id: pageMap['Geralt of Rivia'],
      target_page_id: pageMap['Kaer Morhen'],
      type: 'located_in',
      label: 'Home'
    },
    {
      source_page_id: pageMap['Ciri'],
      target_page_id: pageMap['Kaer Morhen'],
      type: 'located_in',
      label: 'Trained Here'
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

seedWitcherRelationships().then(() => {
  console.log('Witcher relationship seeding complete')
  process.exit(0)
}).catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
