// LORE — Search Page
// Full-text search across lores and pages

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Flame, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { searchPages, searchLores, lores, categoryIcons } from "@/lib/data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const pageResults = debouncedQuery.length > 1 ? searchPages(debouncedQuery) : [];
  const loreResults = debouncedQuery.length > 1 ? searchLores(debouncedQuery) : [];
  const hasResults = pageResults.length > 0 || loreResults.length > 0;

  return (
    <Layout>
      <div className="page-enter">
        {/* Search header */}
        <div className="border-b border-border bg-surface/30 sticky top-14 lg:top-0 z-30">
          <div className="container py-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, lores, characters, locations…"
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="container py-6 max-w-3xl">
          {/* Empty state */}
          {!debouncedQuery && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h2
                className="text-lg font-semibold text-foreground mb-2"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                Search the Archive
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Find characters, locations, events, and knowledge across all Lores.
              </p>

              {/* Quick links */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                {lores.map((lore) => (
                  <Link key={lore.id} href={`/lore/${lore.slug}`}>
                    <div className="lore-card p-3 flex items-center gap-2 text-left">
                      <span className="text-lg">{categoryIcons[lore.category]}</span>
                      <span className="text-xs font-medium text-foreground truncate">{lore.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {debouncedQuery && !hasResults && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm">
                No results found for <span className="text-foreground font-medium">"{debouncedQuery}"</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term or browse a Lore directly.</p>
            </div>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {hasResults && (
              <motion.div
                key={debouncedQuery}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Lore results */}
                {loreResults.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Lores ({loreResults.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {loreResults.map((lore) => (
                        <Link key={lore.id} href={`/lore/${lore.slug}`}>
                          <div className="lore-card p-4 flex items-center gap-3 group">
                            <img
                              src={lore.coverImage}
                              alt={lore.title}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {lore.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{lore.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Page results */}
                {pageResults.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Pages ({pageResults.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {pageResults.map((page) => {
                        const lore = lores.find((l) => l.id === page.loreId);
                        return (
                          <Link key={page.id} href={`/lore/${page.loreId}/${page.slug}`}>
                            <div className="lore-card p-4 flex items-start gap-3 group">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 text-sm mt-0.5">
                                {lore ? categoryIcons[lore.category] : "📄"}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs text-muted-foreground">{lore?.title}</span>
                                  <span className="lore-tag">{page.category}</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {page.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{page.excerpt}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
