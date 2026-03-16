import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface FlipCardProps {
  id: string
  title: string
  imageUrl: string
  description: string
  loreSlug: string
  pageSlug?: string
  type: 'lore' | 'page'
  category?: string
  tags?: string[]
  onClick?: () => void
}

export default function FlipCard({ 
  id, 
  title, 
  imageUrl, 
  description, 
  loreSlug, 
  pageSlug, 
  type,
  category,
  tags,
  onClick 
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    if (type === 'lore') {
      setIsFlipped(!isFlipped)
    } else if (onClick) {
      onClick()
    }
  }

  const handleViewPage = () => {
    if (type === 'lore' && loreSlug) {
      window.location.href = `/lore/${loreSlug}`
    } else if (type === 'page' && pageSlug) {
      window.location.href = `/lore/${loreSlug}/${pageSlug}`
    }
  }

  return (
    <div 
      className="relative w-full cursor-pointer perspective-1000"
      onClick={handleClick}
      style={{ minHeight: '320px' }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#333] shadow-xl hover:shadow-2xl transition-shadow">
            <div className="aspect-[16/9] overflow-hidden">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-serif font-semibold text-[#E5E5E5] mb-2 line-clamp-1">
                {title}
              </h3>
              <p className="text-sm text-[#A0A0A0] line-clamp-2">
                {description}
              </p>
              {category && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-[#2A2A2A] text-[#C4A962] rounded-full">
                    {category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back of card (only for lore cards) */}
        {type === 'lore' && (
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#333] shadow-xl p-6 flex flex-col h-full">
              <h3 className="text-xl font-serif font-semibold text-[#E5E5E5] mb-3">
                {title}
              </h3>
              <p className="text-sm text-[#A0A0A0] mb-4 flex-1">
                {description}
              </p>
              <div className="space-y-3">
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-[#2A2A2A] text-[#C4A962] rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewPage()
                  }}
                  className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-medium hover:bg-[#B89A52] transition-colors"
                >
                  View Lore
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* CSS for 3D effect */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
