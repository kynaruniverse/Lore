import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { categoryConfig } from '../lib/contentConfig'
import type { PageCategory } from '../lib/contentConfig'

// ── Types ─────────────────────────────────────────────────────────────────────
interface GraphNode {
  id: string; title: string; category: string; slug: string
  x: number; y: number; vx: number; vy: number; radius: number
}
interface GraphEdge { source: string; target: string; type: string; label: string | null }
interface LoreMeta  { id: string; slug: string; title: string }

// ── Canvas constants ──────────────────────────────────────────────────────────
const CANVAS_W = 800
const CANVAS_H = 600
const CENTER_X = CANVAS_W / 2
const CENTER_Y = CANVAS_H / 2

// ── Derive colors from categoryConfig (single source of truth) ────────────────
function getCategoryHex(category: string): string {
  return categoryConfig[category as PageCategory]?.hex ?? '#606060'
}

// ── Force simulation ──────────────────────────────────────────────────────────
function tick(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
  const next = nodes.map(n => ({ ...n }))

  for (let i = 0; i < next.length; i++) {
    for (let j = i + 1; j < next.length; j++) {
      const dx = next[j].x - next[i].x, dy = next[j].y - next[i].y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const f = 6000 / (dist * dist)
      const fx = (dx / dist) * f, fy = (dy / dist) * f
      next[i].vx -= fx; next[i].vy -= fy
      next[j].vx += fx; next[j].vy += fy
    }
  }

  for (const edge of edges) {
    const s = next.find(n => n.id === edge.source)
    const t = next.find(n => n.id === edge.target)
    if (!s || !t) continue
    const dx = t.x - s.x, dy = t.y - s.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const f = (dist - 150) * 0.005
    const fx = (dx / dist) * f, fy = (dy / dist) * f
    s.vx += fx; s.vy += fy; t.vx -= fx; t.vy -= fy
  }

  for (const n of next) {
    n.vx += (CENTER_X - n.x) * 0.004
    n.vy += (CENTER_Y - n.y) * 0.004
    n.vx *= 0.92; n.vy *= 0.92
    n.x = Math.max(40, Math.min(CANVAS_W - 40, n.x + n.vx))
    n.y = Math.max(40, Math.min(CANVAS_H - 40, n.y + n.vy))
  }
  return next
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function drawGraph(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[], edges: GraphEdge[],
  hoveredId: string | null, zoom: number,
) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
  ctx.save()
  ctx.translate(CENTER_X, CENTER_Y)
  ctx.scale(zoom, zoom)
  ctx.translate(-CENTER_X, -CENTER_Y)

  for (const edge of edges) {
    const s = nodes.find(n => n.id === edge.source)
    const t = nodes.find(n => n.id === edge.target)
    if (!s || !t) continue
    const hot = hoveredId === s.id || hoveredId === t.id
    ctx.strokeStyle = hot ? '#C4A962' : '#2E2E2E'
    ctx.globalAlpha = hot ? 0.9 : 0.4
    ctx.lineWidth   = 1.5
    ctx.setLineDash(hot ? [] : [4, 4])
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(t.x, t.y); ctx.stroke()
  }
  ctx.setLineDash([]); ctx.globalAlpha = 1

  for (const node of nodes) {
    const color = getCategoryHex(node.category)
    const hot   = hoveredId === node.id
    const r     = hot ? node.radius + 3 : node.radius

    if (hot) { ctx.shadowColor = color; ctx.shadowBlur = 18 }
    ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    ctx.fillStyle   = color
    ctx.globalAlpha = hot ? 1 : 0.8
    ctx.fill()
    ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2; ctx.stroke()
    ctx.shadowBlur  = 0; ctx.globalAlpha = 1

    const label = node.title.length > 16 ? node.title.slice(0, 13) + '…' : node.title
    ctx.font      = hot ? 'bold 11px Inter,sans-serif' : '11px Inter,sans-serif'
    ctx.fillStyle = hot ? '#E5E5E5' : '#909090'
    ctx.textAlign = 'center'
    ctx.fillText(label, node.x, node.y + r + 14)
  }
  ctx.restore()
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GraphView() {
  const { loreSlug } = useParams<{ loreSlug: string }>()
  const navigate      = useNavigate()
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const nodesRef      = useRef<GraphNode[]>([])
  const edgesRef      = useRef<GraphEdge[]>([])
  const animRef       = useRef<number | null>(null)
  const hoveredRef    = useRef<string | null>(null)
  const zoomRef       = useRef<number>(1)

  const [lore, setLore]               = useState<LoreMeta | null>(null)
  const [loading, setLoading]         = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom]               = useState(1)
  const [nodeCount, setNodeCount]     = useState(0)
  const [edgeCount, setEdgeCount]     = useState(0)

  useEffect(() => { zoomRef.current = zoom }, [zoom])

  useEffect(() => {
    if (!loreSlug) return
    let cancelled = false

    async function fetchData() {
      try {
        const { data: loreData, error: le } = await supabase
          .from('lores').select('id, slug, title').eq('slug', loreSlug).single()
        if (le || !loreData) throw le ?? new Error('Lore not found')
        if (!cancelled) setLore(loreData)

        const { data: pages, error: pe } = await supabase
          .from('pages').select('id, title, slug, category').eq('lore_id', loreData.id)
        if (pe) throw pe

        const { data: rels } = await supabase
          .from('relationships').select('*')
          .in('source_page_id', (pages ?? []).map(p => p.id))

        if (cancelled) return

        const initialNodes: GraphNode[] = (pages ?? []).map((p, i) => {
          const angle = (i / (pages ?? []).length) * 2 * Math.PI
          return {
            id: p.id, title: p.title, category: p.category, slug: p.slug,
            x: CENTER_X + Math.cos(angle) * 180 * (0.7 + Math.random() * 0.6),
            y: CENTER_Y + Math.sin(angle) * 140 * (0.7 + Math.random() * 0.6),
            vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, radius: 18,
          }
        })

        nodesRef.current = initialNodes
        edgesRef.current = (rels ?? []).map(r => ({
          source: r.source_page_id, target: r.target_page_id, type: r.type, label: r.label,
        }))
        setNodeCount(initialNodes.length)
        setEdgeCount(edgesRef.current.length)
      } catch (err) {
        console.error('GraphView fetch error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [loreSlug])

  useEffect(() => {
    if (loading || nodesRef.current.length === 0) return
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let frame = 0
    const loop = () => {
      if (frame % 2 === 0) nodesRef.current = tick(nodesRef.current, edgesRef.current)
      drawGraph(ctx, nodesRef.current, edgesRef.current, hoveredRef.current, zoomRef.current)
      frame++
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => { if (animRef.current !== null) cancelAnimationFrame(animRef.current) }
  }, [loading])

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const cssX = e.clientX - rect.left, cssY = e.clientY - rect.top
    const canvasX = cssX * (CANVAS_W / rect.width)
    const canvasY = cssY * (CANVAS_H / rect.height)
    return {
      x: (canvasX - CENTER_X) / zoomRef.current + CENTER_X,
      y: (canvasY - CENTER_Y) / zoomRef.current + CENTER_Y,
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e)
    let found: string | null = null
    for (const node of nodesRef.current) {
      const dx = x - node.x, dy = y - node.y
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 8) { found = node.id; break }
    }
    hoveredRef.current = found
    setHoveredNode(found)
  }, [getCanvasCoords])

  const handleClick = useCallback(() => {
    const node = nodesRef.current.find(n => n.id === hoveredRef.current)
    if (node && lore) navigate(`/lore/${lore.slug}/${node.slug}`)
  }, [lore, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <p className="text-[#C4A962] animate-pulse">Building graph…</p>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#E5E5E5] mb-4">Lore not found</h1>
          <Link to="/" className="text-[#C4A962] hover:underline">Return home</Link>
        </div>
      </div>
    )
  }

  // Legend entries derived from categoryConfig — only categories present in the graph
  const presentCategories = Array.from(new Set(nodesRef.current.map(n => n.category)))

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to={`/lore/${lore.slug}`}
            className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{lore.title}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))}
              className="p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:bg-[#222] transition-colors">
              <ZoomIn className="w-4 h-4 text-[#A0A0A0]" />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}
              className="p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:bg-[#222] transition-colors">
              <ZoomOut className="w-4 h-4 text-[#A0A0A0]" />
            </button>
            <button onClick={() => setZoom(1)}
              className="p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:bg-[#222] transition-colors">
              <RotateCcw className="w-4 h-4 text-[#A0A0A0]" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <div className="relative border border-[#2A2A2A] rounded-2xl overflow-hidden bg-[#111] max-w-4xl mx-auto">
          <canvas
            ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
            className="w-full h-auto block"
            style={{ cursor: hoveredNode ? 'pointer' : 'default' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { hoveredRef.current = null; setHoveredNode(null) }}
            onClick={handleClick}
          />

          {/* Legend — only shows categories actually in this graph, with icons */}
          <div className="absolute bottom-4 right-4 bg-[#0F0F0F]/90 backdrop-blur-sm border border-[#2A2A2A] rounded-xl p-3">
            <p className="text-[10px] font-semibold text-[#606060] uppercase tracking-widest mb-2">Categories</p>
            <div className="space-y-1.5">
              {presentCategories.map(cat => {
                const cfg = categoryConfig[cat as PageCategory]
                return (
                  <div key={cat} className="flex items-center gap-2 text-xs text-[#A0A0A0]">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getCategoryHex(cat) }} />
                    {cfg?.icon && <span className="text-xs leading-none">{cfg.icon}</span>}
                    {cat}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="absolute top-4 left-4 bg-[#0F0F0F]/90 backdrop-blur-sm border border-[#2A2A2A] rounded-xl p-3">
            <p className="text-sm text-[#E5E5E5]">
              <span className="font-bold text-[#C4A962]">{nodeCount}</span>
              <span className="text-[#606060] ml-1">nodes</span>
            </p>
            <p className="text-sm text-[#E5E5E5]">
              <span className="font-bold text-[#C4A962]">{edgeCount}</span>
              <span className="text-[#606060] ml-1">edges</span>
            </p>
            {hoveredNode && (
              <p className="text-xs text-[#C4A962] mt-1.5 border-t border-[#2A2A2A] pt-1.5">
                Click to open →
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#404040] mt-3">
          Click a node to open · Use zoom controls to explore
        </p>
      </div>
    </div>
  )
}
