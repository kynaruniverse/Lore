import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface FloatingCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  slug: string
  pageCount?: number
  contributorCount?: number
  category?: string
}

export default function FloatingCard({ 
  title, 
  description, 
  imageUrl, 
  slug, 
  pageCount = 0, 
  contributorCount = 0,
  category 
}: FloatingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [randomOffset] = useState(() => Math.random() * 2 - 1) // Random value between -1 and 1

  // Floating animation
  const floatAnimation = {
    y: [0, -10, 0],
    rotate: [randomOffset * 0.5, randomOffset * 1, randomOffset * 0.5],
    transition: {
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: Math.random() * 2
    }
  }

  return (
    <div className="relative w-full perspective-1000" style={{ minHeight: '400px' }}>
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <motion.div 
          className="absolute w-full h-full backface-hidden"
          animate={!isFlipped ? floatAnimation : {}}
        >
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-3xl overflow-hidden border border-[#333] shadow-2xl h-full">
            {/* Image with overlay */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent z-10" />
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'
                }}
              />
              {/* Category badge */}
              {category && (
                <span className="absolute top-3 right-3 z-20 px-3 py-1 bg-[#C4A962]/90 text-[#0F0F0F] text-xs font-semibold rounded-full backdrop-blur-sm">
                  {category}
                </span>
              )}
            </div>
            
            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-serif font-bold text-[#E5E5E5] mb-2 line-clamp-1">
                {title}
              </h3>
              <p className="text-sm text-[#A0A0A0] line-clamp-2">
                {description}
              </p>
              
              {/* Stats row */}
              <div className="mt-4 flex items-center gap-3 text-xs text-[#A0A0A0]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A962]" />
                  {pageCount} pages
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A962]" />
                  {contributorCount} contributors
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div 
          className="absolute w-full h-full backface-hidden rotate-y-180"
          animate={isFlipped ? floatAnimation : {}}
        >
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-3xl border border-[#333] shadow-2xl p-6 flex flex-col h-full">
            <h3 className="text-2xl font-serif font-bold text-[#E5E5E5] mb-3">
              {title}
            </h3>
            
            <p className="text-sm text-[#A0A0A0] mb-6 flex-1">
              {description}
            </p>
            
            {/* Stats in a grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#222] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-[#C4A962]">{pageCount}</div>
                <div className="text-xs text-[#A0A0A0]">Pages</div>
              </div>
              <div className="bg-[#222] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-[#C4A962]">{contributorCount}</div>
                <div className="text-xs text-[#A0A0A0]">Contributors</div>
              </div>
            </div>

            {/* View button */}
            <Link 
              to={`/lore/${slug}`}
              className="block w-full py-3 bg-[#C4A962] text-[#0F0F0F] text-center font-semibold rounded-xl hover:bg-[#B89A52] transition-all transform hover:scale-105 active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              Explore Universe →
            </Link>

            {/* Hint */}
            <p className="text-center text-xs text-[#A0A0A0] mt-3">
              Tap card to flip back
            </p>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1500px;
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
