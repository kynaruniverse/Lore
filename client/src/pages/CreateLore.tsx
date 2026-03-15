// LORE — Create Lore Page
// Form for starting a new community knowledge space

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Globe, Lock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { createLore } from "@/lib/loreStore";
import type { Lore } from "@/lib/data";

const CATEGORIES: { id: Lore["category"]; label: string; icon: string }[] = [
  { id: "tv", label: "TV Show", icon: "📺" },
  { id: "game", label: "Game", icon: "🎮" },
  { id: "film", label: "Film", icon: "🎬" },
  { id: "sports", label: "Sports", icon: "🏆" },
  { id: "book", label: "Book / Series", icon: "📖" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "history", label: "History", icon: "🏛️" },
];

export default function CreateLore() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Lore["category"] | "">("");
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title for your Lore.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const newLore = createLore({
        title: title.trim(),
        description: description.trim(),
        category: category as Lore["category"],
        tags: parsedTags,
        isPublic,
      });

      toast.success(`"${newLore.title}" Lore created!`, {
        description: "Your knowledge space is ready. Start adding pages!",
      });
      setTimeout(() => navigate(`/lore/${newLore.slug}`), 1200);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-enter">
        <div className="container py-6 max-w-2xl">
          {/* Back */}
          <Link href="/">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Discovery
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
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <h1
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                Start a Lore
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Create a knowledge space for any topic worth documenting.
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
                  placeholder="e.g. The Wire, Dark Souls, FC Barcelona…"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                        category === cat.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this Lore about? What knowledge will it contain?"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                />
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
                  placeholder="e.g. HBO, Fantasy, Drama"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, icon: Globe, label: "Public", desc: "Anyone can view and contribute" },
                    { value: false, icon: Lock, label: "Private", desc: "Invite-only contributors" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setIsPublic(opt.value)}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                        isPublic === opt.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface hover:border-primary/40"
                      }`}
                    >
                      <opt.icon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${isPublic === opt.value ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className={`text-sm font-medium ${isPublic === opt.value ? "text-primary" : "text-foreground"}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity ember-glow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating…" : "Create Lore"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
