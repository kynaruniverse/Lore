import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileText, Globe, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function FloatingActionButton() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Create Lore',
      color: 'bg-primary',
      onClick: () => navigate('/create')
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Create Page',
      color: 'bg-blue-500',
      onClick: () => {
        // This would need current lore context
        setOpen(false)
      }
    }
  ]

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40">
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20"
              onClick={() => setOpen(false)}
            />
            
            {/* Action buttons */}
            <div className="absolute bottom-16 right-0 space-y-2">
              {actions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    action.onClick()
                    setOpen(false)
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-full shadow-lg
                    ${action.color} text-white
                  `}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all ember-glow"
      >
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  )
}
