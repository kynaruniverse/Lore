// LORE — Home / Discovery Page
// Ember Archive: dark warm charcoal, burnt orange accents
// Hero with knowledge network background, trending lores, recent pages

import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock, Flame, Users, FileText } from "lucide-react";
import Layout from "@/components/Layout";
import { getAllLores, getRecentPages, getTrendingLores } from "@/lib/loreStore";
import { categoryIcons } from "@/lib/data";
import type { Lore } from "@/lib/data";
import { cn } from "@/lib/utils";
import LoreCard from "@/components/LoreCard";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663439820849/SE9XUZepF7G4m63nARXJEu/lore-hero-bg_f40508ff.jpg";

export default function Home() {
  const [recentPages, setRecentPages] = useState<LorePage[]>([]);
  const [trendingLores, setTrendingLores] = useState<Lore[]>([]);
  const [allLores, setAllLores] = useState<Lore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRecentPages(await getRecentPages(6));
      setTrendingLores(await getTrendingLores());
      setAllLores(await getAllLores());
      setLoading(false);
    };
    fetchData();
  }, []);


  return (
    <Layout>
      <div className="page-enter">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden min-h-[420px] lg:min-h-[500px] flex items-end">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 container pb-12 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <Flame className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-widest">
                  Community Knowledge
                </span>
              </div>
              <h1
                className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                Every story worth
                <br />
                <span className="text-primary ember-glow-text">remembering.</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
                Communities collaboratively document the things they love — games, shows, films,
                sports, and fictional worlds — in one connected knowledge graph.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/create">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-[oklch(0.68_0.20_42)] transition-colors ember-glow">
                    Start a Lore
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/search">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/40 transition-colors">
                    Explore Knowledge
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div className="border-b border-border bg-surface/50">
          <div className="container py-3">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
              {[
                { label: "Lores", value: "5", icon: Flame },
                { label: "Pages", value: "1,233+", icon: FileText },
                { label: "Contributors", value: "3,655+", icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 shrink-0">
                  <stat.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container py-8 space-y-12">
          {/* ── Trending Lores ── */}
          {loading ? (
            <div className="text-center text-muted-foreground">Loading trending lores...</div>
          ) : (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2
                    className="text-lg font-semibold text-foreground"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    Trending
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingLores.map((lore, i) => (
                  <LoreCard key={lore.id} lore={lore} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── All Lores ── */}
          {loading ? (
            <div className="text-center text-muted-foreground">Loading all lores...</div>
          ) : (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Flame className="w-4 h-4 text-primary" />
                <h2
                  className="text-lg font-semibold text-foreground"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  All Lores
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allLores.map((lore, i) => (
                  <LoreCard key={lore.id} lore={lore} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── Recently Updated Pages ── */}
          {loading ? (
            <div className="text-center text-muted-foreground">Loading recent pages...</div>
          ) : (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-primary" />
                <h2
                  className="text-lg font-semibold text-foreground"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  Recently Updated
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentPages.map((page, i) => {
                  const lore = allLores.find((l) => l.id === page.loreId);
                  return (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/lore/${page.loreId}/${page.slug}`}>
                        <div className="lore-card p-4 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 text-base">
                            {lore ? categoryIcons[lore.category] : "📄"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">{lore?.title}</span>
                              <span className="lore-tag">{page.category}</span>
                            </div>
                            <p className="text-sm font-medium text-foreground truncate">{page.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{page.excerpt}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}


