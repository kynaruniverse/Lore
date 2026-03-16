import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

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
  const [zoom, setZoom] = useState(1)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    if (loreSlug) {
      fetchData()
    }
  }, [loreSlug])

  async function fetchData() {
    try {
      // Fetch lore
      const { data: loreData } = await supabase
        .from('lores')
        .select('*')
        .eq('slug', loreSlug)
        .single()

      if (!loreData) return
      setLore(loreData)

      // Fetch all pages in this lore
      const { data: pages } = await supabase
        .from('pages')
        .select('id, title, slug, category')
        .eq('lore_id', loreData.id)

      if (!pages) return

      // Fetch all relationships
      const { data: relationships } = await supabase
        .from('relationships')
        .select('*')
        .in('source_page_id', pages.map(p => p.id))

      // Initialize nodes with random positions
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
      setEdges(relationships || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Physics simulation
  useEffect(() => {
    if (nodes.length === 0) return

    const simulate = () => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(n => ({ ...n }))
        const centerX = 400
        const centerY = 300

        // Repulsion between nodes
        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const dx = newNodes[j].x - newNodes[i].x
            const dy = newNodes[j].y - newNodes[i].y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const force = 5000 / (dist * dist)
            
            const fx = (dx / dist) * force
            const fy = (dy / dist) * force
            
            newNodes[i].vx -= fx
            newNodes[i].vy -= fy
            newNodes[j].vx += fx
            newNodes[j].vy += fy
          }
        }

        // Attraction to center
        for (const node of newNodes) {
          const dx = centerX - node.x
          const dy = centerY - node.y
          node.vx += dx * 0.005
          node.vy += dy * 0.005
        }

        // Apply velocities and dampening
        for (const node of newNodes) {
          node.vx *= 0.95
          node.vy *= 0.95
          node.x += node.vx
          node.y += node.vy

          // Keep within bounds
          node.x = Math.max(50, Math.min(750, node.x))
          node.y = Math.max(50, Math.min(550, node.y))
        }

        return newNodes
      })

      animationRef.current = requestAnimationFrame(simulate)
    }

    animationRef.current = requestAnimationFrame(simulate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes.length])

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    ctx.lineWidth = 1
    for (const edge of edges) {
      const source = nodes.find(n => n.id === edge.source)
      const target = nodes.find(n => n.id === edge.target)
      
      if (source && target) {
        const isHovered = hoveredNode === source.id || hoveredNode === target.id
        ctx.strokeStyle = isHovered ? '#C4622D' : '#374151'
        ctx.globalAlpha = isHovered ? 0.8 : 0.3
        ctx.setLineDash(isHovered ? [] : [4, 4])
        
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
      }
    }

    // Draw nodes
    ctx.setLineDash([])
    for (const node of nodes) {
      const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.default
      const isHovered = hoveredNode === node.id
      
      // Glow effect for hovered nodes
      if (isHovered) {
        ctx.shadowColor = color
        ctx.shadowBlur = 15
      } else {
        ctx.shadowBlur = 0
      }

      // Draw circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.globalAlpha = isHovered ? 1 : 0.7
      ctx.fill()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.stroke()

      // Reset shadow
      ctx.shadowBlur = 0

      // Draw label
      ctx.font = '12px Inter, sans-serif'
      ctx.fillStyle = '#FFFFFF'
      ctx.globalAlpha = 1
      ctx.textAlign = 'center'
      ctx.fillText(
        node.title.length > 15 ? node.title.slice(0, 12) + '...' : node.title,
        node.x,
        node.y + node.radius + 18
      )

      // Draw category indicator
      ctx.font = '10px Inter, sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.fillText(
        node.category,
        node.x,
        node.y - node.radius - 8
      )
    }
  }, [nodes, edges, hoveredNode])

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    // Check for hover on nodes
    let hovered = null
    for (const node of nodes) {
      const dx = mouseX - node.x
      const dy = mouseY - node.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < node.radius + 10) {
        hovered = node.id
        break
      }
    }

    setHoveredNode(hovered)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hoveredNode) return
    
    const node = nodes.find(n => n.id === hoveredNode)
    if (node && lore) {
      window.location.href = `/lore/${lore.slug}/${node.slug}`
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading graph...</div>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Lore not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          to={`/lore/${lore.slug}`} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {lore.title}
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
            className="p-2 border border-border rounded-lg hover:bg-accent"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
            className="p-2 border border-border rounded-lg hover:bg-accent"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Graph container */}
      <div className="relative border border-border rounded-xl overflow-hidden bg-card">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto cursor-pointer"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          onMouseMove={handleCanvasMouseMove}
          onClick={handleCanvasClick}
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="space-y-1">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span>{cat}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Click any node to view its page
          </p>
        </div>

        {/* Stats */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
          <div className="text-sm">
            <span className="font-medium">{nodes.length}</span> pages
          </div>
          <div className="text-sm">
            <span className="font-medium">{edges.length}</span> relationships
          </div>
        </div>
      </div>
    </div>
  )
}
