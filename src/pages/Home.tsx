import { Link } from 'react-router-dom'
import { Flame, TrendingUp, FileText, Users } from 'lucide-react'
import { useLores } from '../lib/loreStore'

export default function Home() {
  const { lores, loading } = useLores()
  const trendingLores = lores.filter(l => l.trending).slice(0, 3)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center ember-glow">
            <Flame className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
          Every story worth
          <br />
          <span className="text-primary">remembering.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-10">
          Communities collaboratively document the things they love — games, shows, films,
          sports, and fictional worlds — in one connected knowledge graph.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <Link
            to="/create"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 ember-glow"
          >
            Start a Lore
          </Link>
          <Link
            to="/search"
            className="px-8 py-4 border border-border rounded-lg font-medium hover:border-primary/40"
          >
            Explore Knowledge
          </Link>
          {/* New 3D Experience Button */}
          <Link
            to="/3d"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-purple-500/25"
          >
            🌌 Experience in 3D
          </Link>
        </div>
      </div>

      {/* Trending Lores */}
      {trendingLores.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-serif font-semibold">Trending Lores</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingLores.map((lore) => (
              <Link key={lore.id} to={`/lore/${lore.slug}`}>
                <div className="lore-card overflow-hidden group">
                  <div className="relative h-48">
                    <img 
                      src={lore.cover_image_url} 
                      alt={lore.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {lore.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {lore.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {lore.page_count} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {lore.contributor_count}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
