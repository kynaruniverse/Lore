import 'dotenv/config'
import { supabase } from '../src/lib/supabaseClient'

async function seedPages() {
  const { data: lore } = await supabase
    .from('lores')
    .select('id')
    .eq('slug', 'breaking-bad')
    .single()

  if (!lore) {
    console.error('Breaking Bad lore not found. Run the main seed first.')
    return
  }

  const pages = [
    {
      lore_id: lore.id,
      slug: 'walter-white',
      title: 'Walter White',
      category: 'Character',
      content: `## Overview\n\nWalter Hartwell White, born September 7, 1959, was a high school chemistry teacher in Albuquerque, New Mexico, who became a methamphetamine manufacturer and drug kingpin following his terminal lung cancer diagnosis.\n\n## The Transformation\n\nUpon receiving a Stage III lung cancer diagnosis, Walter partnered with former student Jesse Pinkman to cook methamphetamine, initially to secure his family's financial future. His chemistry expertise produced an exceptionally pure product — 99.1% pure blue meth — that disrupted the Albuquerque drug trade.`,
      excerpt: 'A high school chemistry teacher turned methamphetamine manufacturer.',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      tags: ['Protagonist', 'Heisenberg', 'Chemistry'],
      completeness: 85,
      missing_fields: ['Early childhood details'],
    },
    {
      lore_id: lore.id,
      slug: 'jesse-pinkman',
      title: 'Jesse Pinkman',
      category: 'Character',
      content: `## Overview\n\nJesse Bruce Pinkman is a former student of Walter White who becomes his partner in the methamphetamine trade. Unlike Walter, Jesse retains a moral compass throughout the series, making him the emotional anchor of the story.\n\n## Background\n\nJesse grew up in Albuquerque and was a mediocre chemistry student — though Walter's class was the one subject he showed some aptitude for.`,
      excerpt: "Walter White's former student and meth-cooking partner.",
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      tags: ['Protagonist', 'Cook', 'Redemption'],
      completeness: 70,
      missing_fields: ['Alaska timeline'],
    },
    {
      lore_id: lore.id,
      slug: 'gustavo-fring',
      title: 'Gustavo Fring',
      category: 'Character',
      content: `## Overview\n\nGustavo "Gus" Fring was a Chilean-born drug lord who operated the most sophisticated methamphetamine distribution network in the American Southwest, all while maintaining the public persona of a successful fast food entrepreneur.\n\n## Los Pollos Hermanos\n\nGus used his chain of Los Pollos Hermanos restaurants as a front for his drug operation.`,
      excerpt: 'The calculating drug lord who operated Los Pollos Hermanos.',
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      tags: ['Antagonist', 'Cartel', 'Los Pollos Hermanos'],
      completeness: 65,
      missing_fields: ['Chile backstory'],
    },
    {
      lore_id: lore.id,
      slug: 'albuquerque',
      title: 'Albuquerque',
      category: 'Location',
      content: `## Overview\n\nAlbuquerque, New Mexico is the primary setting for Breaking Bad and Better Call Saul. The city's unique character — its vast desert surroundings, its mix of suburban normalcy and urban grit — is inseparable from the tone of both series.`,
      excerpt: 'The New Mexico city that serves as the primary setting.',
      image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
      tags: ['Location', 'New Mexico', 'Setting'],
      completeness: 45,
      missing_fields: ['Filming locations map'],
    },
  ]

  const results = await Promise.all(
    pages.map(page =>
      supabase.from('pages').upsert(page, { onConflict: 'lore_id,slug' }).select()
    )
  )

  results.forEach((result, i) => {
    if (result.error) console.error(`Error seeding "${pages[i].title}":`, result.error)
    else console.log(`Seeded: ${pages[i].title}`)
  })

  // Update lore page count
  await supabase
    .from('lores')
    .update({ page_count: pages.length })
    .eq('id', lore.id)
}

seedPages()
  .then(() => { console.log('Page seeding complete'); process.exit(0) })
  .catch(err => { console.error('Seeding failed:', err); process.exit(1) })
