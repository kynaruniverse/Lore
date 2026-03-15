// LORE — Edit Page
// Pre-filled editor for updating an existing knowledge page

import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3, Plus, X, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { getLoreBySlug, getPageBySlug, updatePage, deletePage, isUserPage } from "@/lib/loreStore";
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

  const canEdit = page ? isUserPage(page.id) : false;

  const [title, setTitle] = useState(page?.title ?? "");
  const [category, setCategory] = useState(page?.category ?? "Character");
  const [content, setContent] = useState(page?.content ?? "");
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
              Seed Pages Are Read-Only
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This page is part of the original Lore seed data and cannot be edited. Only pages you create can be modified.
            </p>
            <Link href={`/lore/${loreSlug}/${pageSlug}`}>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Back to Page
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

      updatePage(page.id, {
        title: title.trim(),
        category,
        content: content.trim(),
        tags: parsedTags,
        relationships,
      });

      toast.success("Page updated successfully!");
      setTimeout(() => navigate(`/lore/${loreSlug}/${pageSlug}`), 1000);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
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
              {/* Delete button */}
              {!showDeleteConfirm ? (
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
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Update the content and relationships for this page.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {PAGE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        category === cat
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Content
                  </label>
                  <span className="text-xs text-muted-foreground">{wordCount} words</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none leading-relaxed"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Supports Markdown: ## Heading, **bold**, *italic*, &gt; blockquote
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tags <span className="text-muted-foreground font-normal normal-case">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Relationships */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Relationships
                </label>
                {relationships.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {relationships.map((rel, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary"
                      >
                        <span>{rel.label}</span>
                        <span className="text-primary/60">·</span>
                        <span className="text-primary/70">{rel.type.replace(/_/g, " ")}</span>
                        <button type="button" onClick={() => removeRelationship(i)} className="ml-1 hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRelTitle}
                    onChange={(e) => setNewRelTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRelationship())}
                    placeholder="Page title…"
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                  />
                  <select
                    value={newRelType}
                    onChange={(e) => setNewRelType(e.target.value as RelationshipType)}
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all"
                  >
                    {RELATIONSHIP_TYPES.map((t) => (
                      <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addRelationship}
                    className="p-2 bg-surface border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity ember-glow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving…" : "Save Changes"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
