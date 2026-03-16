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

export function GraphLegend() {
  return (
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
  )
}
