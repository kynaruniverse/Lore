import 'dotenv/config'
import { supabase } from '../src/lib/supabaseClient'

async function seedRelationships() {
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title')
    .in('title', ['Walter White', 'Jesse Pinkman', 'Gustavo Fring', 'Albuquerque'])

  if (!pages?.length) {
    console.error('Pages not found. Run seed-pages first.')
    return
  }

  const pageMap = Object.fromEntries(pages.map(p => [p.title, p.id]))

  const relationships = [
    { source_page_id: pageMap['Walter White'],  target_page_id: pageMap['Jesse Pinkman'],  type: 'ally_of',    label: 'Partner' },
    { source_page_id: pageMap['Walter White'],  target_page_id: pageMap['Gustavo Fring'],  type: 'enemy_of',   label: 'Nemesis' },
    { source_page_id: pageMap['Walter White'],  target_page_id: pageMap['Albuquerque'],    type: 'located_in', label: 'Home'    },
    { source_page_id: pageMap['Jesse Pinkman'], target_page_id: pageMap['Walter White'],   type: 'ally_of',    label: 'Partner' },
    { source_page_id: pageMap['Jesse Pinkman'], target_page_id: pageMap['Albuquerque'],    type: 'located_in', label: 'Home'    },
  ].filter(r => r.source_page_id && r.target_page_id)

  const results = await Promise.all(
    relationships.map(rel =>
      supabase
        .from('relationships')
        .upsert(rel, { onConflict: 'source_page_id,target_page_id' })
    )
  )

  results.forEach((result, i) => {
    if (result.error) console.error(`Error seeding relationship "${relationships[i].label}":`, result.error)
    else console.log(`Seeded: ${relationships[i].label}`)
  })
}

seedRelationships()
  .then(() => { console.log('Relationship seeding complete'); process.exit(0) })
  .catch(err => { console.error('Seeding failed:', err); process.exit(1) })
