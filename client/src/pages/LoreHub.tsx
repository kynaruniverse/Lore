// LORE — LoreHub Page
// Shows all pages within a specific Lore, with knowledge gap indicators

import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, FileText, Users, Eye, AlertCircle, ArrowRight, TrendingUp, Network } from "lucide-react";
import Layout from "@/components/Layout";
import { getLoreBySlug, getPagesByLore } from "@/lib/loreStore";
import { categoryIcons } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function LoreHub() {
  const [lore, setLore] = useState<Lore | undefined>(undefined);
  const [pages, setPages] = useState<LorePage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [incompletePages, setIncompletePages] = useState<LorePage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { loreSlug } = useParams<{ loreSlug: string }>();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedLore = await getLoreBySlug(loreSlug);
      setLore(fetchedLore);

      if (fetchedLore) {
        const fetchedPages = await getPagesByLore(fetchedLore.id);
        setPages(fetchedPages);
        setCategories(Array.from(new Set(fetchedPages.map((p) => p.category))));
        setIncompletePages(fetchedPages.filter((p) => p.completeness < 70));
      }
      setLoading(false);
    };
    fetchData();
  }, [loreSlug]);


  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!lore) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Lore not found.</p>
          <Link href="/">
            <button className="mt-4 text-primary text-sm hover:underline">← Back to Discovery</button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-enter">
        {/* Hero */}
        <div className="relative overflow-hidden h-48 lg:h-64">
          <img
            src={lore.heroImage}
            alt={lore.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />

          {/* Back button */}
          <div className="absolute top-4 left-4">
            <Link href="/">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            </Link>
          </div>

          {/* Lore info overlay */}
          <div className="absolute bottom-4 left-0 right-0 px-4 lg:px-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{categoryIcons[lore.category]}</span>
                  <span className="lore-tag">{lore.category}</span>
                  {lore.trending && (
                    <span className="lore-tag lore-tag-ember flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      Trending
                    </span>
                  )}
                </div>
                <h1
                  className="text-2xl lg:text-3xl font-bold text-foreground"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  {lore.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
              <Link href={`/lore/${lore.slug}/graph`}>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border text-muted-foreground rounded-lg text-sm font-medium hover:text-foreground hover:border-primary/40 transition-colors shrink-0">
                  <Network className="w-4 h-4" />
                  Graph
                </button>
              </Link>
              <Link href={`/lore/${lore.slug}/create-page`}>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-[oklch(0.68_0.20_42)] transition-colors ember-glow shrink-0">
                  <Plus className="w-4 h-4" />
                  Add Page
                </button>
              </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-6 space-y-8">
          {/* Description + stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="text-sm text-muted-foreground leading-relaxed">{lore.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {lore.tags.map((tag) => (
                  <span key={tag} className="lore-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              {[
                { icon: FileText, label: "Pages", value: lore.pageCount },
                { icon: Users, label: "Contributors", value: lore.contributorCount.toLocaleString() },
                { icon: Eye, label: "Views", value: `${(lore.views / 1000).toFixed(0)}k` },
              ].map((stat) => (
                <div key={stat.label} className="lore-card p-3 flex items-center gap-3">
                  <stat.icon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-base font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge gaps */}
          {incompletePages.length > 0 && (
            <div className="gap-highlight p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Knowledge Gaps</h3>
                <span className="lore-tag lore-tag-ember">{incompletePages.length} pages need attention</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                These pages are missing information. Help complete them to strengthen this Lore.
              </p>
              <div className="flex flex-wrap gap-2">
                {incompletePages.slice(0, 4).map((page) => (
                  <Link key={page.id} href={`/lore/${lore.slug}/${page.slug}`}>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded-md text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                      {page.title}
                      <span className="text-primary font-medium ml-1">{page.completeness}%</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pages by category */}
          {categories.map((category) => {
            const categoryPages = pages.filter((p) => p.category === category);
            return (
              <section key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <h2
                    className="text-base font-semibold text-foreground"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    {category}
                  </h2>
                  <span className="text-xs text-muted-foreground">({categoryPages.length})</span>
                  <div className="flex-1 relation-line ml-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryPages.map((page, i) => (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link href={`/lore/${lore.slug}/${page.slug}`}>
                        <div className="lore-card p-4 group">
                          <div className="flex items-start justify-between mb-2">
                            <h3
                              className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1"
                              style={{ fontFamily: "'Lora', Georgia, serif" }}
                            >
                              {page.title}
                            </h3>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{page.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1 flex-wrap">
                              {page.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="lore-tag">{tag}</span>
                              ))}
                            </div>
                            {/* Completeness ring */}
                            <CompletenessRing value={page.completeness} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

function CompletenessRing({ value }: { value: number }) {
  const r = 10;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value >= 80 ? "oklch(0.62 0.18 42)" : value >= 60 ? "oklch(0.72 0.12 75)" : "oklch(0.55 0.015 65)";

  return (
    <div className="relative w-7 h-7 shrink-0" title={`${value}% complete`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r={r} fill="none" stroke="oklch(0.28 0.012 45)" strokeWidth="2" />
        <circle
          cx="12"
          cy="12"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-medium text-muted-foreground">
        {value}
      </span>
    </div>
  );
}
