import { describe, it, expect } from 'vitest';
import { lores, pages, categoryIcons, relationshipLabels } from './data';

describe('data.ts', () => {
  it('should have a non-empty lores array', () => {
    expect(lores).toBeDefined();
    expect(lores.length).toBeGreaterThan(0);
  });

  it('should have a non-empty pages array', () => {
    expect(pages).toBeDefined();
    expect(pages.length).toBeGreaterThan(0);
  });

  it('all lores should have valid properties', () => {
    lores.forEach(lore => {
      expect(lore).toHaveProperty('id');
      expect(lore).toHaveProperty('title');
      expect(lore).toHaveProperty('slug');
      expect(lore).toHaveProperty('description');
      expect(lore).toHaveProperty('category');
      expect(lore).toHaveProperty('coverImage');
      expect(lore).toHaveProperty('heroImage');
      expect(lore).toHaveProperty('color');
      expect(lore).toHaveProperty('pageCount');
      expect(lore).toHaveProperty('contributorCount');
      expect(lore).toHaveProperty('isPublic');
      expect(lore).toHaveProperty('tags');
      expect(lore).toHaveProperty('createdAt');
      expect(lore).toHaveProperty('updatedAt');
      expect(lore).toHaveProperty('views');
      expect(lore).toHaveProperty('trending');

      expect(typeof lore.id).toBe('string');
      expect(typeof lore.title).toBe('string');
      expect(typeof lore.slug).toBe('string');
      expect(typeof lore.description).toBe('string');
      expect(typeof lore.category).toBe('string');
      expect(typeof lore.coverImage).toBe('string');
      expect(typeof lore.heroImage).toBe('string');
      expect(typeof lore.color).toBe('string');
      expect(typeof lore.pageCount).toBe('number');
      expect(typeof lore.contributorCount).toBe('number');
      expect(typeof lore.isPublic).toBe('boolean');
      expect(Array.isArray(lore.tags)).toBe(true);
      expect(typeof lore.createdAt).toBe('string');
      expect(typeof lore.updatedAt).toBe('string');
      expect(typeof lore.views).toBe('number');
      expect(typeof lore.trending).toBe('boolean');
    });
  });

  it('all pages should have valid properties', () => {
    pages.forEach(page => {
      expect(page).toHaveProperty('id');
      expect(page).toHaveProperty('loreId');
      expect(page).toHaveProperty('title');
      expect(page).toHaveProperty('slug');
      expect(page).toHaveProperty('category');
      expect(page).toHaveProperty('content');
      expect(page).toHaveProperty('excerpt');
      expect(page).toHaveProperty('relationships');
      expect(page).toHaveProperty('tags');
      expect(page).toHaveProperty('completeness');
      expect(page).toHaveProperty('missingFields');
      expect(page).toHaveProperty('createdAt');
      expect(page).toHaveProperty('updatedAt');
      expect(page).toHaveProperty('views');

      expect(typeof page.id).toBe('string');
      expect(typeof page.loreId).toBe('string');
      expect(typeof page.title).toBe('string');
      expect(typeof page.slug).toBe('string');
      expect(typeof page.category).toBe('string');
      expect(typeof page.content).toBe('string');
      expect(typeof page.excerpt).toBe('string');
      expect(Array.isArray(page.relationships)).toBe(true);
      expect(Array.isArray(page.tags)).toBe(true);
      expect(typeof page.completeness).toBe('number');
      expect(Array.isArray(page.missingFields)).toBe(true);
      expect(typeof page.createdAt).toBe('string');
      expect(typeof page.updatedAt).toBe('string');
      expect(typeof page.views).toBe('number');
    });
  });

  it('categoryIcons should have entries for all lore categories', () => {
    lores.forEach(lore => {
      expect(categoryIcons).toHaveProperty(lore.category);
      expect(typeof categoryIcons[lore.category]).toBe('string');
    });
  });

  it('relationshipLabels should have entries for all relationship types', () => {
    const allRelationshipTypes = Array.from(new Set(pages.flatMap(page => page.relationships.map(rel => rel.type))));
    allRelationshipTypes.forEach(type => {
      expect(relationshipLabels).toHaveProperty(type);
      expect(typeof relationshipLabels[type]).toBe('string');
    });
  });
});
