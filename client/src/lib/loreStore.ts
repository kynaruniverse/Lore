// ============================================================
// LORE — localStorage Store
// Manages user-created Lores and Pages on top of seed data
// ============================================================

import { nanoid } from "nanoid";
import { lores as seedLores, pages as seedPages, type Lore, type LorePage, type RelationshipType } from "./data";

const LORES_KEY = "lore_user_lores";
const PAGES_KEY = "lore_user_pages";

// ── Lore helpers ──────────────────────────────────────────

function readUserLores(): Lore[] {
  try {
    const raw = localStorage.getItem(LORES_KEY);
    return raw ? (JSON.parse(raw) as Lore[]) : [];
  } catch {
    return [];
  }
}

function writeUserLores(lores: Lore[]): void {
  localStorage.setItem(LORES_KEY, JSON.stringify(lores));
}

export function getAllLores(): Lore[] {
  return [...seedLores, ...readUserLores()];
}

export function getLoreById(id: string): Lore | undefined {
  return getAllLores().find((l) => l.id === id);
}

export function getLoreBySlug(slug: string): Lore | undefined {
  return getAllLores().find((l) => l.slug === slug);
}

export function createLore(input: {
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
  const existing = getAllLores().map((l) => l.slug);
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

  const userLores = readUserLores();
  writeUserLores([...userLores, newLore]);
  return newLore;
}

export function updateLore(id: string, updates: Partial<Lore>): void {
  const userLores = readUserLores();
  const idx = userLores.findIndex((l) => l.id === id);
  if (idx !== -1) {
    userLores[idx] = { ...userLores[idx], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
    writeUserLores(userLores);
  }
}

export function deleteLore(id: string): void {
  const userLores = readUserLores();
  writeUserLores(userLores.filter((l) => l.id !== id));
  // Also delete associated pages
  const userPages = readUserPages();
  writeUserPages(userPages.filter((p) => p.loreId !== id));
}

// ── Page helpers ──────────────────────────────────────────

function readUserPages(): LorePage[] {
  try {
    const raw = localStorage.getItem(PAGES_KEY);
    return raw ? (JSON.parse(raw) as LorePage[]) : [];
  } catch {
    return [];
  }
}

function writeUserPages(pages: LorePage[]): void {
  localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
}

export function getAllPages(): LorePage[] {
  return [...seedPages, ...readUserPages()];
}

export function getPageById(id: string): LorePage | undefined {
  return getAllPages().find((p) => p.id === id);
}

export function getPageBySlug(loreId: string, slug: string): LorePage | undefined {
  return getAllPages().find((p) => p.loreId === loreId && p.slug === slug);
}

export function getPagesByLore(loreId: string): LorePage[] {
  return getAllPages().filter((p) => p.loreId === loreId);
}

export function getRelatedPages(page: LorePage): LorePage[] {
  return page.relationships
    .map((r) => getPageById(r.targetPageId))
    .filter((p): p is LorePage => p !== undefined);
}

export function createPage(input: {
  loreId: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  relationships: Array<{ targetPageId: string; type: RelationshipType; label?: string }>;
}): LorePage {
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existingSlugs = getAllPages()
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
    relationships: input.relationships,
    tags: input.tags,
    completeness: input.content.length > 200 ? 70 : 40,
    missingFields: [],
    createdAt: now,
    updatedAt: now,
    views: 0,
  };

  const userPages = readUserPages();
  writeUserPages([...userPages, newPage]);

  // Increment lore pageCount for user-created lores
  const userLores = readUserLores();
  const loreIdx = userLores.findIndex((l) => l.id === input.loreId);
  if (loreIdx !== -1) {
    userLores[loreIdx].pageCount += 1;
    userLores[loreIdx].updatedAt = now;
    writeUserLores(userLores);
  }

  return newPage;
}

export function updatePage(id: string, updates: Partial<LorePage>): void {
  const userPages = readUserPages();
  const idx = userPages.findIndex((p) => p.id === id);
  if (idx !== -1) {
    const now = new Date().toISOString().split("T")[0];
    userPages[idx] = { ...userPages[idx], ...updates, updatedAt: now };
    if (updates.content) {
      userPages[idx].excerpt =
        updates.content.replace(/#+\s/g, "").slice(0, 160).trim() +
        (updates.content.length > 160 ? "…" : "");
    }
    writeUserPages(userPages);
  }
}

export function deletePage(id: string): void {
  const userPages = readUserPages();
  writeUserPages(userPages.filter((p) => p.id !== id));
}

export function isUserPage(id: string): boolean {
  return readUserPages().some((p) => p.id === id);
}

export function isUserLore(id: string): boolean {
  return readUserLores().some((l) => l.id === id);
}

// ── Search helpers ────────────────────────────────────────

export function searchPages(query: string): LorePage[] {
  const q = query.toLowerCase();
  return getAllPages().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}

export function searchLores(query: string): Lore[] {
  const q = query.toLowerCase();
  return getAllLores().filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getTrendingLores(): Lore[] {
  return getAllLores().filter((l) => l.trending);
}

export function getRecentPages(limit = 8): LorePage[] {
  return [...getAllPages()]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}
