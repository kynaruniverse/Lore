import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface FloatingCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  slug: string
  pageCount ? : number
  contributorCount ? : number
  category ? : string
}

// Stable random offset per card instance (computed once on mount via useRef)
function useStableRandom(min: number, max: number) {
  const ref = useRef < number | null > (null)
  if (ref.current === null) ref.current = min + Math.random() * (max - min)
  return ref.current
}

export default function FloatingCard({
  title,
  description,
  imageUrl,
  slug,
  pageCount = 0,
  contributorCount = 0,
  category,
}: FloatingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const rotateOffset = useStableRandom(-0.8, 0.8)
  const duration = useStableRandom(5, 7)
  
  const floatAnimation = {
    y: [0, -8, 0],
    rotate: [rotateOffset * 0.3, rotateOffset * 0.8, rotateOffset * 0.3],
    transition: { duration, repeat: Infinity, ease: 'easeInOut'
      as const },
  }
  
  const FALLBACK = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'
  
  const CARD_HEIGHT = 400
  
  return (
    <div className="relative w-full" style={{ height: CARD_HEIGHT, perspective: '1500px' }}>
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d', height: CARD_HEIGHT }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
        onClick={() => setIsFlipped(f => !f)}
      >
        {/* ── Front ─────────────────────────────────── */}
        <motion.div
          className="absolute w-full"
          style={{ height: CARD_HEIGHT, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          animate={!isFlipped ? floatAnimation : {}}
        >
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl" style={{ height: CARD_HEIGHT }}>
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent z-10" />
              <img
                src={imageUrl || FALLBACK}
                alt={title}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = FALLBACK }}
              />
              {category && (
                <span className="absolute top-3 right-3 z-20 px-3 py-1 bg-[#C4A962]/90 text-[#0F0F0F] text-xs font-semibold rounded-full">
                  {category}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-serif font-bold text-[#E5E5E5] mb-2 line-clamp-1">{title}</h3>
              <p className="text-sm text-[#A0A0A0] line-clamp-2">{description}</p>
              <p className="text-xs text-[#606060] mt-3">Tap to flip</p>
            </div>
          </div>
        </motion.div>

        {/* ── Back ──────────────────────────────────── */}
        <motion.div
          className="absolute w-full"
          style={{
            height: CARD_HEIGHT,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          animate={isFlipped ? floatAnimation : {}}
        >
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-2xl border border-[#2A2A2A] shadow-xl p-6 flex flex-col" style={{ height: CARD_HEIGHT }}>
            <h3 className="text-2xl font-serif font-bold text-[#E5E5E5] mb-3">{title}</h3>
            <p className="text-sm text-[#A0A0A0] mb-6 flex-1 line-clamp-4">{description}</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#111] rounded-xl p-3 text-center border border-[#2A2A2A]">
                <div className="text-2xl font-bold text-[#C4A962]">{pageCount}</div>
                <div className="text-xs text-[#A0A0A0]">Pages</div>
              </div>
              <div className="bg-[#111] rounded-xl p-3 text-center border border-[#2A2A2A]">
                <div className="text-2xl font-bold text-[#C4A962]">{contributorCount}</div>
                <div className="text-xs text-[#A0A0A0]">Contributors</div>
              </div>
            </div>
            <Link
              to={`/lore/${slug}`}
              className="block w-full py-3 bg-[#C4A962] text-[#0F0F0F] text-center font-semibold rounded-xl hover:bg-[#B89A52] active:scale-95 transition-all"
              onClick={e => e.stopPropagation()}
            >
              Explore Universe →
            </Link>
            <p className="text-center text-xs text-[#606060] mt-3">Tap card to flip back</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}