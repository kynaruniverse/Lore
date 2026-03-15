// ============================================================
// LORE — Seed Data Store
// 5 Demo Lores: Breaking Bad, Elden Ring, Game of Thrones,
//               Lord of the Rings, Formula 1
// ============================================================

export type RelationshipType =
  | "appears_in"
  | "related_to"
  | "happened_at"
  | "teammate_of"
  | "created_by"
  | "part_of"
  | "enemy_of"
  | "ally_of"
  | "preceded_by"
  | "followed_by"
  | "located_in"
  | "drove_for"
  | "competed_in";

export interface Relationship {
  targetPageId: string;
  type: RelationshipType;
  label?: string;
}

export interface LorePage {
  id: string;
  loreId: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  image?: string;
  relationships: Relationship[];
  tags: string[];
  completeness: number; // 0-100
  missingFields: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface Lore {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "tv" | "game" | "film" | "sports" | "book" | "music" | "history";
  coverImage: string;
  heroImage: string;
  color: string; // accent color for this lore
  pageCount: number;
  contributorCount: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  trending: boolean;
}

// ============================================================
// LORES
// ============================================================

export const lores: Lore[] = [
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    slug: "breaking-bad",
    description:
      "The complete knowledge archive for Breaking Bad and Better Call Saul — characters, locations, chemistry, the cartel, and every pivotal moment in Albuquerque's most dangerous story.",
    category: "tv",
    coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
    color: "#C4622D",
    pageCount: 84,
    contributorCount: 312,
    isPublic: true,
    tags: ["Drama", "Crime", "AMC", "Vince Gilligan"],
    createdAt: "2024-01-15",
    updatedAt: "2025-03-10",
    views: 142800,
    trending: true,
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    slug: "elden-ring",
    description:
      "The definitive lore compendium for the Lands Between — demigods, Great Runes, the Erdtree, ancient history, and every secret FromSoftware buried in item descriptions.",
    category: "game",
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
    color: "#B8922A",
    pageCount: 203,
    contributorCount: 891,
    isPublic: true,
    tags: ["FromSoftware", "RPG", "Fantasy", "Soulslike"],
    createdAt: "2022-02-25",
    updatedAt: "2025-03-12",
    views: 389200,
    trending: true,
  },
  {
    id: "game-of-thrones",
    title: "Game of Thrones",
    slug: "game-of-thrones",
    description:
      "The most comprehensive knowledge base for Westeros and Essos — Houses, characters, battles, prophecies, and the full history of the Seven Kingdoms from the Age of Heroes to the Long Night.",
    category: "tv",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
    color: "#8B5E3C",
    pageCount: 456,
    contributorCount: 1240,
    isPublic: true,
    tags: ["HBO", "Fantasy", "George R.R. Martin", "Westeros"],
    createdAt: "2023-06-01",
    updatedAt: "2025-03-14",
    views: 621000,
    trending: false,
  },
  {
    id: "lord-of-the-rings",
    title: "The Lord of the Rings",
    slug: "lord-of-the-rings",
    description:
      "Tolkien's complete legendarium — from the Ainulindalë to the Fourth Age. Characters, places, languages, histories, and the deep mythology of Middle-earth.",
    category: "book",
    coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80",
    color: "#4A7C59",
    pageCount: 312,
    contributorCount: 678,
    isPublic: true,
    tags: ["Tolkien", "Fantasy", "Middle-earth", "Epic"],
    createdAt: "2023-09-22",
    updatedAt: "2025-03-08",
    views: 284500,
    trending: false,
  },
  {
    id: "formula-1",
    title: "Formula 1",
    slug: "formula-1",
    description:
      "The complete Formula 1 knowledge base — drivers, teams, circuits, seasons, technical regulations, and the greatest moments in the history of the pinnacle of motorsport.",
    category: "sports",
    coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80",
    color: "#E8002D",
    pageCount: 178,
    contributorCount: 534,
    isPublic: true,
    tags: ["Motorsport", "Racing", "FIA", "Grand Prix"],
    createdAt: "2024-03-01",
    updatedAt: "2025-03-15",
    views: 198400,
    trending: true,
  },
];

// ============================================================
// PAGES
// ============================================================

