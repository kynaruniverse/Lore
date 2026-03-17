import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../src/lib/supabaseClient'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function seedWitcher() {
  // Get The Witcher lore ID
  const { data: lore } = await supabase
    .from('lores')
    .select('id')
    .eq('slug', 'the-witcher')
    .single()

  if (!lore) {
    console.error('The Witcher lore not found')
    return
  }

  const pages = [
    {
      lore_id: lore.id,
      slug: 'geralt-of-rivia',
      title: 'Geralt of Rivia',
      category: 'Character',
      content: `## Overview\n\nGeralt of Rivia is a witcher, a genetically enhanced monster hunter trained from childhood. He is the protagonist of Andrzej Sapkowski's Witcher series and the video game adaptations.\n\n## Appearance\n\nGeralt has ashen white hair, yellow cat-like eyes, and carries two swords: steel for humans and silver for monsters. He is often recognized by the scars on his face and the witcher medallion around his neck.\n\n## Abilities\n\n- **Superhuman strength, speed, and reflexes** - Witcher mutations grant him abilities far beyond normal humans.\n- **Signs** - Simple magical spells including Aard (telekinetic blast), Igni (fire), Yrden (magical trap), Quen (protective shield), and Axii (mind control).\n- **Enhanced senses** - Can track creatures by scent and see in darkness.\n- **Alchemy** - Expert in brewing potions, oils, and bombs.\n\n## Personality\n\nGeralt presents himself as cold and emotionless, claiming witchers have no feelings. In reality, he is deeply moral, often helping those in need despite his protests. He follows his own code of ethics and tries to remain neutral in human conflicts, though he frequently fails.`,
      excerpt: 'A witcher, a genetically enhanced monster hunter trained from childhood.',
      image_url: 'https://images.unsplash.com/photo-1585314614250-d2132b1c7b9d?w=400&q=80',
      tags: ['Protagonist', 'Witcher', 'Mutant', 'Monster Hunter'],
      completeness: 85,
      missing_fields: ['Full list of contracts', 'Relationship with Vesemir details']
    },
    {
      lore_id: lore.id,
      slug: 'yennefer-of-vengerberg',
      title: 'Yennefer of Vengerberg',
      category: 'Character',
      content: `## Overview\n\nYennefer of Vengerberg is a powerful sorceress and one of the main characters in The Witcher series. She is Geralt's true love and the adoptive mother of Ciri.\n\n## Background\n\nBorn with a spinal deformity, Yennefer was abused by her family and eventually sold to the Aretuza academy for sorceresses. There, she was transformed into a beautiful young woman but rendered infertile in the process—a choice she later deeply regrets.\n\n## Abilities\n\nYennefer is one of the most powerful sorceresses of her time, specializing in magic, teleportation, illusions, and healing. She is known for her distinctive violet eyes and the scent of lilac and gooseberries.\n\n## Personality\n\nYennefer is ambitious, stubborn, and fiercely independent. She struggles with her desire for power versus her need for love and family. Her relationship with Geralt spans decades, marked by passion, conflict, and an unbreakable bond.`,
      excerpt: 'A powerful sorceress and Geralt\'s true love.',
      image_url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=400&q=80',
      tags: ['Sorceress', 'Love Interest', 'Powerful'],
      completeness: 80,
      missing_fields: ['Early life details', 'Time at Aretuza']
    },
    {
      lore_id: lore.id,
      slug: 'ciri',
      title: 'Cirilla Fiona Elen Riannon',
      category: 'Character',
      content: `## Overview\n\nCirilla Fiona Elen Riannon, known as Ciri, is a princess of Cintra, a witcher-in-training, and the child of destiny prophesied to reshape the world. She is the adopted daughter of Geralt and Yennefer.\n\n## Background\n\nCiri is the granddaughter of Queen Calanthe and carries the Elder Blood, making her the last living descendant of the ancient elf Lara Dorren. This bloodline grants her immense magical potential and the ability to travel between worlds.\n\n## Abilities\n\nCiri possesses the power of the Elder Blood, allowing her to teleport across vast distances and between different dimensions—a power she calls "traveling." She is also trained in swordsmanship by Geralt and the witchers of Kaer Morhen.\n\n## The Prophecy\n\nAccording to Ithlinne's prophecy, Ciri's child will one day save or destroy the world. This makes her the target of numerous factions—emperors, sorceresses, and monsters—all seeking to control her power.`,
      excerpt: 'Princess of Cintra, witcher-in-training, and the child of destiny.',
      image_url: 'https://images.unsplash.com/photo-1608889476518-adec4b9f9056?w=400&q=80',
      tags: ['Princess', 'Elder Blood', 'Destiny'],
      completeness: 75,
      missing_fields: ['Full training timeline', 'World-hopping adventures']
    },
    {
      lore_id: lore.id,
      slug: 'kaer-morhen',
      title: 'Kaer Morhen',
      category: 'Location',
      content: `## Overview\n\nKaer Morhen is the ancient keep where witchers of the School of the Wolf were trained. Located deep in the Blue Mountains of Kaedwen, it serves as a home and refuge for Geralt and his fellow witchers.\n\n## History\n\nThe keep was once a thriving fortress where generations of witchers were trained. Decades ago, it was sacked by fanatical mobs who believed witchers were evil. Today, only a few witchers remain, returning each winter to the crumbling fortress.\n\n## Notable Features\n\n- **The Great Hall** - Where witchers gather for meals and story-telling\n- **The Training Grounds** - Where young witchers practiced swordsmanship\n- **The Laboratory** - Where mutagens were created for the Trial of the Grasses\n- **The Surrounding Mountains** - Home to various monsters for training\n\nKaer Morhen represents the last remnant of witcher tradition, a place of both harsh training and deep camaraderie.`,
      excerpt: 'The ancient keep where witchers of the School of the Wolf were trained.',
      image_url: 'https://images.unsplash.com/photo-1582641926462-8a8f8f2c4f4a?w=600&q=80',
      tags: ['Location', 'Witcher School', 'Fortress'],
      completeness: 70,
      missing_fields: ['Detailed floor plan', 'History of the sacking']
    }
  ]

  for (const page of pages) {
    const { error } = await supabase
      .from('pages')
      .insert(page)
    
    if (error) {
      console.error(`Error seeding page ${page.title}:`, error)
    } else {
      console.log(`Seeded page: ${page.title}`)
    }
  }

  // Update lore page count
  await supabase
    .from('lores')
    .update({ page_count: pages.length })
    .eq('id', lore.id)
}

seedWitcher().then(() => {
  console.log('Witcher page seeding complete')
  process.exit(0)
}).catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
