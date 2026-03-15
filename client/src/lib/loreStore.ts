// ============================================================
// LORE — localStorage Store
// Manages user-created Lores and Pages on top of seed data
// ============================================================

import { encrypt, decrypt } from "./encryption";

// ============================================================
// LORE — localStorage Store
// Manages user-created Lores and Pages on top of seed data
// ============================================================

import { nanoid } from "nanoid";
import { lores as seedLores, pages as seedPages, type Lore, type LorePage, type RelationshipType } from "./data";

const LORES_KEY = "lore_user_lores";
const PAGES_KEY = "lore_user_pages";
const EDITED_SEED_PAGES_KEY = "lore_edited_seed_pages"; // Tracks edits to seed pages

// ── Lore helpers ──────────────────────────────────────────

async function readUserLores(): Promise<Lore[]> {
  try {
    const raw = localStorage.getItem(LORES_KEY);
    if (!raw) return [];
    const decrypted = await decrypt(raw);
    return JSON.parse(decrypted) as Lore[];
  } catch (error) {
    console.error("Error reading user lores from localStorage:", error);
    return [];
  }
}

async function writeUserLores(lores: Lore[]): Promise<void> {
  try {
    const encrypted = await encrypt(JSON.stringify(lores));
    localStorage.setItem(LORES_KEY, encrypted);
  } catch (error) {
    console.error("Error writing user lores to localStorage:", error);
  }
}

export async function getAllLores(): Promise<Lore[]> {
  return [...seedLores, ...(await readUserLores())];
}

export async function getLoreById(id: string): Promise<Lore | undefined> {
  return (await getAllLores()).find((l) => l.id === id);
}

export async function getLoreBySlug(slug: string): Promise<Lore | undefined> {
  return (await getAllLores()).find((l) => l.slug === slug);
}

export async function createLore(input: {
  title: string;
  description: string;
  category: Lore["category"];
  tags: string[];
  isPublic: boolean;
}): Lore {
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Ensure slug uniqueness
  const existing = (await getAllLores()).map((l) => l.slug);
  let finalSlug = slug;
  let counter = 2;
  while (existing.includes(finalSlug)) {
    finalSlug = `${slug}-${counter++}`;
  }

  const now = new Date().toISOString().split("T")[0];
  const newLore: Lore = {
    id: nanoid(),
    title: input.title,
    slug: finalSlug,
    description: input.description,
    category: input.category,
    coverImage: `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80`,
    heroImage: `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80`,
    color: "#C4622D",
    pageCount: 0,
    contributorCount: 1,
    isPublic: input.isPublic,
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
    views: 0,
    trending: false,
  };

  const userLores = await readUserLores();
  await writeUserLores([...userLores, newLore]);
  return newLore;
}

