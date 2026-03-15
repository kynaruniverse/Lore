# Lore Project — Developer Roadmap

A comprehensive guide for maintaining and extending the Lore knowledge platform.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Managing Seed Data](#managing-seed-data)
3. [Image Management Strategy](#image-management-strategy)
4. [Adding New Lores](#adding-new-lores)
5. [Adding New Pages](#adding-new-pages)
6. [User-Generated Content](#user-generated-content)
7. [Editing and Deleting Content](#editing-and-deleting-content)
8. [Styling and Theming](#styling-and-theming)
9. [Common Tasks](#common-tasks)

---

## Project Architecture

### Tech Stack

The Lore project uses a modern, lightweight stack optimized for rapid development:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Vite + React + TypeScript | Fast development and production builds |
| Styling | TailwindCSS | Utility-first CSS framework |
| State Management | localStorage + React Context | Client-side data persistence |
| Routing | Wouter | Lightweight URL routing |
| UI Components | Lucide React | Icon library |
| Notifications | Sonner | Toast notifications |
| Animations | Framer Motion | Smooth page transitions |

### Project Structure

```
client/src/
├── pages/              # Page components (Home, CreateLore, CreatePage, etc.)
├── components/         # Reusable components (Layout, KnowledgeGraph, etc.)
├── lib/
│   ├── data.ts        # Seed data (Lores and Pages)
│   ├── loreStore.ts   # localStorage management and CRUD operations
│   └── ...
├── contexts/          # React Context (ThemeContext)
├── App.tsx            # Main app with routing
└── index.css          # Global styles with CSS variables
```

### Data Flow

1. **Seed Data** (`data.ts`) → Initial Lores and Pages
2. **localStorage** → User-created Lores and Pages, edited seed pages
3. **loreStore.ts** → CRUD functions that combine seed + user data
4. **Components** → Display data from loreStore

---

## Managing Seed Data

### Where Seed Data Lives

All initial Lores and Pages are defined in `/client/src/lib/data.ts`.

### Lore Structure

```typescript
export interface Lore {
  id: string;                    // Unique identifier
  title: string;                 // Display name
  slug: string;                  // URL-safe name (e.g., "breaking-bad")
  description: string;           // Short description
  category: "TV" | "Game" | "Film" | "Sport" | "Other";
  coverImage: string;            // URL for lore card (600px wide)
  heroImage: string;             // URL for hero section (1200px wide)
  color: string;                 // Hex color for theme
  pageCount: number;             // Number of pages
  contributorCount: number;      // Number of contributors
  isPublic: boolean;             // Visibility flag
  tags: string[];                // Search tags
  createdAt: string;             // ISO date (YYYY-MM-DD)
  updatedAt: string;             // ISO date
  views: number;                 // View count
  trending: boolean;             // Featured on home page
}
```

### Page Structure

```typescript
export interface LorePage {
  id: string;                    // Unique identifier
  loreId: string;                // Parent Lore ID
  title: string;                 // Page title
  slug: string;                  // URL-safe name
  category: string;              // "Character", "Location", "Event", etc.
  content: string;               // Markdown content
  excerpt: string;               // First 160 chars of content
  image?: string;                // Optional page image URL
  relationships: Relationship[]; // Links to other pages
  tags: string[];                // Search tags
  completeness: number;          // 0-100 percentage
  missingFields: string[];       // What's still needed
  createdAt: string;             // ISO date
  updatedAt: string;             // ISO date
  views: number;                 // View count
}
```

### Adding a New Lore to Seed Data

1. Open `/client/src/lib/data.ts`
2. Add a new object to the `lores` array:

```typescript
{
  id: "unique-id",
  title: "My New Lore",
  slug: "my-new-lore",
  description: "A brief description of this knowledge base.",
  category: "Film",
  coverImage: "https://images.unsplash.com/...",
  heroImage: "https://images.unsplash.com/...",
  color: "#FF6B6B",
  pageCount: 0,
  contributorCount: 1,
  isPublic: true,
  tags: ["tag1", "tag2"],
  createdAt: "2026-03-15",
  updatedAt: "2026-03-15",
  views: 0,
  trending: false,
}
```

3. Restart the dev server: `pnpm dev`

### Adding a New Page to Seed Data

1. Open `/client/src/lib/data.ts`
2. Find the `pages` array
3. Add a new object:

```typescript
{
  id: "unique-page-id",
  loreId: "my-new-lore",  // Must match a Lore ID
  title: "Character Name",
  slug: "character-name",
  category: "Character",
  content: `## Overview\n\nYour markdown content here...`,
  excerpt: "First 160 characters of content...",
  image: "https://images.unsplash.com/...",
  relationships: [
    { targetPageId: "other-page-id", type: "related_to", label: "Related Character" }
  ],
  tags: ["tag1", "tag2"],
  completeness: 75,
  missingFields: ["Backstory details"],
  createdAt: "2026-03-15",
  updatedAt: "2026-03-15",
  views: 1000,
}
```

4. Restart the dev server

---

## Image Management Strategy

### Image Sources

The Lore project uses **free, publicly accessible image URLs** from these sources:

| Source | Best For | License | URL Pattern |
|--------|----------|---------|------------|
| Unsplash | Portraits, landscapes, general photos | Free (CC0) | `https://images.unsplash.com/photo-...` |
| Pexels | Stock photos, nature, people | Free (CC0) | `https://images.pexels.com/photos/...` |
| Pixabay | Diverse content, illustrations | Free (CC0) | `https://pixabay.com/get/...` |
| Wikimedia | Historical, cultural, technical images | CC-licensed | `https://commons.wikimedia.org/...` |

### Adding Images to Seed Pages

Edit `/client/src/lib/data.ts` and add the `image` field to any page:

```typescript
{
  id: "character-id",
  // ... other fields
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
}
```

**Image URL best practices:**
- Use query parameters for size: `?w=400&q=80` (width in pixels, quality 0-100)
- For character pages: 400px wide
- For location pages: 600px wide
- Always test the URL in a browser first

### How Users Add Images

When creating or editing a page, users can paste image URLs in the **Image URL** field:

1. Find a public image URL (Unsplash, Pexels, etc.)
2. Copy the full URL
3. Paste into the "Image URL (optional)" field in the form
4. Save the page

**User-friendly image sources to recommend:**
- Unsplash: https://unsplash.com (search for any topic)
- Pexels: https://www.pexels.com (free stock photos)
- Pixabay: https://pixabay.com (millions of images)

### Future Enhancement: Auto-Suggest Images

To make image discovery easier for users, you could integrate an image search API:

```typescript
// Pseudo-code for future enhancement
async function suggestImages(pageTitle: string) {
  const results = await fetch(`https://api.unsplash.com/search/photos?query=${pageTitle}`);
  return results.json().results.map(r => r.urls.regular);
}
```

This would automatically suggest relevant images based on the page title.

---

## Adding New Lores

### Via the UI (User-Created)

1. Click **"Create"** in the navigation
2. Fill in the Lore details (title, description, category, tags)
3. Click **"Create Lore"**
4. The new Lore appears in your collection and on the home page

User-created Lores are saved to `localStorage` and persist across sessions.

### Via Code (Seed Data)

See [Adding a New Lore to Seed Data](#adding-a-new-lore-to-seed-data) above.

---

## Adding New Pages

### Via the UI (User-Created)

1. Navigate to a Lore (e.g., Breaking Bad)
2. Click **"+ Add Page"**
3. Fill in the page details:
   - **Title**: Page name (required)
   - **Category**: Character, Location, Event, etc.
   - **Content**: Markdown text (supports `##`, `**bold**`, `*italic*`, etc.)
   - **Image URL**: Optional image from Unsplash, Pexels, etc.
   - **Tags**: Comma-separated keywords
   - **Relationships**: Link to other pages in the same Lore
4. Click **"Create Page"**

User-created pages are saved to `localStorage`.

### Via Code (Seed Data)

See [Adding a New Page to Seed Data](#adding-a-new-page-to-seed-data) above.

---

## User-Generated Content

### How It Works

The Lore project uses **localStorage** to store user-created content on top of seed data:

1. **Seed Data** (read-only): Initial Lores and Pages in `data.ts`
2. **User Lores** (localStorage): New Lores created by users
3. **User Pages** (localStorage): New Pages created by users
4. **Edited Seed Pages** (localStorage): Modifications to seed pages

### Storage Keys

| Key | Purpose | Max Size |
|-----|---------|----------|
| `lore_user_lores` | User-created Lores | ~5MB |
| `lore_user_pages` | User-created Pages | ~5MB |
| `lore_edited_seed_pages` | Edits to seed pages | ~5MB |

### Clearing User Data

To reset all user-created content (for testing or cleanup):

```javascript
// In browser console
localStorage.removeItem('lore_user_lores');
localStorage.removeItem('lore_user_pages');
localStorage.removeItem('lore_edited_seed_pages');
location.reload();
```

---

## Editing and Deleting Content

### Editing Pages

**Seed Pages:**
1. Navigate to any seed page (e.g., "Walter White")
2. Click the **"Edit"** button
3. Modify the content, image, tags, or relationships
4. Click **"Save Changes"**
5. Your edits are saved to localStorage and persist

**User-Created Pages:**
1. Navigate to your page
2. Click **"Edit"**
3. Modify any field
4. Click **"Save Changes"** or **"Delete"**

### Deleting Pages

Only **user-created pages** can be deleted:

1. Navigate to your page
2. Click **"Edit"**
3. Click **"Delete"**
4. Confirm the deletion

Seed pages cannot be deleted, but you can edit them to remove/hide content.

---

## Styling and Theming

### CSS Architecture

The project uses **CSS custom properties** (variables) for theming:

```css
/* Light theme (default) */
:root {
  --color-foreground: #1a1a1a;
  --color-background: #ffffff;
  --color-primary: #C4622D;
  /* ... more variables */
}

/* Dark theme */
[data-theme="dark"] {
  --color-foreground: #ffffff;
  --color-background: #0a0a0a;
  --color-primary: #FF8C42;
  /* ... more variables */
}
```

### Switching Themes

Users can toggle between light and dark modes using the **theme button** in the sidebar footer or mobile header.

### Adding a New Color

1. Open `/client/src/index.css`
2. Add the variable to both `:root` (light) and `[data-theme="dark"]` (dark):

```css
:root {
  --color-new-color: #FF6B6B;
}

[data-theme="dark"] {
  --color-new-color: #FF8C8C;
}
```

3. Use in components:

```tsx
<div style={{ color: 'var(--color-new-color)' }}>Text</div>
```

### Lore Card Styling

Each Lore has a `color` property that can be used for custom styling:

```typescript
{
  id: "breaking-bad",
  color: "#C4622D",  // Ember orange
  // ...
}
```

---

## Common Tasks

### Task: Update a Character's Image

1. Open `/client/src/lib/data.ts`
2. Find the character page (e.g., `id: "bb-walter-white"`)
3. Update the `image` URL:

```typescript
image: "https://images.unsplash.com/photo-NEW-ID?w=400&q=80",
```

4. Save and restart dev server

### Task: Add Missing Information to a Page

1. Navigate to the page (e.g., "Jane Margolis")
2. Click **"Edit"**
3. Update the content with new information
4. Update `completeness` percentage and `missingFields` array
5. Click **"Save Changes"**

### Task: Create a New Lore with Pages

1. Click **"Create"** → Create a new Lore (e.g., "The Matrix")
2. Click **"+ Add Page"** → Add characters (Neo, Trinity, Morpheus, etc.)
3. For each page, add an image URL from Unsplash
4. Link pages together using Relationships

### Task: Fix a Broken Image URL

1. Navigate to the page with the broken image
2. Click **"Edit"**
3. Update the **Image URL** field with a new working URL
4. Click **"Save Changes"**

### Task: Add Relationships Between Pages

When creating or editing a page:

1. Scroll to the **Relationships** section
2. Enter the title of another page in the same Lore
3. Select the relationship type (e.g., "appears_in", "related_to", "enemy_of")
4. Click the **+** button to add
5. Save the page

---

## Deployment & Performance

### Building for Production

```bash
cd client
pnpm build
```

Output: `dist/` directory with optimized assets

### Performance Tips

- **Image optimization**: Use query parameters to resize images (`?w=400&q=80`)
- **Code splitting**: Vite automatically splits code by route
- **Lazy loading**: Images load on demand
- **localStorage limits**: Keep total data under 5-10MB per origin

### Monitoring

Track these metrics:

- **Page load time**: Should be < 2 seconds
- **localStorage usage**: Monitor via DevTools → Application → localStorage
- **Image load time**: Use browser DevTools → Network tab

---

## Troubleshooting

### Images Not Loading

1. Check the URL is publicly accessible (paste in browser)
2. Verify query parameters are correct (`?w=400&q=80`)
3. Check for CORS issues (use images from trusted sources)
4. Clear browser cache and localStorage

### Pages Not Appearing

1. Verify `loreId` matches an existing Lore ID
2. Check `slug` is unique within that Lore
3. Restart dev server: `pnpm dev`
4. Clear localStorage if needed

### localStorage Full

If you see "QuotaExceededError":

1. Clear old user data: `localStorage.clear()`
2. Reduce image sizes (use smaller query parameters)
3. Archive old Lores to a backup file

---

## Next Steps & Future Enhancements

### Recommended Improvements

1. **Backend Database**: Replace localStorage with a real database (PostgreSQL, MongoDB)
2. **User Accounts**: Add authentication and user profiles
3. **Image Upload**: Allow users to upload images instead of just pasting URLs
4. **Auto-Suggest Images**: Integrate Unsplash API for image suggestions
5. **Collaborative Editing**: Real-time collaboration on pages
6. **Version History**: Track changes and allow reverting edits
7. **Search**: Full-text search across all pages
8. **Export**: Download Lores as PDF or Markdown

### Code Quality

- Add unit tests (Jest + React Testing Library)
- Add E2E tests (Cypress or Playwright)
- Set up CI/CD pipeline (GitHub Actions)
- Add TypeScript strict mode
- Add ESLint and Prettier

---

## Questions?

For issues or questions, refer to the main README.md or check the GitHub issues page.

Happy building! 🚀
