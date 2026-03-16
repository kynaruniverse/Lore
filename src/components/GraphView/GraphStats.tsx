interface GraphStatsProps {
  nodeCount: number
  edgeCount: number
}

export function GraphStats({ nodeCount, edgeCount }: GraphStatsProps) {
  return (
    <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
      <div className="text-sm">
        <span className="font-medium">{nodeCount}</span> pages
      </div>
      <div className="text-sm">
        <span className="font-medium">{edgeCount}</span> relationships
      </div>
    </div>
  )
}
