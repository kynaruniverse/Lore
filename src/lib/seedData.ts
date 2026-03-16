import { supabase } from './supabaseClient'

export const seedLores = [
  {
    title: 'Breaking Bad',
    slug: 'breaking-bad',
    description: 'The complete knowledge archive for Breaking Bad and Better Call Saul — characters, locations, chemistry, the cartel, and every pivotal moment in Albuquerque\'s most dangerous story.',
    category: 'tv',
    cover_image_url: 'https://image.tmdb.org/t/p/w780/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    hero_image_url: 'https://image.tmdb.org/t/p/w1280/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    color: '#C4622D',
    tags: ['Drama', 'Crime', 'AMC', 'Vince Gilligan'],
    trending: true
  },
  {
    title: 'Elden Ring',
    slug: 'elden-ring',
    description: 'The definitive lore compendium for the Lands Between — demigods, Great Runes, the Erdtree, ancient history, and every secret FromSoftware buried in item descriptions.',
    category: 'game',
    cover_image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    hero_image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg',
    color: '#B8922A',
    tags: ['FromSoftware', 'RPG', 'Fantasy', 'Soulslike'],
    trending: true
  }
]

export async function seedDatabase() {
  for (const lore of seedLores) {
    const { data, error } = await supabase
      .from('lores')
      .upsert(lore, { onConflict: 'slug' })
      .select()
    
    if (error) console.error('Error seeding lore:', error)
    else console.log('Seeded lore:', data[0].title)
  }
}
