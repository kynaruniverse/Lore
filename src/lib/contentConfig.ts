export const PAGE_CATEGORIES = [
  'Character',
  'Location',
  'Event',
  'Item',
  'Organisation',
  'Concept',
  'Timeline',
  'Episode',
  'Season',
  'Driver',
  'Team',
  'Circuit',
  'Match',
  'Other',
] as const

export type PageCategory = typeof PAGE_CATEGORIES[number]

export const categoryConfig: Record<PageCategory, {
  icon:              string
  color:             string   // oklch — for CSS/UI
  hex:               string   // hex — for Canvas API
  description:       string
  suggestedSections: string[]
}> = {
  Character: {
    icon:              '👤',
    color:             'oklch(0.62 0.18 42)',
    hex:               '#C4A962',
    description:       'People, creatures, and beings',
    suggestedSections: ['Overview', 'Appearance', 'Personality', 'Background', 'Abilities', 'Relationships'],
  },
  Location: {
    icon:              '📍',
    color:             'oklch(0.55 0.12 180)',
    hex:               '#4A7FA5',
    description:       'Places, regions, and settings',
    suggestedSections: ['Overview', 'Geography', 'History', 'Notable Features', 'Inhabitants'],
  },
  Event: {
    icon:              '📅',
    color:             'oklch(0.60 0.15 280)',
    hex:               '#8B5BA5',
    description:       'Important occurrences and battles',
    suggestedSections: ['Overview', 'Date', 'Location', 'Participants', 'Outcome', 'Aftermath'],
  },
  Item: {
    icon:              '🔮',
    color:             'oklch(0.58 0.14 140)',
    hex:               '#4A9A6A',
    description:       'Objects, artifacts, and equipment',
    suggestedSections: ['Overview', 'Appearance', 'Properties', 'History', 'Significance'],
  },
  Organisation: {
    icon:              '🏛️',
    color:             'oklch(0.60 0.12 320)',
    hex:               '#A55B6A',
    description:       'Groups, factions, and institutions',
    suggestedSections: ['Overview', 'History', 'Members', 'Goals', 'Headquarters'],
  },
  Concept: {
    icon:              '💭',
    color:             'oklch(0.65 0.16 60)',
    hex:               '#C49A3C',
    description:       'Ideas, magic systems, and philosophies',
    suggestedSections: ['Overview', 'Principles', 'Applications', 'History', 'Significance'],
  },
  Timeline: {
    icon:              '⏳',
    color:             'oklch(0.52 0.12 200)',
    hex:               '#3A7A8A',
    description:       'Chronological sequences',
    suggestedSections: ['Overview', 'Major Events', 'Eras', 'Key Dates'],
  },
  Episode: {
    icon:              '📺',
    color:             'oklch(0.62 0.10 250)',
    hex:               '#5A6FA5',
    description:       'Individual episodes of a series',
    suggestedSections: ['Overview', 'Plot', 'Cast', 'Notes', 'Quotes'],
  },
  Season: {
    icon:              '🗂️',
    color:             'oklch(0.58 0.10 260)',
    hex:               '#5A5A9A',
    description:       'Seasons of a series',
    suggestedSections: ['Overview', 'Episodes', 'Cast', 'Reception'],
  },
  Driver: {
    icon:              '🏎️',
    color:             'oklch(0.62 0.18 25)',
    hex:               '#C4622D',
    description:       'Racing drivers',
    suggestedSections: ['Overview', 'Career', 'Achievements', 'Teams', 'Statistics'],
  },
  Team: {
    icon:              '🏁',
    color:             'oklch(0.55 0.14 140)',
    hex:               '#4A8A5A',
    description:       'Racing teams',
    suggestedSections: ['Overview', 'History', 'Drivers', 'Cars', 'Achievements'],
  },
  Circuit: {
    icon:              '🔄',
    color:             'oklch(0.52 0.10 200)',
    hex:               '#3A6A7A',
    description:       'Race tracks',
    suggestedSections: ['Overview', 'Layout', 'History', 'Records', 'Notable Races'],
  },
  Match: {
    icon:              '⚽',
    color:             'oklch(0.60 0.14 150)',
    hex:               '#4A9A7A',
    description:       'Sports matches',
    suggestedSections: ['Overview', 'Teams', 'Score', 'Highlights', 'Aftermath'],
  },
  Other: {
    icon:              '📄',
    color:             'oklch(0.72 0.08 75)',
    hex:               '#9A8A6A',
    description:       'Other content types',
    suggestedSections: ['Overview', 'Details', 'Significance'],
  },
}

/** Build a markdown template from a category's suggested sections */
export function buildContentTemplate(category: PageCategory): string {
  const sections = categoryConfig[category]?.suggestedSections ?? ['Overview']
  return sections.map(s => `## ${s}\n\n`).join('\n')
}

export const completenessCriteria: Partial<Record<PageCategory, string[]>> = {
  Character: [
    'Overview section',
    'Appearance description',
    'Personality traits',
    'Background/history',
    'Abilities or skills',
    'Key relationships',
    'Significant quotes',
  ],
  Location: [
    'Overview section',
    'Geography description',
    'History',
    'Notable features',
    'Inhabitants or significance',
  ],
  Event: [
    'Overview section',
    'Date and location',
    'Participants',
    'Outcome',
    'Aftermath or significance',
  ],
  Organisation: [
    'Overview section',
    'History',
    'Key members',
    'Goals or purpose',
    'Headquarters or base',
  ],
  Item: [
    'Overview section',
    'Appearance',
    'Properties or abilities',
    'History or origin',
    'Significance',
  ],
}
