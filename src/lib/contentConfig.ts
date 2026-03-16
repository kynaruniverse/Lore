// Standardized categories for all lores
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
  'Other'
] as const;

export type PageCategory = typeof PAGE_CATEGORIES[number];

// Category display configurations
export const categoryConfig: Record<PageCategory, {
  icon: string;
  color: string;
  description: string;
  suggestedSections: string[];
}> = {
  'Character': {
    icon: '👤',
    color: 'oklch(0.62 0.18 42)',
    description: 'People, creatures, and beings',
    suggestedSections: ['Overview', 'Appearance', 'Personality', 'Background', 'Abilities', 'Relationships']
  },
  'Location': {
    icon: '📍',
    color: 'oklch(0.55 0.12 180)',
    description: 'Places, regions, and settings',
    suggestedSections: ['Overview', 'Geography', 'History', 'Notable Features', 'Inhabitants']
  },
  'Event': {
    icon: '📅',
    color: 'oklch(0.60 0.15 280)',
    description: 'Important occurrences and battles',
    suggestedSections: ['Overview', 'Date', 'Location', 'Participants', 'Outcome', 'Aftermath']
  },
  'Item': {
    icon: '🔮',
    color: 'oklch(0.58 0.14 140)',
    description: 'Objects, artifacts, and equipment',
    suggestedSections: ['Overview', 'Appearance', 'Properties', 'History', 'Significance']
  },
  'Organisation': {
    icon: '🏛️',
    color: 'oklch(0.60 0.12 320)',
    description: 'Groups, factions, and institutions',
    suggestedSections: ['Overview', 'History', 'Members', 'Goals', 'Headquarters']
  },
  'Concept': {
    icon: '💭',
    color: 'oklch(0.65 0.16 60)',
    description: 'Ideas, magic systems, and philosophies',
    suggestedSections: ['Overview', 'Principles', 'Applications', 'History', 'Significance']
  },
  'Timeline': {
    icon: '⏳',
    color: 'oklch(0.52 0.12 200)',
    description: 'Chronological sequences',
    suggestedSections: ['Overview', 'Major Events', 'Eras', 'Key Dates']
  },
  'Episode': {
    icon: '📺',
    color: 'oklch(0.62 0.18 42)',
    description: 'Individual episodes of a series',
    suggestedSections: ['Overview', 'Plot', 'Cast', 'Notes', 'Quotes']
  },
  'Season': {
    icon: '📺',
    color: 'oklch(0.62 0.18 42)',
    description: 'Seasons of a series',
    suggestedSections: ['Overview', 'Episodes', 'Cast', 'Reception']
  },
  'Driver': {
    icon: '🏎️',
    color: 'oklch(0.62 0.18 42)',
    description: 'Racing drivers',
    suggestedSections: ['Overview', 'Career', 'Achievements', 'Teams', 'Statistics']
  },
  'Team': {
    icon: '🏁',
    color: 'oklch(0.58 0.14 140)',
    description: 'Racing teams',
    suggestedSections: ['Overview', 'History', 'Drivers', 'Cars', 'Achievements']
  },
  'Circuit': {
    icon: '🔄',
    color: 'oklch(0.52 0.12 200)',
    description: 'Race tracks',
    suggestedSections: ['Overview', 'Layout', 'History', 'Records', 'Notable Races']
  },
  'Match': {
    icon: '⚽',
    color: 'oklch(0.60 0.15 280)',
    description: 'Sports matches',
    suggestedSections: ['Overview', 'Teams', 'Score', 'Highlights', 'Aftermath']
  },
  'Other': {
    icon: '📄',
    color: 'oklch(0.72 0.12 75)',
    description: 'Other content types',
    suggestedSections: ['Overview', 'Details', 'Significance']
  }
};

// Standardized completeness criteria
export const completenessCriteria = {
  'Character': [
    'Overview section',
    'Appearance description',
    'Personality traits',
    'Background/history',
    'Abilities or skills',
    'Key relationships',
    'Significant quotes'
  ],
  'Location': [
    'Overview section',
    'Geography description',
    'History',
    'Notable features',
    'Inhabitants or significance'
  ],
  'Event': [
    'Overview section',
    'Date and location',
    'Participants',
    'Outcome',
    'Aftermath or significance'
  ]
  // Add more as needed
} as const;
