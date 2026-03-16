import { Link } from 'react-router-dom'

interface LoreCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  slug: string
}

export default function LoreCard({ title, description, imageUrl, slug }: LoreCardProps) {
  return (
    <Link to={`/lore/${slug}`} className="block">
      <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#C4A962] transition-all hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'
            }}
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-serif font-semibold text-[#E5E5E5] mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-[#A0A0A0] line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
