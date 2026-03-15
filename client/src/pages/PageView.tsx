// LORE — PageView Page
// Individual knowledge page with content, relationships, knowledge gaps

import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, ExternalLink, Eye, Calendar, Tag, Edit3 } from "lucide-react";
import Layout from "@/components/Layout";
import { getLoreBySlug, getPageBySlug, getRelatedPages, isUserPage } from "@/lib/loreStore";
import { relationshipLabels } from "@/lib/data";
import KnowledgeGraph from "@/components/KnowledgeGraph";

export default function PageView() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>();
  const lore = getLoreBySlug(loreSlug);
  const page = lore ? getPageBySlug(lore.id, pageSlug) : undefined;
  const relatedPages = page ? getRelatedPages(page) : [];
  const canEdit = page ? isUserPage(page.id) : false;

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

  const paragraphs = page.content.split("\n\n");

  return (
    <Layout>
      <div className="page-enter">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface/30">
          <div className="container py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/">
                <span className="hover:text-foreground transition-colors cursor-pointer">Discover</span>
              </Link>
              <span>/</span>
              <Link href={`/lore/${lore.slug}`}>
                <span className="hover:text-foreground transition-colors cursor-pointer">{lore.title}</span>
              </Link>
              <span>/</span>
              <span className="text-foreground">{page.title}</span>
            </div>
          </div>
        </div>

        <div className="container py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 max-w-5xl">
            {/* Main content */}
            <div>
              {/* Back + Edit */}
              <div className="flex items-center justify-between mb-6">
                <Link href={`/lore/${lore.slug}`}>
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {lore.title}
                  </button>
                </Link>
                {canEdit && (
                  <Link href={`/lore/${loreSlug}/${pageSlug}/edit`}>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </Link>
                )}
              </div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="lore-tag lore-tag-ember">{page.category}</span>
                  {page.tags.map((tag) => (
                    <span key={tag} className="lore-tag">{tag}</span>
                  ))}
                </div>

                <h1
                  className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  {page.title}
                </h1>

                <p className="text-base text-muted-foreground leading-relaxed mb-6 border-l-2 border-primary/40 pl-4">
                  {page.excerpt}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-8 pb-6 border-b border-border">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {page.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Updated {page.updatedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {lore.title}
                  </span>
                </div>

                {/* Page image */}
                {page.image && (
                  <div className="mb-8 rounded-xl overflow-hidden border border-border">
                    <img src={page.image} alt={page.title} className="w-full h-48 lg:h-64 object-cover" />
                  </div>
                )}

                {/* Content */}
                <div className="lore-prose">
                  {paragraphs.map((para, i) => {
                    if (para.startsWith("## ")) {
                      return (
                        <h2 key={i} style={{ fontFamily: "'Lora', Georgia, serif" }}>
                          {para.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (para.startsWith("# ")) {
                      return (
                        <h1 key={i} style={{ fontFamily: "'Lora', Georgia, serif" }}>
                          {para.replace("# ", "")}
                        </h1>
                      );
                    }
                    if (para.startsWith("### ")) {
                      return (
                        <h3 key={i} style={{ fontFamily: "'Lora', Georgia, serif" }}>
                          {para.replace("### ", "")}
                        </h3>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })}
                </div>

                {/* Knowledge gaps */}
                {page.missingFields.length > 0 && (
                  <div className="mt-8 gap-highlight p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Knowledge Gaps</h3>
                      <span className="lore-tag lore-tag-ember">{page.completeness}% complete</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      This page is missing the following information:
                    </p>
                    <ul className="space-y-1">
                      {page.missingFields.map((field) => (
                        <li key={field} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar — Relationships */}
            <div className="space-y-6">
              {/* Completeness */}
              <div className="lore-card p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Completeness
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${page.completeness}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{page.completeness}%</span>
                </div>
                {page.completeness < 80 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {page.missingFields.length} fields need attention
                  </p>
                )}
              </div>

              {/* Relationships */}
              {relatedPages.length > 0 && (
                <div className="lore-card p-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Relationships
                  </h3>
                  <div className="space-y-2">
                    {page.relationships.map((rel, i) => {
                      const target = relatedPages.find((p) => p.id === rel.targetPageId);
                      if (!target) return null;
                      const targetLore = target.loreId;
                      return (
                        <Link key={i} href={`/lore/${targetLore}/${target.slug}`}>
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors group">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ember-pulse" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                {target.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {rel.label || relationshipLabels[rel.type]}
                              </p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Knowledge Graph */}
              {relatedPages.length > 0 && (
                <div className="lore-card p-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Knowledge Graph
                  </h3>
                  <KnowledgeGraph
                    centerPage={page}
                    relatedPages={relatedPages}
                    loreSlug={lore.slug}
                  />
                </div>
              )}

              {/* Back to Lore */}
              <div className="lore-card p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Part of
                </h3>
                <Link href={`/lore/${lore.slug}`}>
                  <div className="flex items-center gap-3 group">
                    <img
                      src={lore.coverImage}
                      alt={lore.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {lore.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{lore.pageCount} pages</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