export async function updateLore(id: string, updates: Partial<Lore>): Promise<void> {
  const userLores = await readUserLores();
  const idx = userLores.findIndex((l) => l.id === id);
  if (idx !== -1) {
    userLores[idx] = { ...userLores[idx], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
    await writeUserLores(userLores);
  }
}

export async function deleteLore(id: string): Promise<void> {
  const userLores = await readUserLores();
  await writeUserLores(userLores.filter((l) => l.id !== id));
  // Also delete associated pages
  const userPages = await readUserPages();
  await writeUserPages(userPages.filter((p) => p.loreId !== id));
}

// ── Page helpers ──────────────────────────────────────────

async function readUserPages(): Promise<LorePage[]> {
  try {
    const raw = localStorage.getItem(PAGES_KEY);
    if (!raw) return [];
    const decrypted = await decrypt(raw);
    return JSON.parse(decrypted) as LorePage[];
  } catch (error) {
    console.error("Error reading user pages from localStorage:", error);
    return [];
  }
}

async function writeUserPages(pages: LorePage[]): Promise<void> {
  try {
    const encrypted = await encrypt(JSON.stringify(pages));
    localStorage.setItem(PAGES_KEY, encrypted);
  } catch (error) {
    console.error("Error writing user pages to localStorage:", error);
  }
}

export async function getAllPages(): Promise<LorePage[]> {
  const editedSeedPages = await readEditedSeedPages();
  const seedPagesWithEdits = seedPages.map((p) => editedSeedPages[p.id] || p);
  return [...seedPagesWithEdits, ...(await readUserPages())];
}

export async function getPageById(id: string): Promise<LorePage | undefined> {
  return (await getAllPages()).find((p) => p.id === id);
}

export async function getPageBySlug(loreId: string, slug: string): Promise<LorePage | undefined> {
  return (await getAllPages()).find((p) => p.loreId === loreId && p.slug === slug);
}

export async function getPagesByLore(loreId: string): Promise<LorePage[]> {
  return (await getAllPages()).filter((p) => p.loreId === loreId);
}

export async function getRelatedPages(page: LorePage): Promise<LorePage[]> {
  const relatedPagePromises = page.relationships.map((r) => getPageById(r.targetPageId));
  const relatedPages = await Promise.all(relatedPagePromises);
  return relatedPages.filter((p): p is LorePage => p !== undefined);
}

export async function createPage(input: {
  loreId: string;
  title: string;
  category: string;
  content: string;
  image?: string;
  tags: string[];
  relationships: Array<{ targetPageId: string; type: RelationshipType; label?: string }>;
}): LorePage {
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existingSlugs = (await getAllPages())
    .filter((p) => p.loreId === input.loreId)
    .map((p) => p.slug);
  let finalSlug = slug;
  let counter = 2;
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter++}`;
  }

  const now = new Date().toISOString().split("T")[0];
  const excerpt = input.content.replace(/#+\s/g, "").slice(0, 160).trim() + (input.content.length > 160 ? "…" : "");

  const newPage: LorePage = {
    id: nanoid(),
    loreId: input.loreId,
    title: input.title,
    slug: finalSlug,
    category: input.category,
    content: input.content,
    excerpt,
    image: input.image,
    relationships: input.relationships,
    tags: input.tags,
    completeness: input.content.length > 200 ? 70 : 40,
    missingFields: [],
    createdAt: now,
    updatedAt: now,
    views: 0,
  };

  const userPages = await readUserPages();
  await writeUserPages([...userPages, newPage]);

  // Increment lore pageCount for user-created lores
  const userLores = await readUserLores();
  const loreIdx = userLores.findIndex((l) => l.id === input.loreId);
  if (loreIdx !== -1) {
    userLores[loreIdx].pageCount += 1;
    userLores[loreIdx].updatedAt = now;
    await writeUserLores(userLores);
  }

  return newPage;
}

export async function updatePage(id: string, updates: Partial<LorePage>): Promise<void> {
  const userPages = await readUserPages();
  const idx = userPages.findIndex((p) => p.id === id);
  if (idx !== -1) {
    const now = new Date().toISOString().split("T")[0];
    userPages[idx] = { ...userPages[idx], ...updates, updatedAt: now };
    if (updates.content) {
      userPages[idx].excerpt =
        updates.content.replace(/#+\s/g, "").slice(0, 160).trim() +
        (updates.content.length > 160 ? "…" : "");
    }
    await writeUserPages(userPages);
  }
}

export async function deletePage(id: string): Promise<void> {
  const userPages = await readUserPages();
  await writeUserPages(userPages.filter((p) => p.id !== id));
}

export async function isUserPage(id: string): Promise<boolean> {
  return (await readUserPages()).some((p) => p.id === id);
}

// ── Edited seed pages tracking ────────────────────────

async function readEditedSeedPages(): Promise<Record<string, LorePage>> {
  try {
    const raw = localStorage.getItem(EDITED_SEED_PAGES_KEY);
    if (!raw) return {};
    const decrypted = await decrypt(raw);
    return JSON.parse(decrypted) as Record<string, LorePage>;
  } catch (error) {
    console.error("Error reading edited seed pages from localStorage:", error);
    return {};
  }
}

async function writeEditedSeedPages(pages: Record<string, LorePage>): Promise<void> {
  try {
    const encrypted = await encrypt(JSON.stringify(pages));
    localStorage.setItem(EDITED_SEED_PAGES_KEY, encrypted);
  } catch (error) {
    console.error("Error writing edited seed pages to localStorage:", error);
  }
}

export async function getPageWithEdits(id: string): Promise<LorePage | undefined> {
  const editedSeedPages = await readEditedSeedPages();
  if (editedSeedPages[id]) {
    return editedSeedPages[id];
  }
  return await getPageById(id);
}

export async function canEditPage(id: string): Promise<boolean> {
  // Can edit both user-created pages and seed pages
  return true;
}

export async function editSeedPage(id: string, updates: Partial<LorePage>): Promise<void> {
  const page = await getPageById(id);
  if (!page) return;

  const editedSeedPages = await readEditedSeedPages();
  const now = new Date().toISOString().split("T")[0];
  const updatedPage = { ...page, ...updates, updatedAt: now };
  if (updates.content) {
    updatedPage.excerpt =
      updates.content.replace(/#+\s/g, "").slice(0, 160).trim() +
      (updates.content.length > 160 ? "…" : "");
  }
  editedSeedPages[id] = updatedPage;
  await writeEditedSeedPages(editedSeedPages);
}

export async function isUserLore(id: string): Promise<boolean> {
  return (await readUserLores()).some((l) => l.id === id);
}

// ── Search helpers ────────────────────────────────────────

export async function searchPages(query: string): Promise<LorePage[]> {
  const q = query.toLowerCase();
  return (await getAllPages()).filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}

export async function searchLores(query: string): Promise<Lore[]> {
  const q = query.toLowerCase();
  return (await getAllLores()).filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function getTrendingLores(): Promise<Lore[]> {
  return (await getAllLores()).filter((l) => l.trending);
}

export async function getRecentPages(limit = 8): Promise<LorePage[]> {
  return [...(await getAllPages())]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}
