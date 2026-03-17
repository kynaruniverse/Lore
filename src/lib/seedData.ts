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
    is_public: true,
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
    is_public: true,
  },
  {
    title: 'The Witcher',
    slug: 'the-witcher',
    description: 'The world of Geralt of Rivia — a monster hunter in a dark fantasy universe. Explore the Continent, its kingdoms, monsters, and the complex characters from Andrzej Sapkowski\'s books and the Netflix series.',
    category: 'book',
    cover_image_url: 'https://images.unsplash.com/photo-1585314614250-d2132b1c7b9d?w=600&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1585314614250-d2132b1c7b9d?w=1200&q=80',
    color: '#8B5A2B',
    tags: ['Fantasy', 'Netflix', 'Andrzej Sapkowski', 'Monsters'],
    trending: true,
    is_public: true,
  },
  {
    title: 'Game of Thrones',
    slug: 'game-of-thrones',
    description: 'The complete knowledge base for Westeros and Essos — Houses, characters, battles, prophecies, and the full history of the Seven Kingdoms from the Age of Heroes to the Long Night.',
    category: 'tv',
    cover_image_url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=80',
    color: '#8B5E3C',
    tags: ['HBO', 'Fantasy', 'George R.R. Martin', 'Westeros'],
    trending: true,
    is_public: true,
  },
  {
    title: 'The Lord of the Rings',
    slug: 'lord-of-the-rings',
    description: 'Tolkien\'s complete legendarium — from the Ainulindalë to the Fourth Age. Characters, places, languages, histories, and the deep mythology of Middle-earth.',
    category: 'book',
    cover_image_url: 'https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?w=600&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?w=1200&q=80',
    color: '#4A7C59',
    tags: ['Tolkien', 'Fantasy', 'Middle-earth', 'Epic'],
    trending: false,
    is_public: true,
  },
  {
    title: 'Formula 1',
    slug: 'formula-1',
    description: 'The complete Formula 1 knowledge base — drivers, teams, circuits, seasons, technical regulations, and the greatest moments in the history of the pinnacle of motorsport.',
    category: 'sports',
    cover_image_url: 'https://images.unsplash.com/photo-1544461772-722aedcb414b?w=600&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1544461772-722aedcb414b?w=1200&q=80',
    color: '#E8002D',
    tags: ['Motorsport', 'Racing', 'FIA', 'Grand Prix'],
    trending: true,
    is_public: true,
  },
]

export async function seedDatabase() {
  for (const lore of seedLores) {
    const { data, error } = await supabase
      .from('lores')
      .upsert(lore, { onConflict: 'slug' })
      .select()

    if (error) console.error('Error seeding lore:', error)
    else console.log('Seeded lore:', data?.[0]?.title)
  }
}
