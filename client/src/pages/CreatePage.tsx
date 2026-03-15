// LORE — Create Page
// Mobile-first editor for adding a new knowledge page to a Lore

import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Plus, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { getLoreBySlug, createPage, getPagesByLore } from "@/lib/loreStore";
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

export default function CreatePage() {
  const { loreSlug } = useParams<{ loreSlug: string }>();
  const [, navigate] = useLocation();
  const lore = getLoreBySlug(loreSlug);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Character");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [relationships, setRelationships] = useState<Array<{ targetPageId: string; type: RelationshipType; label: string }>>([]);
  const [newRelTitle, setNewRelTitle] = useState("");
  const [newRelType, setNewRelType] = useState<RelationshipType>("related_to");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!lore) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Lore not found.</p>
          <Link href="/">
            <button className="mt-4 text-primary text-sm hover:underline">← Back</button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Get existing pages in this lore to resolve relationships by title
  const existingPages = getPagesByLore(lore.id);

  const addRelationship = () => {
    if (!newRelTitle.trim()) return;
    // Try to find matching page by title (case-insensitive)
    const match = existingPages.find(
      (p) => p.title.toLowerCase() === newRelTitle.trim().toLowerCase()
    );
    const targetPageId = match?.id ?? `unresolved-${newRelTitle.trim().toLowerCase().replace(/\s+/g, "-")}`;
    setRelationships([
      ...relationships,
      { targetPageId, type: newRelType, label: newRelTitle.trim() },
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

      const newPage = createPage({
        loreId: lore.id,
        title: title.trim(),
        category,
        content: content.trim(),
        image: imageUrl.trim() || undefined,
        tags: parsedTags,
        relationships,
      });

      toast.success(`"${newPage.title}" page created!`, {
        description: "Your page has been added to the Lore.",
      });
      setTimeout(() => navigate(`/lore/${loreSlug}/${newPage.slug}`), 1200);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Layout>
      <div className="page-enter">
        <div className="container py-6 max-w-2xl">
          {/* Back */}
          <Link href={`/lore/${loreSlug}`}>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" />
              {lore.title}
            </button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  Add a Page
                </h1>
                <p className="text-xs text-muted-foreground">to {lore.title}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Every page is an atomic unit of knowledge. Start with a title — you can always add more later.
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
                  placeholder="e.g. Walter White, Winterfell, The Battle of Blackwater…"
                  autoFocus
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
                  placeholder="Start writing… Use ## for headings, **bold** for emphasis. You can always add more later."
                  rows={8}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none leading-relaxed"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Supports Markdown: ## Heading, **bold**, *italic*, &gt; blockquote
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Image URL <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or any public image URL"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Paste a URL from Unsplash, Pexels, Wikimedia, or any public image source.
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
                  placeholder="e.g. Protagonist, Chemistry, Albuquerque"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Relationships */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Relationships
                  <span className="text-muted-foreground font-normal normal-case ml-1">(link to existing pages)</span>
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
                {/* Autocomplete hint */}
                {existingPages.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Existing pages: {existingPages.slice(0, 5).map((p) => p.title).join(", ")}
                    {existingPages.length > 5 && ` +${existingPages.length - 5} more`}
                  </p>
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
                {isSubmitting ? "Creating…" : "Create Page"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