export const pages: LorePage[] = [
  // ---- BREAKING BAD ----
  {
    id: "bb-walter-white",
    loreId: "breaking-bad",
    title: "Walter White",
    slug: "walter-white",
    category: "Character",
    excerpt:
      "A high school chemistry teacher turned methamphetamine manufacturer, whose transformation into 'Heisenberg' is one of television's most celebrated character arcs.",
    content: `Walter Hartwell White, born September 7, 1959, was a high school chemistry teacher in Albuquerque, New Mexico, who became a methamphetamine manufacturer and drug kingpin following his terminal lung cancer diagnosis.

## Early Life and Career

Walter graduated from the California Institute of Technology and co-founded the chemical company Gray Matter Technologies with his college friend Elliott Schwartz. After selling his share for $5,000, the company grew into a billion-dollar enterprise — a decision that haunted him for decades.

## The Transformation

Upon receiving a Stage III lung cancer diagnosis, Walter partnered with former student Jesse Pinkman to cook methamphetamine, initially to secure his family's financial future. His chemistry expertise produced an exceptionally pure product — 99.1% pure blue meth — that disrupted the Albuquerque drug trade.

## Heisenberg

Walter adopted the alias "Heisenberg" as his drug kingpin persona. Over five seasons, his motivations shifted from desperation to pride, ambition, and a desire for power and recognition. His famous declaration — "I am the one who knocks" — marked his full transformation.

## Legacy

Walter's story is widely regarded as one of the greatest character studies in television history, exploring themes of pride, ego, and the corrupting nature of power.`,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    relationships: [
      { targetPageId: "bb-jesse-pinkman", type: "ally_of", label: "Partner" },
      { targetPageId: "bb-skyler-white", type: "related_to", label: "Wife" },
      { targetPageId: "bb-gus-fring", type: "enemy_of", label: "Nemesis" },
      { targetPageId: "bb-albuquerque", type: "located_in", label: "Home" },
    ],
    tags: ["Protagonist", "Heisenberg", "Chemistry"],
    completeness: 88,
    missingFields: ["Early childhood details", "Gray Matter founding timeline"],
    createdAt: "2024-01-15",
    updatedAt: "2025-02-20",
    views: 18400,
  },
  {
    id: "bb-jesse-pinkman",
    loreId: "breaking-bad",
    title: "Jesse Pinkman",
    slug: "jesse-pinkman",
    category: "Character",
    excerpt:
      "Walter White's former student and meth-cooking partner, whose moral conscience serves as the emotional heart of the series.",
    content: `Jesse Bruce Pinkman is a former student of Walter White who becomes his partner in the methamphetamine trade. Unlike Walter, Jesse retains a moral compass throughout the series, making him the emotional anchor of the story.

## Background

Jesse grew up in Albuquerque and was a mediocre chemistry student — though Walter's class was the one subject he showed some aptitude for. He was already involved in small-time drug dealing before Walter approached him.

## Character Arc

Jesse's journey is one of repeated trauma and resilience. He loses Jane Margolis, is manipulated by Walter, and witnesses horrific violence. His relationship with Brock Cantillo shows his capacity for genuine love and care.

## El Camino

Following the events of the series finale, Jesse escapes to Alaska, as depicted in the 2019 film *El Camino*, finally finding a measure of freedom.`,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    relationships: [
      { targetPageId: "bb-walter-white", type: "ally_of", label: "Partner" },
      { targetPageId: "bb-jane-margolis", type: "related_to", label: "Girlfriend" },
      { targetPageId: "bb-albuquerque", type: "located_in", label: "Home" },
    ],
    tags: ["Protagonist", "Cook", "Redemption"],
    completeness: 72,
    missingFields: ["Alaska timeline", "Family background details", "Full drug history"],
    createdAt: "2024-01-16",
    updatedAt: "2025-01-30",
    views: 14200,
  },
  {
    id: "bb-gus-fring",
    loreId: "breaking-bad",
    title: "Gustavo Fring",
    slug: "gustavo-fring",
    category: "Character",
    excerpt:
      "The calculating Chilean-born drug lord who operated a methamphetamine distribution network under the cover of his Los Pollos Hermanos fast food chain.",
    content: `Gustavo "Gus" Fring was a Chilean-born drug lord who operated the most sophisticated methamphetamine distribution network in the American Southwest, all while maintaining the public persona of a successful fast food entrepreneur.

## Los Pollos Hermanos

Gus used his chain of Los Pollos Hermanos restaurants as a front for his drug operation, using the distribution infrastructure to move product across the country. His meticulous attention to detail and legitimate business acumen made him nearly untouchable.

## Rivalry with the Cartel

Gus harboured a deep personal vendetta against the Salamanca family and the Juárez Cartel, stemming from the murder of his partner Maximino Arciniega in Mexico. His long game of revenge against Don Eladio defined much of his character.

## The Superlab

Gus constructed an industrial-grade methamphetamine laboratory beneath a laundry facility, hiring Walter White and Gale Boetticher to produce his signature blue product.`,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    relationships: [
      { targetPageId: "bb-walter-white", type: "enemy_of", label: "Rival" },
      { targetPageId: "bb-albuquerque", type: "located_in", label: "Base" },
    ],
    tags: ["Antagonist", "Cartel", "Los Pollos Hermanos"],
    completeness: 65,
    missingFields: ["Chile backstory", "Max Arciniega full history", "Cartel founding role"],
    createdAt: "2024-02-01",
    updatedAt: "2025-01-15",
    views: 11800,
  },
  {
    id: "bb-skyler-white",
    loreId: "breaking-bad",
    title: "Skyler White",
    slug: "skyler-white",
    category: "Character",
    excerpt:
      "Walter's wife, whose gradual discovery of his criminal activities forces her into increasingly difficult moral compromises.",
    content: `Skyler White (née Lambert) is Walter White's wife and the mother of their two children, Walter Jr. and Holly. Her character arc traces the impossible position of a person slowly drawn into complicity with a criminal enterprise.

## Early Marriage

Skyler and Walter's marriage was already strained before his cancer diagnosis — she felt intellectually unfulfilled and creatively stifled. Her work as a bookkeeper gave her the financial acumen that would later prove crucial.

## Discovery and Complicity

After discovering Walter's activities, Skyler initially attempts to leave him but is gradually drawn into helping launder money through the car wash they purchase together. Her complicity is never willing — it is the product of fear and circumstance.`,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    relationships: [
      { targetPageId: "bb-walter-white", type: "related_to", label: "Wife" },
      { targetPageId: "bb-albuquerque", type: "located_in", label: "Home" },
    ],
    tags: ["Character", "Family", "Complicity"],
    completeness: 55,
    missingFields: ["Pre-marriage background", "Post-series fate", "Lambert family history"],
    createdAt: "2024-02-10",
    updatedAt: "2025-01-20",
    views: 8900,
  },
  {
    id: "bb-jane-margolis",
    loreId: "breaking-bad",
    title: "Jane Margolis",
    slug: "jane-margolis",
    category: "Character",
    excerpt:
      "Jesse's girlfriend and a recovering addict whose death at Walter's hands marks the series' darkest moral turning point.",
    content: `Jane Margolis was Jesse Pinkman's girlfriend and a recovering heroin addict. Her relationship with Jesse was genuine and tender, but her relapse into drug use and her knowledge of Jesse's money made her a threat in Walter's eyes.

## Relationship with Jesse

Jane and Jesse met when she became his landlord. Their relationship developed slowly and authentically. She introduced Jesse to heroin, and together they spiralled into addiction.

## Death

Walter White, witnessing Jane choking on her own vomit during an overdose, chose not to intervene. Her death is widely considered the series' most morally defining moment — the point at which Walter's transformation into Heisenberg became irreversible.`,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    relationships: [
      { targetPageId: "bb-jesse-pinkman", type: "related_to", label: "Girlfriend" },
    ],
    tags: ["Character", "Tragedy", "Addiction"],
    completeness: 60,
    missingFields: ["Full family background", "Art career details"],
    createdAt: "2024-02-15",
    updatedAt: "2025-01-10",
    views: 7200,
  },
  {
    id: "bb-albuquerque",
    loreId: "breaking-bad",
    title: "Albuquerque",
    slug: "albuquerque",
    category: "Location",
    excerpt:
      "The New Mexico city that serves as the primary setting for Breaking Bad — its desert landscapes and suburban streets forming the backdrop for Walter White's transformation.",
    content: `Albuquerque, New Mexico is the primary setting for Breaking Bad and Better Call Saul. The city's unique character — its vast desert surroundings, its mix of suburban normalcy and urban grit — is inseparable from the tone of both series.

## Key Locations

The White family home on Negra Arroyo Lane, the Crystal Palace strip club, the Dog House drive-in, and the Crossroads Motel are among the most iconic locations. The industrial areas on the city's outskirts provided cover for the superlab.

## Desert Significance

The Albuquerque desert is a recurring visual motif — vast, indifferent, capable of swallowing secrets. Many of the series' most pivotal scenes take place in the desert: the first cook, the burial of money, the final confrontation.`,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    relationships: [
      { targetPageId: "bb-walter-white", type: "related_to", label: "Setting" },
      { targetPageId: "bb-jesse-pinkman", type: "related_to", label: "Setting" },
    ],
    tags: ["Location", "New Mexico", "Setting"],
    completeness: 45,
    missingFields: ["Real filming locations map", "Season-by-season location guide", "Better Call Saul crossover locations"],
    createdAt: "2024-03-01",
    updatedAt: "2025-01-05",
    views: 5400,
  },

  // ---- ELDEN RING ----
  {
    id: "er-marika",
    loreId: "elden-ring",
    title: "Queen Marika the Eternal",
    slug: "queen-marika",
    category: "Character",
    excerpt:
      "The vessel of the Elden Ring and god of the Lands Between, whose shattering of the Elden Ring set the events of the game in motion.",
    content: `Queen Marika the Eternal was the vessel of the Elden Ring and the supreme deity of the Lands Between. Her actions — particularly her shattering of the Elden Ring following the death of her son Godwyn — precipitated the Shattering and the age of chaos that followed.

## Origins

Marika was originally a member of the Numen, a people said to originate from outside the Lands Between. She was chosen by the Greater Will as its vessel and empowered to establish the Golden Order.

## The Elden Ring

Marika held the Elden Ring within her body, making her essentially immortal and divine. She used this power to reshape the fundamental laws of the Lands Between, most notably removing the Rune of Death from the Elden Ring.

## The Shattering

Following the Night of Black Knives, in which Godwyn's soul was killed, Marika shattered the Elden Ring in an act of grief or defiance. This act fractured the Golden Order and began the Shattering — a civil war among her demigod children.`,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    relationships: [
      { targetPageId: "er-radagon", type: "related_to", label: "Other Self" },
      { targetPageId: "er-erdtree", type: "related_to", label: "Vessel" },
      { targetPageId: "er-godwyn", type: "related_to", label: "Son" },
    ],
    tags: ["Deity", "Golden Order", "Shattering"],
    completeness: 78,
    missingFields: ["Numen origin details", "Pre-Golden Order history", "Relationship with Two Fingers"],
    createdAt: "2022-03-01",
    updatedAt: "2025-02-28",
    views: 42100,
  },
  {
    id: "er-radagon",
    loreId: "elden-ring",
    title: "Radagon of the Golden Order",
    slug: "radagon",
    category: "Character",
    excerpt:
      "The second Elden Lord and consort of Queen Marika, who is ultimately revealed to be Marika's other self — a single being split into two.",
    content: `Radagon of the Golden Order was the second Elden Lord, consort to Queen Marika, and father to several demigods. The game's most significant revelation is that Radagon and Marika are the same being — a single individual who could manifest as two separate people.

## Early History

Radagon was originally a champion of the Golden Order who fought against the Carian Royal Family. He fell in love with Rennala, Queen of the Full Moon, and married her, fathering Rykard, Radahn, and Ranni before abandoning her to become Marika's consort.

## Identity

The true nature of Radagon's identity as Marika's other self is one of Elden Ring's central mysteries. Whether this represents a literal metaphysical duality or a more symbolic truth is left deliberately ambiguous by FromSoftware.`,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    relationships: [
      { targetPageId: "er-marika", type: "related_to", label: "Other Self" },
      { targetPageId: "er-rennala", type: "related_to", label: "Former Wife" },
      { targetPageId: "er-erdtree", type: "related_to", label: "Elden Lord" },
    ],
    tags: ["Elden Lord", "Golden Order", "Duality"],
    completeness: 70,
    missingFields: ["Early Golden Order campaigns", "Relationship with Two Fingers", "Elden Ring repair attempts"],
    createdAt: "2022-03-05",
    updatedAt: "2025-02-15",
    views: 38700,
  },
  {
    id: "er-erdtree",
    loreId: "elden-ring",
    title: "The Erdtree",
    slug: "erdtree",
    category: "Location",
    excerpt:
      "The colossal golden tree at the centre of the Lands Between, symbol of the Golden Order and source of grace for all who dwell beneath its light.",
    content: `The Erdtree is the enormous golden tree that dominates the landscape of the Lands Between, visible from virtually every point in the game world. It is the physical manifestation of the Elden Ring's power and the central symbol of the Golden Order.

## Significance

The Erdtree is the source of grace — the golden light that guides Tarnished back to the Lands Between and directs them toward their destiny. Those who die beneath its light are returned to the Erdtree to await rebirth.

## The Forge of the Giants

The Erdtree can only be burned using the Rune of Death, which was removed from the Elden Ring by Marika. The Forge of the Giants, used by the Giants to burn the Erdtree in a previous age, becomes central to the Tarnished's quest.

## Symbolism

The Erdtree represents both the beauty and the oppression of the Golden Order — a system that provides grace and meaning but also enforces rigid hierarchy and suppresses alternatives.`,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    relationships: [
      { targetPageId: "er-marika", type: "related_to", label: "Vessel" },
      { targetPageId: "er-radagon", type: "related_to", label: "Elden Lord" },
    ],
    tags: ["Location", "Golden Order", "Grace"],
    completeness: 62,
    missingFields: ["Pre-Golden Order history", "Inner Erdtree structure", "Connection to Outer Gods"],
    createdAt: "2022-03-10",
    updatedAt: "2025-01-20",
    views: 29400,
  },
  {
    id: "er-rennala",
    loreId: "elden-ring",
    title: "Rennala, Queen of the Full Moon",
    slug: "rennala",
    category: "Character",
    excerpt:
      "The Queen of the Carian Royal Family and master of the Academy of Raya Lucaria, shattered by grief after Radagon's abandonment.",
    content: `Rennala, Queen of the Full Moon, was the head of the Carian Royal Family and the greatest sorcerer of her age. Her mastery of lunar sorcery made her a formidable opponent to the Golden Order before her marriage to Radagon.

## The Academy of Raya Lucaria

Rennala led the Academy of Raya Lucaria, the premier institution of sorcery in the Lands Between. Under her guidance, the Academy developed the most sophisticated magical traditions outside the Golden Order.

## After Radagon

When Radagon abandoned Rennala to become Marika's consort, she was devastated. She retreated into the Grand Library, clutching a small amber egg — a gift from Radagon — and lost herself in grief. Her students, initially loyal, eventually turned against her.

## Rebirth

In the game, Rennala offers the service of rebirth — allowing the Tarnished to reallocate their attributes. This mechanic is tied to her obsessive attempts to create a perfect child to replace those she lost.`,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    relationships: [
      { targetPageId: "er-radagon", type: "related_to", label: "Former Husband" },
      { targetPageId: "er-marika", type: "enemy_of", label: "Rival" },
    ],
    tags: ["Demigod", "Sorcery", "Carian"],
    completeness: 68,
    missingFields: ["Pre-war Carian history", "Full list of children", "Lunar magic origins"],
    createdAt: "2022-03-15",
    updatedAt: "2025-01-25",
    views: 24600,
  },
  {
    id: "er-godwyn",
    loreId: "elden-ring",
    title: "Godwyn the Golden",
    slug: "godwyn-the-golden",
    category: "Character",
    excerpt:
      "The first of Marika's children to die, whose soul-death on the Night of Black Knives triggered the Shattering and the end of the Golden Age.",
    content: `Godwyn the Golden was the firstborn son of Queen Marika and her first Elden Lord, Godfrey. Beloved by all, he was considered the ideal of the Golden Order — noble, powerful, and merciful.

## The Night of Black Knives

On the Night of Black Knives, assassins wielding blades imbued with the Rune of Death struck simultaneously at Godwyn and the demigod Ranni. Godwyn's soul was killed while his body lived on — an unprecedented and horrifying outcome.

## The Prince of Death

Godwyn's deathless body, buried beneath the Erdtree, continued to grow and spread. His corrupted flesh spawned the Deathroot and the Those Who Live in Death — undead beings that the Golden Order considers abominations.

## Significance

Godwyn's death was the catalyst for everything: Marika's shattering of the Elden Ring, the Shattering war, and ultimately the events of the game. He is the wound at the centre of the Lands Between's history.`,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    relationships: [
      { targetPageId: "er-marika", type: "related_to", label: "Mother" },
      { targetPageId: "er-erdtree", type: "located_in", label: "Buried Beneath" },
    ],
    tags: ["Demigod", "Night of Black Knives", "Deathroot"],
    completeness: 58,
    missingFields: ["Pre-death campaigns", "Relationship with siblings", "Full extent of body corruption"],
    createdAt: "2022-04-01",
    updatedAt: "2025-01-18",
    views: 19800,
  },

  // ---- GAME OF THRONES ----
  {
    id: "got-jon-snow",
    loreId: "game-of-thrones",
    title: "Jon Snow",
    slug: "jon-snow",
    category: "Character",
    excerpt:
      "The bastard son of Eddard Stark — later revealed as Aegon Targaryen, the true heir to the Iron Throne — whose journey from the Wall to the War for the Dawn defines the series.",
    content: `Jon Snow, born Aegon Targaryen, is the son of Rhaegar Targaryen and Lyanna Stark. Raised as the bastard son of Eddard Stark, his true identity remained hidden until late in the story.

## The Night's Watch

Jon joined the Night's Watch and rose to become Lord Commander, the youngest in the organisation's history. His leadership was defined by his willingness to make unpopular decisions — including allowing the Free Folk south of the Wall.

## Death and Resurrection

Jon was assassinated by his own men at Castle Black, only to be resurrected by the Red Priestess Melisandre. His resurrection freed him from his Night's Watch vows, allowing him to pursue his destiny.

## The True Heir

Jon's true parentage — revealed through Bran Stark's visions — made him the legitimate heir to the Iron Throne, a revelation that complicated his relationship with Daenerys Targaryen and ultimately led to the series' tragic conclusion.`,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    relationships: [
      { targetPageId: "got-daenerys", type: "ally_of", label: "Queen / Aunt" },
      { targetPageId: "got-winterfell", type: "located_in", label: "Home" },
      { targetPageId: "got-the-wall", type: "located_in", label: "Served At" },
    ],
    tags: ["Stark", "Targaryen", "Night's Watch", "Protagonist"],
    completeness: 82,
    missingFields: ["Beyond the Wall fate", "Free Folk relationship details"],
    createdAt: "2023-06-01",
    updatedAt: "2025-03-01",
    views: 68400,
  },
  {
    id: "got-daenerys",
    loreId: "game-of-thrones",
    title: "Daenerys Targaryen",
    slug: "daenerys-targaryen",
    category: "Character",
    excerpt:
      "The last scion of House Targaryen, Mother of Dragons, and claimant to the Iron Throne whose quest for justice ultimately consumed her.",
    content: `Daenerys Targaryen, the last surviving child of King Aerys II Targaryen, was born during the storm that destroyed the Targaryen fleet at Dragonstone — earning her the epithet "Stormborn." Her journey from exile to conqueror is one of the series' central narratives.

## Dragons

Daenerys hatched three dragon eggs in the funeral pyre of her husband Khal Drogo, becoming the first person to hatch dragons in over a century. Drogon, Rhaegal, and Viserion became central to her military power.

## Liberation and Conquest

Daenerys freed the slaves of Astapor, Yunkai, and Meereen, building a loyal army of Unsullied and Dothraki. Her stated mission was to "break the wheel" of dynastic power.

## The Burning of King's Landing

Daenerys's decision to burn King's Landing — even after the city's surrender — remains one of the most debated moments in the series, representing either a tragic fall or a logical conclusion to her character.`,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    relationships: [
      { targetPageId: "got-jon-snow", type: "ally_of", label: "Nephew / Ally" },
      { targetPageId: "got-winterfell", type: "related_to", label: "Invaded" },
    ],
    tags: ["Targaryen", "Dragons", "Queen", "Protagonist"],
    completeness: 76,
    missingFields: ["Essos campaign full timeline", "Dragon bond details", "Dothraki culture integration"],
    createdAt: "2023-06-05",
    updatedAt: "2025-02-20",
    views: 59200,
  },
  {
    id: "got-winterfell",
    loreId: "game-of-thrones",
    title: "Winterfell",
    slug: "winterfell",
    category: "Location",
    excerpt:
      "The ancient seat of House Stark in the North, a fortress that has stood for eight thousand years and witnessed the most pivotal events of the War of the Five Kings.",
    content: `Winterfell is the ancestral seat of House Stark and the capital of the North. Built over a series of hot springs that keep its walls warm even in winter, it is one of the oldest and most formidable castles in Westeros.

## Architecture

The castle is a massive complex of walls, towers, and keeps built over centuries. The Great Keep, the Great Hall, the Godswood with its ancient heart tree, and the crypts beneath the castle are its most significant features.

## History

Winterfell was founded by Bran the Builder, the legendary founder of House Stark, at the same time as the Wall. It has withstood thousands of years of winter, wildling raids, and war.

## The Long Night

Winterfell was the site of the Battle of Winterfell — the climactic confrontation between the living and the Army of the Dead, in which Arya Stark killed the Night King.`,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    relationships: [
      { targetPageId: "got-jon-snow", type: "related_to", label: "Home" },
      { targetPageId: "got-daenerys", type: "related_to", label: "Battlefield" },
      { targetPageId: "got-the-wall", type: "related_to", label: "Southern Anchor" },
    ],
    tags: ["Location", "Stark", "North", "Castle"],
    completeness: 70,
    missingFields: ["Detailed floor plan", "Full siege history", "Crypts occupants list"],
    createdAt: "2023-07-01",
    updatedAt: "2025-01-15",
    views: 34800,
  },
  {
    id: "got-the-wall",
    loreId: "game-of-thrones",
    title: "The Wall",
    slug: "the-wall",
    category: "Location",
    excerpt:
      "The colossal fortification of ice and magic stretching across the northern border of Westeros, built to defend the realm against the White Walkers.",
    content: `The Wall is a colossal fortification of ice, stone, and ancient magic stretching approximately 300 miles across the northern border of Westeros. Standing 700 feet tall at its highest point, it was constructed eight thousand years ago following the Long Night.

## Construction

According to legend, the Wall was built by Bran the Builder with the help of giants and the magic of the Children of the Forest. Its magical properties prevent the dead from passing — a protection that held for millennia.

## The Night's Watch

The Night's Watch, an ancient order of sworn brothers, has guarded the Wall since its construction. By the time of the series, the Watch has dwindled to a few hundred men, struggling to maintain nineteen castles along its length.

## The Fall

The Wall was ultimately destroyed by the Night King riding the reanimated Viserion, opening the way for the Army of the Dead to march south.`,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    relationships: [
      { targetPageId: "got-jon-snow", type: "related_to", label: "Served Here" },
      { targetPageId: "got-winterfell", type: "related_to", label: "Southern Connection" },
    ],
    tags: ["Location", "Night's Watch", "Magic", "Fortification"],
    completeness: 65,
    missingFields: ["All 19 castles documented", "Night's Watch full history", "Magic ward mechanics"],
    createdAt: "2023-07-10",
    updatedAt: "2025-01-10",
    views: 28600,
  },

  // ---- LORD OF THE RINGS ----
  {
    id: "lotr-gandalf",
    loreId: "lord-of-the-rings",
    title: "Gandalf",
    slug: "gandalf",
    category: "Character",
    excerpt:
      "The Istar wizard and servant of the Valar whose guidance shaped the fate of Middle-earth across three ages, known by many names: Mithrandir, Olórin, the Grey Pilgrim.",
    content: `Gandalf, known in Valinor as Olórin, is one of the five Istari (wizards) sent to Middle-earth by the Valar to aid in the struggle against Sauron. He is arguably the most important figure in the events of the Third Age.

## Origins

Gandalf was originally a Maia — a divine spirit — in the service of Manwë and Varda in Valinor. He was chosen to be sent to Middle-earth as one of the five Istari, taking the form of an old man to walk among mortals.

## The Grey and the White

Gandalf initially bore the title Gandalf the Grey, wielding the Elven ring Narya. After his battle with the Balrog Durin's Bane in Moria, he died and was returned by the Valar as Gandalf the White, replacing Saruman as head of the order.

## Role in the Fellowship

Gandalf was the architect of the Quest of the Ring, having spent decades investigating the One Ring and recognising its danger. He guided the Fellowship of the Ring until his apparent death in Moria.`,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    relationships: [
      { targetPageId: "lotr-frodo", type: "ally_of", label: "Guide" },
      { targetPageId: "lotr-shire", type: "related_to", label: "Visited" },
      { targetPageId: "lotr-mordor", type: "enemy_of", label: "Opposed" },
    ],
    tags: ["Wizard", "Istar", "Maia", "Fellowship"],
    completeness: 80,
    missingFields: ["Valinor history", "Full timeline of Third Age activities", "Narya lore"],
    createdAt: "2023-09-22",
    updatedAt: "2025-02-10",
    views: 31200,
  },
  {
    id: "lotr-frodo",
    loreId: "lord-of-the-rings",
    title: "Frodo Baggins",
    slug: "frodo-baggins",
    category: "Character",
    excerpt:
      "The hobbit of the Shire who bore the One Ring to Mount Doom — a journey that saved Middle-earth but left an indelible wound on his spirit.",
    content: `Frodo Baggins was a hobbit of the Shire, nephew and heir of Bilbo Baggins, who became the Ring-bearer and completed the Quest of the Ring by destroying the One Ring in the fires of Mount Doom.

## The Ring-Bearer

Frodo inherited the One Ring from Bilbo at the age of 50. Unlike Bilbo, who had carried the Ring for decades, Frodo was chosen by Gandalf to carry it to Rivendell — a journey that expanded into the full Quest.

## The Weight of the Ring

The Ring's corrupting influence grew heavier as Frodo neared Mordor. His relationship with Gollum — whom he refused to kill, recognising the creature's pitiable nature — proved crucial: it was Gollum who ultimately destroyed the Ring.

## The Grey Havens

Frodo's spiritual wounds from bearing the Ring could not be healed in Middle-earth. He was granted passage to the Undying Lands alongside Gandalf, Bilbo, and the Ring-bearers, departing from the Grey Havens.`,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    relationships: [
      { targetPageId: "lotr-gandalf", type: "ally_of", label: "Guide" },
      { targetPageId: "lotr-shire", type: "located_in", label: "Home" },
      { targetPageId: "lotr-mordor", type: "related_to", label: "Destination" },
    ],
    tags: ["Hobbit", "Ring-bearer", "Shire", "Fellowship"],
    completeness: 75,
    missingFields: ["Shire childhood details", "Post-Mordor recovery", "Grey Havens voyage"],
    createdAt: "2023-09-25",
    updatedAt: "2025-02-05",
    views: 27800,
  },
  {
    id: "lotr-shire",
    loreId: "lord-of-the-rings",
    title: "The Shire",
    slug: "the-shire",
    category: "Location",
    excerpt:
      "The pastoral homeland of the hobbits in the northwest of Middle-earth — a land of rolling hills, round doors, and deep comfort that represents everything worth protecting.",
    content: `The Shire is a region in the northwest of Middle-earth, inhabited by hobbits. It is a fertile, peaceful land of rolling hills, farmland, and small villages, largely untouched by the great conflicts of the wider world.

## Geography

The Shire is divided into four Farthings: the North, South, East, and West Farthings. The village of Hobbiton, home of the Baggins family, sits in the Westfarthing. Michel Delving is the chief town.

## Hobbit Culture

Hobbits are a peaceful people who value comfort, food, and community above adventure. Their circular doors, underground homes (smials), and love of pipe-weed are defining cultural traits.

## The Scouring

During the War of the Ring, Saruman's agents occupied and industrialised the Shire. The returning hobbits — Frodo, Sam, Merry, and Pippin — led a successful uprising known as the Scouring of the Shire, restoring it to its natural state.`,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    relationships: [
      { targetPageId: "lotr-frodo", type: "related_to", label: "Home" },
      { targetPageId: "lotr-gandalf", type: "related_to", label: "Visited" },
    ],
    tags: ["Location", "Hobbit", "Eriador", "Peaceful"],
    completeness: 68,
    missingFields: ["Full Farthing geography", "Hobbit genealogy trees", "Post-Scouring restoration"],
    createdAt: "2023-10-01",
    updatedAt: "2025-01-20",
    views: 22400,
  },
  {
    id: "lotr-mordor",
    loreId: "lord-of-the-rings",
    title: "Mordor",
    slug: "mordor",
    category: "Location",
    excerpt:
      "The dark land of shadow in the southeast of Middle-earth, domain of Sauron and site of Mount Doom where the One Ring was forged and ultimately destroyed.",
    content: `Mordor is a volcanic wasteland in the southeast of Middle-earth, surrounded on three sides by mountain ranges: the Ered Lithui to the north and the Ephel Dúath to the west and south. It is the domain of Sauron and the location of Mount Doom.

## Geography

The interior of Mordor is divided into the plateau of Gorgoroth, the plain of Lithlad, and the Sea of Núrnen. Mount Doom (Orodruin) rises from Gorgoroth, its fires fed by the earth's heat.

## Barad-dûr

Sauron's fortress Barad-dûr, the Dark Tower, was built using the power of the One Ring. It could not be permanently destroyed while the Ring existed. The Eye of Sauron, a lidless flame, searched constantly for the Ring.

## The Destruction of the Ring

Frodo and Sam's journey through Mordor, guided by Gollum, culminated at the Crack of Doom within Mount Doom. Gollum's seizure of the Ring and his fall into the fire accomplished what Frodo ultimately could not — the Ring's destruction.`,
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    relationships: [
      { targetPageId: "lotr-frodo", type: "related_to", label: "Destination" },
      { targetPageId: "lotr-gandalf", type: "enemy_of", label: "Opposed" },
    ],
    tags: ["Location", "Sauron", "Volcanic", "Dark Land"],
    completeness: 60,
    missingFields: ["Mordor history pre-Sauron", "Full fortress descriptions", "Orc population details"],
    createdAt: "2023-10-10",
    updatedAt: "2025-01-15",
    views: 19600,
  },

  // ---- FORMULA 1 ----
  {
    id: "f1-max-verstappen",
    loreId: "formula-1",
    title: "Max Verstappen",
    slug: "max-verstappen",
    category: "Driver",
    excerpt:
      "The Dutch four-time Formula 1 World Champion who dominated the sport from 2021 to 2024, widely regarded as one of the greatest drivers in the history of the sport.",
    content: `Max Emilian Verstappen is a Dutch-Belgian racing driver who competes for Red Bull Racing. He became the youngest Formula 1 race winner in history at the 2016 Spanish Grand Prix and went on to win four consecutive World Championships from 2021 to 2024.

## Early Career

Verstappen made his F1 debut with Toro Rosso at the 2015 Australian Grand Prix at the age of 17, becoming the youngest driver to start a Formula 1 race. His promotion to Red Bull Racing mid-season in 2016 was unprecedented.

## Championship Dominance

The 2023 season saw Verstappen achieve the most dominant championship campaign in F1 history, winning 19 of 22 races. His combination of raw pace, racecraft, and tyre management placed him in the conversation for the greatest driver of all time.

## Driving Style

Verstappen is known for his aggressive overtaking, exceptional wet-weather ability, and willingness to defend positions forcefully. His car control at the limit is widely considered exceptional even among his peers.`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    relationships: [
      { targetPageId: "f1-red-bull", type: "drove_for", label: "Team" },
      { targetPageId: "f1-monaco", type: "competed_in", label: "Circuit" },
      { targetPageId: "f1-lewis-hamilton", type: "enemy_of", label: "Title Rival" },
    ],
    tags: ["Champion", "Red Bull", "Dutch", "Dominant"],
    completeness: 85,
    missingFields: ["Karting career details", "2025 season results", "Technical preferences"],
    createdAt: "2024-03-01",
    updatedAt: "2025-03-15",
    views: 48200,
  },
  {
    id: "f1-lewis-hamilton",
    loreId: "formula-1",
    title: "Lewis Hamilton",
    slug: "lewis-hamilton",
    category: "Driver",
    excerpt:
      "The seven-time Formula 1 World Champion and record holder for most race wins and pole positions, who joined Ferrari in 2025 after 12 years with Mercedes.",
    content: `Sir Lewis Carl Davidson Hamilton is a British racing driver who holds the records for most Formula 1 World Championship titles (seven, tied with Michael Schumacher), most race wins (103+), most pole positions (104+), and most podium finishes.

## McLaren Years

Hamilton made his F1 debut with McLaren in 2007, finishing second in the championship in his debut season before winning his first title in 2008 in dramatic fashion at the Brazilian Grand Prix.

## Mercedes Dynasty

Hamilton joined Mercedes in 2013 and went on to win six of his seven championships with the team, including an unprecedented four consecutive titles from 2017 to 2020. His partnership with the team produced one of the most successful driver-constructor relationships in the sport's history.

## Ferrari Chapter

In 2025, Hamilton made the surprise move to Ferrari — a partnership that captured the imagination of the entire motorsport world, pairing the sport's greatest driver with its most iconic team.`,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    relationships: [
      { targetPageId: "f1-red-bull", type: "enemy_of", label: "Rival Team" },
      { targetPageId: "f1-monaco", type: "competed_in", label: "Circuit" },
      { targetPageId: "f1-max-verstappen", type: "enemy_of", label: "Title Rival" },
    ],
    tags: ["Champion", "Mercedes", "Ferrari", "Record Holder"],
    completeness: 80,
    missingFields: ["Ferrari 2025 season details", "Activism timeline", "Full race win list"],
    createdAt: "2024-03-05",
    updatedAt: "2025-03-15",
    views: 42600,
  },
  {
    id: "f1-red-bull",
    loreId: "formula-1",
    title: "Red Bull Racing",
    slug: "red-bull-racing",
    category: "Team",
    excerpt:
      "The Austrian Formula 1 constructor that dominated the sport from 2010 to 2013 and again from 2021 to 2024, winning six Constructors' Championships.",
    content: `Red Bull Racing is an Austrian Formula 1 constructor based in Milton Keynes, England. Founded in 2005 following Red Bull's acquisition of the Jaguar Racing team, it became one of the most successful teams in the sport's history.

## Early Success

Under the leadership of Christian Horner and with Adrian Newey as chief technical officer, Red Bull won four consecutive Constructors' and Drivers' Championships from 2010 to 2013, with Sebastian Vettel claiming all four drivers' titles.

## The Verstappen Era

Red Bull's return to dominance from 2021 onwards was built around Max Verstappen and a series of exceptionally fast cars. The 2022 RB18 and 2023 RB19 were widely considered the most technically advanced cars of their respective seasons.

## Adrian Newey

Adrian Newey's departure from Red Bull in 2024 marked the end of an era. His aerodynamic genius had underpinned the team's success across both dominant periods.`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    relationships: [
      { targetPageId: "f1-max-verstappen", type: "related_to", label: "Driver" },
      { targetPageId: "f1-lewis-hamilton", type: "enemy_of", label: "Rival" },
      { targetPageId: "f1-monaco", type: "competed_in", label: "Circuit" },
    ],
    tags: ["Constructor", "Austrian", "Champions", "Milton Keynes"],
    completeness: 72,
    missingFields: ["Full technical staff list", "Car specifications by year", "Junior driver programme"],
    createdAt: "2024-03-10",
    updatedAt: "2025-03-10",
    views: 31400,
  },
  {
    id: "f1-monaco",
    loreId: "formula-1",
    title: "Circuit de Monaco",
    slug: "circuit-de-monaco",
    category: "Circuit",
    excerpt:
      "The most prestigious and demanding circuit on the Formula 1 calendar — a narrow street circuit through the principality of Monaco that has been raced since 1929.",
    content: `The Circuit de Monaco is a street circuit in the Principality of Monaco that winds through the narrow streets of Monte Carlo. It is the most prestigious race on the Formula 1 calendar and one of the most challenging circuits in motorsport.

## Layout

The circuit is 3.337 km long and features 19 corners. Key sections include the Sainte Dévote hairpin, the tunnel, the chicane at the swimming pool complex, and the Rascasse corner. The circuit's narrow width and lack of run-off areas make it uniquely unforgiving.

## History

The Monaco Grand Prix has been held since 1929, making it one of the oldest races in motorsport. It is one of the three races that form the Triple Crown of Motorsport alongside the Indianapolis 500 and the 24 Hours of Le Mans.

## Overtaking

Monaco is notorious for the near-impossibility of overtaking, making qualifying performance and strategy paramount. A driver who qualifies on pole position wins the race the majority of the time.`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    relationships: [
      { targetPageId: "f1-max-verstappen", type: "related_to", label: "Race Venue" },
      { targetPageId: "f1-lewis-hamilton", type: "related_to", label: "Race Venue" },
    ],
    tags: ["Circuit", "Street Circuit", "Monaco", "Prestigious"],
    completeness: 70,
    missingFields: ["Full lap record history", "Safety car statistics", "Track evolution over decades"],
    createdAt: "2024-03-15",
    updatedAt: "2025-02-28",
    views: 26800,
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getLoreById(id: string): Lore | undefined {
  return lores.find((l) => l.id === id);
}

export function getLoreBySlug(slug: string): Lore | undefined {
  return lores.find((l) => l.slug === slug);
}

export function getPageById(id: string): LorePage | undefined {
  return pages.find((p) => p.id === id);
}

export function getPageBySlug(loreId: string, slug: string): LorePage | undefined {
  return pages.find((p) => p.loreId === loreId && p.slug === slug);
}

export function getPagesByLore(loreId: string): LorePage[] {
  return pages.filter((p) => p.loreId === loreId);
}

export function getRelatedPages(page: LorePage): LorePage[] {
  return page.relationships
    .map((r) => getPageById(r.targetPageId))
    .filter((p): p is LorePage => p !== undefined);
}

export function getTrendingLores(): Lore[] {
  return lores.filter((l) => l.trending);
}

export function getRecentPages(limit = 8): LorePage[] {
  return [...pages]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export function searchPages(query: string): LorePage[] {
  const q = query.toLowerCase();
  return pages.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}

export function searchLores(query: string): Lore[] {
  const q = query.toLowerCase();
  return lores.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export const categoryIcons: Record<string, string> = {
  tv: "📺",
  game: "🎮",
  film: "🎬",
  sports: "🏎️",
  book: "📖",
  music: "🎵",
  history: "🏛️",
};

export const relationshipLabels: Record<RelationshipType, string> = {
  appears_in: "Appears In",
  related_to: "Related To",
  happened_at: "Happened At",
  teammate_of: "Teammate Of",
  created_by: "Created By",
  part_of: "Part Of",
  enemy_of: "Enemy Of",
  ally_of: "Ally Of",
  preceded_by: "Preceded By",
  followed_by: "Followed By",
  located_in: "Located In",
  drove_for: "Drove For",
  competed_in: "Competed In",
};
