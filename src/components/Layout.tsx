import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Search, PlusCircle } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  showBackButton?: boolean
  backTo?: string
  backLabel?: string
}

const NAV_ITEMS = [
  { to: '/',       icon: Home,       label: 'Home'   },
  { to: '/search', icon: Search,     label: 'Search' },
  { to: '/create', icon: PlusCircle, label: 'Create' },
]

export default function Layout({
  children,
  showBackButton = false,
  backTo = '/',
  backLabel = 'Back',
}: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Top bar — back button variant */}
      {showBackButton && (
        <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{backLabel}</span>
            </Link>
          </div>
        </header>
      )}

      <main className="pb-24">{children}</main>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-xl border-t border-[#2A2A2A]">
        <div className="max-w-sm mx-auto flex items-center justify-around px-4 py-3">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
                  active
                    ? 'text-[#C4A962]'
                    : 'text-[#606060] hover:text-[#A0A0A0]'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
