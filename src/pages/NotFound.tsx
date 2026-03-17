import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-8xl font-serif font-bold text-[#2A2A2A] mb-4 select-none">404</p>
        <h1 className="text-2xl font-serif font-bold text-[#E5E5E5] mb-2">Page not found</h1>
        <p className="text-[#606060] mb-8 max-w-xs">
          This page doesn't exist in any known universe.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C4A962] text-[#0F0F0F]
                       rounded-xl font-semibold hover:bg-[#B89A52] transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-[#E5E5E5]
                       border border-[#2A2A2A] rounded-xl font-semibold hover:bg-[#222] transition-colors"
          >
            <Search className="w-4 h-4" /> Search
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
