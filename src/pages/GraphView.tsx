import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { GraphLegend } from '../components/GraphView/GraphLegend'
import { GraphStats } from '../components/GraphView/GraphStats'

type Node = {
  id: string
  title: string
  category: string
  slug: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

type Edge = {
  source: string
  target: string
  type: string
  label: string | null
}

const CATEGORY_COLORS: Record<string, string> = {
  Character: '#C4622D',
  Location: '#2D7FC4',
  Event: '#8B5E3C',
  Item: '#B8922A',
  Organisation: '#4A7C59',
  Concept: '#9333EA',
  Timeline: '#0891B2',
  Episode: '#E11D48',
  Season: '#4F46E5',
  default: '#6B7280'
}

export default function GraphView() {
  const { loreSlug } = useParams<{ loreSlug: string }>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lore, setLore] = useState<any>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)
  const isDraggingCanvas = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (loreSlug) {
      fetchData()
    }
  }, [loreSlug])

  async function fetchData() {
    try {
      const { data: loreData } = await supabase
        .from('lores')
        .select('*')
        .eq('slug', loreSlug || '')
        .single()

      if (!loreData) return
      setLore(loreData)

      const { data: pages } = await supabase
        .from('pages')
        .select('id, title, slug, category')
        .eq('lore_id', loreData.id)

      if (!pages) return

      const { data: relationships } = await supabase
        .from('relationships')
        .select('*')
        .in('source_page_id', pages.map(p => p.id))

      const centerX = 400
      const centerY = 300
      const radius = 200

      const initialNodes: Node[] = pages.map((page, i) => {
        const angle = (i / pages.length) * 2 * Math.PI
        return {
          id: page.id,
          title: page.title,
          category: page.category,
          slug: page.slug,
          x: centerX + Math.cos(angle) * radius * (0.8 + Math.random() * 0.4),
          y: centerY + Math.sin(angle) * radius * (0.8 + Math.random() * 0.4),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 20
        }
      })

      setNodes(initialNodes)
      setEdges((relationships || []).map((r: any) => ({
        source: r.source_page_id,
        target: r.target_page_id,
        type: r.type,
        label: r.label
      })))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (nodes.length === 0) return

    const simulate = () => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(n => ({ ...n }))
        const centerX = 400
        const centerY = 300

        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const dx = newNodes[j].x - newNodes[i].x
            const dy = newNodes[j].y - newNodes[i].y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const force = 8000 / (dist * dist)
            const fx = (dx / dist) * force
            const fy = (dy / dist) * force
            newNodes[i].vx -= fx
            newNodes[i].vy -= fy
            newNodes[j].vx += fx
            newNodes[j].vy += fy
          }
        }

        for (const edge of edges) {
          const source = newNodes.find(n => n.id === edge.source)
          const target = newNodes.find(n => n.id === edge.target)
          if (source && target) {
            const dx = target.x - source.x
            const dy = target.y - source.y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const force = (dist - 150) * 0.02
            const fx = (dx / dist) * force
            const fy = (dy / dist) * force
            source.vx += fx
            source.vy += fy
            target.vx -= fx
            target.vy -= fy
          }
        }

        for (const node of newNodes) {
          const dx = centerX - node.x
          const dy = centerY - node.y
          node.vx += dx * 0.005
          node.vy += dy * 0.005
        }

        for (const node of newNodes) {
          if (node.id === draggedNode) {
            node.vx = 0
            node.vy = 0
            continue
          }
          node.vx *= 0.9
          node.vy *= 0.9
          node.x += node.vx
          node.y += node.vy
          const margin = 100
          if (node.x < -margin) node.vx += 2
          if (node.x > 800 + margin) node.vx -= 2
          if (node.y < -margin) node.vy += 2
          if (node.y > 600 + margin) node.vy -= 2
        }

        return newNodes
      })

      animationRef.current = requestAnimationFrame(simulate)
    }

    animationRef.current = requestAnimationFrame(simulate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [nodes.length, edges, draggedNode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)

    ctx.lineWidth = 1.5
    for (const edge of edges) {
      const source = nodes.find(n => n.id === edge.source)
      const target = nodes.find(n => n.id === edge.target)
      if (source && target) {
        const isHovered = hoveredNode === source.id || hoveredNode === target.id
        ctx.strokeStyle = isHovered ? '#C4622D' : '#4B5563'
        ctx.globalAlpha = isHovered ? 0.9 : 0.4
        ctx.setLineDash(isHovered ? [] : [5, 5])
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
      }
    }

    ctx.setLineDash([])
    for (const node of nodes) {
      const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.default
      const isHovered = hoveredNode === node.id
      const isDragged = draggedNode === node.id
      if (isHovered || isDragged) {
        ctx.shadowColor = color
        ctx.shadowBlur = 20
      } else {
        ctx.shadowBlur = 0
      }
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * (isHovered ? 1.2 : 1), 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.globalAlpha = isHovered || isDragged ? 1 : 0.8
      ctx.fill()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.font = `bold ${isHovered ? '14px' : '12px'} Inter, sans-serif`
      ctx.fillStyle = '#FFFFFF'
      ctx.globalAlpha = 1
      ctx.textAlign = 'center'
      ctx.fillText(node.title, node.x, node.y + node.radius + (isHovered ? 22 : 18))
      ctx.font = '10px Inter, sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.fillText(node.category.toUpperCase(), node.x, node.y - node.radius - (isHovered ? 12 : 8))
    }
    ctx.restore()
  }, [nodes, edges, hoveredNode, draggedNode, zoom, offset])

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e)
    const worldX = (pos.x - offset.x) / zoom
    const worldY = (pos.y - offset.y) / zoom
    let clickedNode = null
    for (const node of nodes) {
      const dx = worldX - node.x
      const dy = worldY - node.y
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 10) {
        clickedNode = node.id
        break
      }
    }
    if (clickedNode) {
      setDraggedNode(clickedNode)
    } else {
      isDraggingCanvas.current = true
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e)
    const worldX = (pos.x - offset.x) / zoom
    const worldY = (pos.y - offset.y) / zoom
    if (draggedNode) {
      setNodes(prev => prev.map(n => n.id === draggedNode ? { ...n, x: worldX, y: worldY } : n))
    } else if (isDraggingCanvas.current) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }))
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    } else {
      let hovered = null
      for (const node of nodes) {
        const dx = worldX - node.x
        const dy = worldY - node.y
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 10) {
          hovered = node.id
          break
        }
      }
      setHoveredNode(hovered)
    }
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
    isDraggingCanvas.current = false
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (draggedNode || isDraggingCanvas.current) return
    const pos = getMousePos(e)
    const worldX = (pos.x - offset.x) / zoom
    const worldY = (pos.y - offset.y) / zoom
    const node = nodes.find(n => {
      const dx = worldX - n.x
      const dy = worldY - n.y
      return Math.sqrt(dx * dx + dy * dy) < n.radius + 10
    })
    if (node && lore) {
      window.location.href = `/lore/${lore.slug}/${node.slug}`
    }
  }

  if (loading) return <div className="text-center py-12 animate-pulse">Loading graph...</div>
  if (!lore) return <div className="text-center py-12"><h1 className="text-2xl font-bold mb-4">Lore not found</h1><Link to="/" className="text-primary hover:underline">Return home</Link></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link to={`/lore/${lore.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {lore.title}
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-2 border border-border rounded-lg hover:bg-accent"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-2 border border-border rounded-lg hover:bg-accent"><ZoomOut className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="relative border border-border rounded-xl overflow-hidden bg-card">
        <canvas ref={canvasRef} width={800} height={600} className="w-full h-auto cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={handleCanvasClick} />
        <GraphLegend />
        <GraphStats nodeCount={nodes.length} edgeCount={edges.length} />
      </div>
    </div>
  )
}
