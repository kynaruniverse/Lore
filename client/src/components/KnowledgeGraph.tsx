// LORE — Knowledge Graph Component
// Interactive SVG canvas showing page relationships as glowing nodes and edges
// Ember Archive: amber/orange nodes on dark background

import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import type { LorePage } from "@/lib/data";
import { relationshipLabels } from "@/lib/data";

interface Node {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isCenter: boolean;
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

interface KnowledgeGraphProps {
  centerPage: LorePage;
  relatedPages: LorePage[];
  loreSlug: string;
}

const NODE_COLORS = {
  Character: "oklch(0.62 0.18 42)",
  Location: "oklch(0.55 0.12 180)",
  Event: "oklch(0.60 0.15 280)",
  Team: "oklch(0.58 0.14 140)",
  Driver: "oklch(0.65 0.16 60)",
  Circuit: "oklch(0.52 0.12 200)",
  default: "oklch(0.72 0.12 75)",
};

function getNodeColor(category: string): string {
  return NODE_COLORS[category as keyof typeof NODE_COLORS] || NODE_COLORS.default;
}

export default function KnowledgeGraph({ centerPage, relatedPages, loreSlug }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 340 });
  const animFrameRef = useRef<number>(0);

  // Build graph
  useEffect(() => {
    const w = svgRef.current?.clientWidth || 600;
    const h = 340;
    setDimensions({ width: w, height: h });

    const cx = w / 2;
    const cy = h / 2;

    const newNodes: Node[] = [
      {
        id: centerPage.id,
        title: centerPage.title,
        category: centerPage.category,
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        radius: 28,
        isCenter: true,
      },
    ];

    const angleStep = (2 * Math.PI) / Math.max(relatedPages.length, 1);
    const orbitRadius = Math.min(w, h) * 0.32;

    relatedPages.forEach((page, i) => {
      const angle = i * angleStep - Math.PI / 2;
      newNodes.push({
        id: page.id,
        title: page.title,
        category: page.category,
        x: cx + Math.cos(angle) * orbitRadius,
        y: cy + Math.sin(angle) * orbitRadius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 18,
        isCenter: false,
      });
    });

    const newEdges: Edge[] = centerPage.relationships.map((rel) => ({
      source: centerPage.id,
      target: rel.targetPageId,
      label: rel.label || relationshipLabels[rel.type],
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [centerPage, relatedPages]);

  // Gentle float animation
  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.isCenter) return node;
          const { width: w, height: h } = dimensions;
          let { x, y, vx, vy } = node;

          // Gentle drift
          vx += (Math.random() - 0.5) * 0.05;
          vy += (Math.random() - 0.5) * 0.05;

          // Dampen
          vx *= 0.98;
          vy *= 0.98;

          // Clamp velocity
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > 0.8) { vx = (vx / speed) * 0.8; vy = (vy / speed) * 0.8; }

          x += vx;
          y += vy;

          // Boundary bounce
          const margin = node.radius + 10;
          if (x < margin) { x = margin; vx = Math.abs(vx); }
          if (x > w - margin) { x = w - margin; vx = -Math.abs(vx); }
          if (y < margin) { y = margin; vy = Math.abs(vy); }
          if (y > h - margin) { y = h - margin; vy = -Math.abs(vy); }

          return { ...node, x, y, vx, vy };
        })
      );
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [nodes.length, dimensions]);

  const getNode = useCallback((id: string) => nodes.find((n) => n.id === id), [nodes]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-[oklch(0.10_0.010_45)]">
      <svg
        ref={svgRef}
        width="100%"
        height="340"
        className="w-full"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="ember-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="center-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Radial gradient for center node */}
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.72 0.20 42)" />
            <stop offset="100%" stopColor="oklch(0.55 0.18 42)" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const source = getNode(edge.source);
          const target = getNode(edge.target);
          if (!source || !target) return null;

          const mx = (source.x + target.x) / 2;
          const my = (source.y + target.y) / 2;
          const isHovered = hoveredNode === edge.source || hoveredNode === edge.target;

          return (
            <g key={i}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isHovered ? "oklch(0.62 0.18 42)" : "oklch(0.35 0.05 45)"}
                strokeWidth={isHovered ? 1.5 : 1}
                strokeOpacity={isHovered ? 0.8 : 0.4}
                strokeDasharray={isHovered ? "none" : "4 4"}
              />
              {isHovered && (
                <text
                  x={mx}
                  y={my - 4}
                  textAnchor="middle"
                  fill="oklch(0.72 0.12 75)"
                  fontSize="9"
                  opacity={0.9}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const color = getNodeColor(node.category);
          const isHovered = hoveredNode === node.id;
          const isCenter = node.isCenter;
          const relatedPage = relatedPages.find((p) => p.id === node.id);
          const slug = relatedPage?.slug || centerPage.slug;

          return (
            <Link key={node.id} href={`/lore/${loreSlug}/${slug}`}>
              <g
                transform={`translate(${node.x},${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Glow ring */}
                {(isHovered || isCenter) && (
                  <circle
                    r={node.radius + (isCenter ? 10 : 6)}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    filter={isCenter ? "url(#center-glow)" : "url(#ember-glow)"}
                  />
                )}

                {/* Main circle */}
                <circle
                  r={node.radius}
                  fill={isCenter ? "url(#center-grad)" : color}
                  fillOpacity={isCenter ? 1 : isHovered ? 0.9 : 0.7}
                  filter={isCenter ? "url(#center-glow)" : isHovered ? "url(#ember-glow)" : "none"}
                />

                {/* Label */}
                <text
                  y={node.radius + 14}
                  textAnchor="middle"
                  fill="oklch(0.85 0.01 65)"
                  fontSize={isCenter ? "11" : "9"}
                  fontWeight={isCenter ? "600" : "400"}
                  opacity={isHovered || isCenter ? 1 : 0.7}
                >
                  {node.title.length > 14 ? node.title.slice(0, 13) + "…" : node.title}
                </text>

                {/* Category label inside node */}
                <text
                  textAnchor="middle"
                  fill="oklch(0.95 0.01 65)"
                  fontSize={isCenter ? "8" : "7"}
                  opacity={0.8}
                  dy="0.35em"
                >
                  {node.category.slice(0, 4)}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 right-3 flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground">Click nodes to explore</span>
      </div>
    </div>
  );
}
