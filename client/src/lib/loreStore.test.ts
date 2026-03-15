import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAllLores, createLore, updateLore, deleteLore, isUserLore,
  getAllPages, createPage, updatePage, deletePage, isUserPage,
  editSeedPage, getPageWithEdits, canEditPage, searchLores, searchPages, getTrendingLores, getRecentPages
} from './loreStore';
import { lores as seedLores, pages as seedPages } from './data';

// Mock localStorage and crypto for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

const cryptoMock = {
  subtle: {
    generateKey: vi.fn(() => Promise.resolve('mockKey')),
    importKey: vi.fn(() => Promise.resolve('mockKey')),
    exportKey: vi.fn(() => Promise.resolve({ kty: 'oct', k: 'mockKey' })),
    encrypt: vi.fn((algo, key, data) => Promise.resolve(new ArrayBuffer(data.byteLength))),
    decrypt: vi.fn((algo, key, data) => Promise.resolve(data)),
  },
  getRandomValues: vi.fn((arr) => arr.fill(0)),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'crypto', { value: cryptoMock });

describe('loreStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  // Test Lore functions
  it('should return all lores including seed data', async () => {
    const lores = await getAllLores();
    expect(lores.length).toBeGreaterThanOrEqual(seedLores.length);
    expect(lores).toEqual(expect.arrayContaining(seedLores));
  });

  it('should create a new lore', async () => {
    const newLore = await createLore({
      title: 'Test Lore',
      description: 'A lore for testing',
      category: 'Fantasy',
      tags: ['test'],
      isPublic: true,
    });
    expect(newLore).toBeDefined();
    expect(newLore.title).toBe('Test Lore');
    const allLores = await getAllLores();
    expect(allLores).toContainEqual(newLore);
  });

  it('should update an existing lore', async () => {
    const newLore = await createLore({
      title: 'Update Test Lore',
      description: 'A lore to be updated',
      category: 'Fantasy',
      tags: ['test'],
      isPublic: true,
    });
    await updateLore(newLore.id, { title: 'Updated Lore Title' });
    const updatedLore = (await getAllLores()).find((l) => l.id === newLore.id);
    expect(updatedLore?.title).toBe('Updated Lore Title');
  });

  it('should delete a lore', async () => {
    const newLore = await createLore({
      title: 'Delete Test Lore',
      description: 'A lore to be deleted',
      category: 'Fantasy',
      tags: ['test'],
      isPublic: true,
    });
    await deleteLore(newLore.id);
    const allLores = await getAllLores();
    expect(allLores).not.toContainEqual(newLore);
  });

  it('should correctly identify user lores', async () => {
    const newLore = await createLore({
      title: 'User Lore',
      description: 'A user-created lore',
      category: 'Fantasy',
      tags: ['user'],
      isPublic: true,
    });
    expect(await isUserLore(newLore.id)).toBe(true);
    expect(await isUserLore(seedLores[0].id)).toBe(false);
  });

  // Test Page functions
  it('should return all pages including seed data', async () => {
    const allPages = await getAllPages();
    expect(allPages.length).toBeGreaterThanOrEqual(seedPages.length);
    expect(allPages).toEqual(expect.arrayContaining(seedPages));
  });

  it('should create a new page', async () => {
    const newLore = await createLore({
      title: 'Page Lore',
      description: 'Lore for pages',
      category: 'Fantasy',
      tags: ['page'],
      isPublic: true,
    });
    const newPage = await createPage({
      loreId: newLore.id,
      title: 'Test Page',
      category: 'Characters',
      content: 'This is a test page content.',
      tags: ['test'],
      relationships: [],
    });
    expect(newPage).toBeDefined();
    expect(newPage.title).toBe('Test Page');
    const allPages = await getAllPages();
    expect(allPages).toContainEqual(newPage);
  });

  it('should update an existing page', async () => {
    const newLore = await createLore({
      title: 'Update Page Lore',
      description: 'Lore for updating pages',
      category: 'Fantasy',
      tags: ['update'],
      isPublic: true,
    });
    const newPage = await createPage({
      loreId: newLore.id,
      title: 'Update Test Page',
      category: 'Characters',
      content: 'This is a test page content.',
      tags: ['test'],
      relationships: [],
    });
    await updatePage(newPage.id, { content: 'Updated page content.' });
    const updatedPage = (await getAllPages()).find((p) => p.id === newPage.id);
    expect(updatedPage?.content).toBe('Updated page content.');
  });

  it('should delete a page', async () => {
    const newLore = await createLore({
      title: 'Delete Page Lore',
      description: 'Lore for deleting pages',
      category: 'Fantasy',
      tags: ['delete'],
      isPublic: true,
    });
    const newPage = await createPage({
      loreId: newLore.id,
      title: 'Delete Test Page',
      category: 'Characters',
      content: 'This is a test page content.',
      tags: ['test'],
      relationships: [],
    });
    await deletePage(newPage.id);
    const allPages = await getAllPages();
    expect(allPages).not.toContainEqual(newPage);
  });

  it('should correctly identify user pages', async () => {
    const newLore = await createLore({
      title: 'User Page Lore',
      description: 'Lore for user pages',
      category: 'Fantasy',
      tags: ['user'],
      isPublic: true,
    });
    const newPage = await createPage({
      loreId: newLore.id,
      title: 'User Test Page',
      category: 'Characters',
      content: 'This is a user-created page.',
      tags: ['user'],
      relationships: [],
    });
    expect(await isUserPage(newPage.id)).toBe(true);
    expect(await isUserPage(seedPages[0].id)).toBe(false);
  });

  // Test Edited Seed Pages functions
  it('should edit a seed page', async () => {
    const seedPage = seedPages[0];
    await editSeedPage(seedPage.id, { content: 'Edited seed page content.' });
    const editedPage = await getPageWithEdits(seedPage.id);
    expect(editedPage?.content).toBe('Edited seed page content.');
  });

  it('should get page with edits', async () => {
    const seedPage = seedPages[1];
    await editSeedPage(seedPage.id, { title: 'Edited Seed Page Title' });
    const pageWithEdits = await getPageWithEdits(seedPage.id);
    expect(pageWithEdits?.title).toBe('Edited Seed Page Title');
  });

  it('should determine if a page can be edited', async () => {
    const seedPage = seedPages[0];
    expect(await canEditPage(seedPage.id)).toBe(true);
    const newLore = await createLore({
      title: 'Editable Lore',
      description: 'Lore for editable pages',
      category: 'Fantasy',
      tags: ['editable'],
      isPublic: true,
    });
    const newPage = await createPage({
      loreId: newLore.id,
      title: 'Editable Page',
      category: 'Characters',
      content: 'This page can be edited.',
      tags: ['editable'],
      relationships: [],
    });
    expect(await canEditPage(newPage.id)).toBe(true);
  });

  // Test Search functions
  it('should search for lores', async () => {
    await createLore({
      title: 'Searchable Lore',
      description: 'This lore is searchable.',
      category: 'Sci-Fi',
      tags: ['search'],
      isPublic: true,
    });
    const results = await searchLores('searchable');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Searchable Lore');
  });

  it('should search for pages', async () => {
    const newLore = await createLore({
      title: 'Searchable Page Lore',
      description: 'Lore for searchable pages',
      category: 'Fantasy',
      tags: ['search'],
      isPublic: true,
    });
    await createPage({
      loreId: newLore.id,
      title: 'Searchable Page',
      category: 'Locations',
      content: 'This page contains searchable content.',
      tags: ['search'],
      relationships: [],
    });
    const results = await searchPages('searchable content');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Searchable Page');
  });

  // Test Trending and Recent functions
  it('should get trending lores', async () => {
    const trendingLores = await getTrendingLores();
    expect(trendingLores).toEqual(expect.arrayContaining(seedLores.filter(l => l.trending)));
  });

  it('should get recent pages', async () => {
    const recentPages = await getRecentPages();
    expect(recentPages.length).toBeLessThanOrEqual(8);
    // Further checks can be added to ensure they are indeed recent based on updatedAt
  });
});
