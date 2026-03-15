// Pre-filled editor for updating an existing knowledge page (seed or user-created)

import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3, Plus, X, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { getLoreBySlug, getPageBySlug, updatePage, deletePage, isUserPage, editSeedPage, canEditPage } from "@/lib/loreStore";
import type { RelationshipType } from "@/lib/data";

const PAGE_CATEGORIES = [
  "Character", "Location", "Event", "Item", "Organisation",
  "Concept", "Timeline", "Episode", "Season", "Driver",
  "Team", "Circuit", "Match", "Other",
];

const RELATIONSHIP_TYPES: RelationshipType[] = [
  "appears_in", "related_to", "happened_at", "ally_of",
  "enemy_of", "part_of", "located_in", "teammate_of",
];

export default function EditPage() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>();
  const [, navigate] = useLocation();
  const lore = getLoreBySlug(loreSlug);
  const page = lore ? getPageBySlug(lore.id, pageSlug) : undefined;

  const canEdit = page ? canEditPage(page.id) : false;

  const [title, setTitle] = useState(page?.title ?? "");
  const [category, setCategory] = useState(page?.category ?? "Character");
  const [content, setContent] = useState(page?.content ?? "");
  const [imageUrl, setImageUrl] = useState(page?.image ?? "");
  const [tags, setTags] = useState(page?.tags.join(", ") ?? "");
  const [relationships, setRelationships] = useState<
    Array<{ targetPageId: string; type: RelationshipType; label: string }>
  >(
    (page?.relationships ?? []).map((r) => ({
      targetPageId: r.targetPageId,
      type: r.type as RelationshipType,
      label: r.label ?? r.targetPageId,
    }))
  );
  const [newRelTitle, setNewRelTitle] = useState("");
  const [newRelType, setNewRelType] = useState<RelationshipType>("related_to");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!lore || !page) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Page not found.</p>
          <Link href="/">
            <button className="mt-4 text-primary text-sm hover:underline">← Back to Discovery</button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!canEdit) {
    return (
      <Layout>
        <div className="container py-16 text-center max-w-md mx-auto">
          <div className="lore-card p-8">
            <Edit3 className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Page Not Found
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This page does not exist.
            </p>
            <Link href={`/lore/${loreSlug}`}>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Back to Lore
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const addRelationship = () => {
    if (!newRelTitle.trim()) return;
    setRelationships([
      ...relationships,
      {
        targetPageId: `unresolved-${newRelTitle.trim().toLowerCase().replace(/\s+/g, "-")}`,
        type: newRelType,
        label: newRelTitle.trim(),
      },
    ]);
    setNewRelTitle("");
  };

  const removeRelationship = (i: number) => {
    setRelationships(relationships.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a page title.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const updates = {
        title: title.trim(),
        category,
        content: content.trim(),
        image: imageUrl.trim() || undefined,
        tags: parsedTags,
        relationships,
      };

      // Use editSeedPage for seed pages, updatePage for user-created pages
      if (isUserPage(page.id)) {
        updatePage(page.id, updates);
      } else {
        editSeedPage(page.id, updates);
      }

      toast.success("Page updated successfully!");
      setTimeout(() => navigate(`/lore/${loreSlug}/${pageSlug}`), 1000);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!isUserPage(page.id)) {
      toast.error("Cannot delete seed pages");
      return;
    }
    deletePage(page.id);
    toast.success(`"${page.title}" has been deleted.`);
    navigate(`/lore/${loreSlug}`);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Layout>
      <div className="page-enter">
        <div className="container py-6 max-w-2xl">
          {/* Back */}
          <Link href={`/lore/${loreSlug}/${pageSlug}`}>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {page.title}
            </button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    Edit Page
                  </h1>
                  <p className="text-xs text-muted-foreground">in {lore.title}</p>
                </div>
              </div>
              {/* Delete button - only for user-created pages */}
              {isUserPage(page.id) && (
                !showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Are you sure?</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1.5 text-xs bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Page title…"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {PAGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-muted-foreground">Content</label>
                  <span className="text-xs text-muted-foreground">{wordCount} words</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing… Use ## for headings, **bold** for emphasis."
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono text-sm resize-none"
                  rows={12}
                />
                <p className="text-xs text-muted-foreground mt-2">Supports Markdown: ## Heading, **bold**, *italic*, &gt; blockquote</p>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Image URL (optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or any public image URL"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Paste a URL from Unsplash, Pexels, Wikimedia, or any public image source.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Protagonist, Chemistry, Albuquerque"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Relationships */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Relationships (link to existing pages)
                </label>
                <div className="space-y-2 mb-3">
                  {relationships.map((rel, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-surface border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">{rel.label}</p>
                        <p className="text-xs text-muted-foreground">{rel.type}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRelationship(i)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRelTitle}
                    onChange={(e) => setNewRelTitle(e.target.value)}
                    placeholder="Page title…"
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  />
                  <select
                    value={newRelType}
                    onChange={(e) => setNewRelType(e.target.value as RelationshipType)}
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  >
                    {RELATIONSHIP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addRelationship}
                    className="px-3 py-2 bg-primary/15 text-primary rounded-lg hover:bg-primary/25 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
