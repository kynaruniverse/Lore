import { supabase } from './supabaseClient'

export const seedLores = [
  {
    title: 'Breaking Bad',
    slug: 'breaking-bad',
    description: 'The complete knowledge archive for Breaking Bad and Better Call Saul — characters, locations, chemistry, the cartel, and every pivotal moment in Albuquerque\'s most dangerous story.',
    category: 'tv',
    cover_image_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&q=80',
    color: '#C4622D',
    tags: ['Drama', 'Crime', 'AMC', 'Vince Gilligan'],
    trending: true,
    is_public: true
  },
  {
    title: 'Elden Ring',
    slug: 'elden-ring',
    description: 'The definitive lore compendium for the Lands Between — demigods, Great Runes, the Erdtree, ancient history, and every secret FromSoftware buried in item descriptions.',
    category: 'game',
    cover_image_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1200&q=80',
    color: '#B8922A',
    tags: ['FromSoftware', 'RPG', 'Fantasy', 'Soulslike'],
    trending: true,
    is_public: true
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
