import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface FloatingCardProps {
  id?:               string
  title:             string
  description:       string
  imageUrl:          string | null
  slug:              string
  pageCount?:        number | null
  contributorCount?: number | null
  category?:         string | null
}

function useStableRandom(min: number, max: number) {
  const ref = useRef<number | null>(null)
  if (ref.current === null) ref.current = min + Math.random() * (max - min)
  return ref.current
}

export default function FloatingCard({
  id: _id,
  title,
  description,
  imageUrl,
  slug,
  pageCount = 0,
  contributorCount = 0,
  category,
}: FloatingCardProps) {
  const [isFlipped, setIsFlipped]     = useState(false)
  const [isHovered, setIsHovered]     = useState(false)
  const [floatReady, setFloatReady]   = useState(true)

  const rotateOffset = useStableRandom(-0.8, 0.8)
  const duration     = useStableRandom(5, 7)

  const FALLBACK    = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'
  const CARD_HEIGHT = 400

  const floatAnimation = {
    y:      [0, -8, 0],
    rotate: [rotateOffset * 0.3, rotateOffset * 0.8, rotateOffset * 0.3],
  }
  const floatTransition = {
    duration,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  }

  function handleFlip() {
    if (isFlipped) {
      // Flipping back — pause float briefly so it doesn't snap in
      setFloatReady(false)
      setIsFlipped(false)
      setTimeout(() => setFloatReady(true), 700)
    } else {
      setIsFlipped(true)
    }
  }

  return (
    <div
      style={{ height: CARD_HEIGHT, perspective: '1500px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover glow ring */}
      <AnimatePresence>
        {isHovered && !isFlipped && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: '0 0 0 1.5px rgba(196,169,98,0.35), 0 8px 32px rgba(196,169,98,0.12)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d', height: CARD_HEIGHT }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          ...(isFlipped || !floatReady ? {} : floatAnimation),
        }}
        transition={
          isFlipped || !floatReady
            ? { duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }
            : floatTransition
        }
        onClick={handleFlip}
      >
        {/* ── Front ─────────────────────────────────── */}
        <div
          className="absolute w-full"
          style={{ height: CARD_HEIGHT, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div
            className="bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl transition-colors duration-200"
            style={{ height: CARD_HEIGHT }}
          >
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
              {/* Flip hint — icon instead of text */}
              <div className="flex items-center gap-1.5 mt-3">
                <RotateCcw className="w-3 h-3 text-[#404040]" />
                <span className="text-xs text-[#404040]">Tap to reveal</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Back ─────────────────────────────────── */}
        <div
          className="absolute w-full"
          style={{
            height: CARD_HEIGHT,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div
            className="bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-2xl border border-[#2A2A2A] shadow-xl p-6 flex flex-col"
            style={{ height: CARD_HEIGHT }}
          >
            {/* Title + category */}
            <div className="mb-3">
              <h3 className="text-2xl font-serif font-bold text-[#E5E5E5] leading-tight">{title}</h3>
              {category && (
                <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#C4A962]/10 text-[#C4A962] text-xs font-medium rounded-full border border-[#C4A962]/20">
                  {category}
                </span>
              )}
            </div>

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

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <RotateCcw className="w-3 h-3 text-[#404040]" />
              <span className="text-xs text-[#404040]">Tap to flip back</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
