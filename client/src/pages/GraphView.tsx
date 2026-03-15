// LORE — GraphView Page
// Full-screen knowledge graph for an entire Lore

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import Layout from "@/components/Layout";
import { getLoreBySlug, getPagesByLore, getPageById } from "@/lib/data";
import type { LorePage } from "@/lib/data";

interface GraphNode {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Character: "oklch(0.62 0.18 42)",
  Location: "oklch(0.55 0.12 180)",
  Event: "oklch(0.60 0.15 280)",
  Team: "oklch(0.58 0.14 140)",
  Driver: "oklch(0.65 0.16 60)",
  Circuit: "oklch(0.52 0.12 200)",
  Organisation: "oklch(0.60 0.12 320)",
  default: "oklch(0.72 0.12 75)",
};

export default function GraphView() {
  const { loreSlug } = useParams<{ loreSlug: string }>();
  const lore = getLoreBySlug(loreSlug);
  const lorePagesData = lore ? getPagesByLore(lore.id) : [];
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const [zoom, setZoom] = useState(1);

  const W = 900;
  const H = 600;

  // Build initial positions
  useEffect(() => {
    if (!lorePagesData.length) return;
    const cx = W / 2;
    const cy = H / 2;
    const count = lorePagesData.length;
    const initialNodes: GraphNode[] = lorePagesData.map((page, i) => {
      const angle = (i / count) * 2 * Math.PI;
      const r = Math.min(W, H) * 0.35;
      return {
        id: page.id,
        title: page.title,
        category: page.category,
        x: cx + Math.cos(angle) * r * (0.6 + Math.random() * 0.4),
        y: cy + Math.sin(angle) * r * (0.6 + Math.random() * 0.4),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 16,
      };
    });
    setNodes(initialNodes);
  }, [lorePagesData.length]);

  // Force-directed layout simulation
  useEffect(() => {
    if (!nodes.length) return;
    const animate = () => {
      setNodes((prev) => {
        const next = prev.map((n) => ({ ...n }));

        // Repulsion between all nodes
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[j].x - next[i].x;
            const dy = next[j].y - next[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 800 / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            next[i].vx -= fx;
            next[i].vy -= fy;
            next[j].vx += fx;
            next[j].vy += fy;
          }
        }

        // Attraction to center
        for (const n of next) {
          n.vx += (W / 2 - n.x) * 0.001;
          n.vy += (H / 2 - n.y) * 0.001;
        }

        // Apply + dampen + clamp
        for (const n of next) {
          n.vx *= 0.9;
          n.vy *= 0.9;
          const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
          if (speed > 2) { n.vx = (n.vx / speed) * 2; n.vy = (n.vy / speed) * 2; }
          n.x += n.vx;
          n.y += n.vy;
          const m = n.radius + 8;
          if (n.x < m) { n.x = m; n.vx = Math.abs(n.vx); }
          if (n.x > W - m) { n.x = W - m; n.vx = -Math.abs(n.vx); }
          if (n.y < m) { n.y = m; n.vy = Math.abs(n.vy); }
          if (n.y > H - m) { n.y = H - m; n.vy = -Math.abs(n.vy); }
        }
        return next;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [nodes.length]);

  const getNode = useCallback((id: string) => nodes.find((n) => n.id === id), [nodes]);

  if (!lore) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Lore not found.</p>
          <Link href="/"><button className="mt-4 text-primary text-sm hover:underline">← Back</button></Link>
        </div>
      </Layout>
    );
  }

  // Build edges
  const edges: Array<{ source: string; target: string; label: string }> = [];
  for (const page of lorePagesData) {
    for (const rel of page.relationships) {
      edges.push({ source: page.id, target: rel.targetPageId, label: rel.label || rel.type });
    }
  }

  const categories = Array.from(new Set(lorePagesData.map((p) => p.category)));

  return (
    <Layout>
      <div className="page-enter">
        {/* Header */}
        <div className="border-b border-border bg-surface/30">
          <div className="container py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/lore/${loreSlug}`}>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {lore.title}
                </button>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-xs text-foreground font-medium">Knowledge Graph</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="container py-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: CATEGORY_COLORS[cat] || CATEGORY_COLORS.default }}
                />
                <span className="text-xs text-muted-foreground">{cat}</span>
              </div>
            ))}
          </div>

          {/* Graph canvas */}
          <div
            className="rounded-xl overflow-hidden border border-border bg-[oklch(0.10_0.010_45)]"
            style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.2s" }}
            >
              <defs>
                <filter id="glow-full">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Edges */}
              {edges.map((edge, i) => {
                const s = getNode(edge.source);
                const t = getNode(edge.target);
                if (!s || !t) return null;
                const isHov = hoveredNode === edge.source || hoveredNode === edge.target;
                return (
                  <line
                    key={i}
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={isHov ? "oklch(0.62 0.18 42)" : "oklch(0.35 0.05 45)"}
                    strokeWidth={isHov ? 1.5 : 0.8}
                    strokeOpacity={isHov ? 0.9 : 0.4}
                    strokeDasharray={isHov ? "none" : "3 5"}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.default;
                const isHov = hoveredNode === node.id;
                const page = lorePagesData.find((p) => p.id === node.id);
                return (
                  <Link key={node.id} href={`/lore/${loreSlug}/${page?.slug || ""}`}>
                    <g
                      transform={`translate(${node.x},${node.y})`}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {isHov && (
                        <circle r={node.radius + 8} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" filter="url(#glow-full)" />
                      )}
                      <circle r={node.radius} fill={color} fillOpacity={isHov ? 1 : 0.75} filter={isHov ? "url(#glow-full)" : "none"} />
                      <text y={node.radius + 12} textAnchor="middle" fill="oklch(0.85 0.01 65)" fontSize="9" opacity={isHov ? 1 : 0.7}>
                        {node.title.length > 16 ? node.title.slice(0, 15) + "…" : node.title}
                      </text>
                    </g>
                  </Link>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {lorePagesData.length} pages · {edges.length} relationships · Click any node to view its page
          </p>
        </div>
      </div>
    </Layout>
  );
}
