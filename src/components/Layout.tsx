import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, PlusCircle, LogOut, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'

import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { useToast } from './Toast'

interface LayoutProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { to: '/',       icon: Home,       label: 'Home',   match: (p: string) => p === '/'                    },
  { to: '/search', icon: Search,     label: 'Search', match: (p: string) => p.startsWith('/search')      },
  { to: '/create', icon: PlusCircle, label: 'Create', match: (p: string) => p.startsWith('/create')      },
]

type NavItem = { to: string; icon: React.ElementType; label: string; match: (p: string) => boolean }
type AuthNavItem = NavItem | { to?: undefined; icon: React.ElementType; label: string; match?: undefined }

const AUTH_NAV_ITEM: { login: NavItem; logout: AuthNavItem } = {
  login: { to: '/login', icon: LogIn, label: 'Login', match: (p: string) => p.startsWith('/login') },
  logout: { icon: LogOut, label: 'Logout' },
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('Logged out successfully!', 'info')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <main className="pb-24">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-xl border-t border-[#2A2A2A]">
        <div className="max-w-sm mx-auto flex items-center justify-around px-2 py-2">
          {[...NAV_ITEMS, user ? AUTH_NAV_ITEM.logout : AUTH_NAV_ITEM.login].map((item) => {
            const { to, icon: Icon, label, match } = item;
            const active = to ? match(pathname) : false; // Logout doesn't have a 'to' path

            return (
              item.label === 'Logout' ? (
                <button
                  key={label}
                  onClick={handleLogout}
                  className="relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl"
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-[#C4A962]/10"
                    initial={false}
                    whileTap={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon className="w-5 h-5 transition-colors duration-200 text-[#606060]" />
                  </motion.div>
                  <span className="text-[10px] font-medium tracking-wide uppercase transition-colors duration-200 text-[#505050]">
                    {label}
                  </span>
                </button>
              ) : (
                <Link
                  key={to}
                  to={to!}
                  className="relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl"
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-[#C4A962]/10"
                    initial={false}
                    whileTap={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    animate={active ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        active ? 'text-[#C4A962]' : 'text-[#606060]'
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium tracking-wide uppercase transition-colors duration-200 ${
                      active ? 'text-[#C4A962]' : 'text-[#505050]'
                    }`}
                  >
                    {label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C4A962]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            );
          })}
        </div>
      </nav>
    </div>
  )
}
