import { Link, useLocation } from 'react-router-dom'
import { Home, Search, PlusCircle, Flame, Sun, Moon, Menu } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { useTheme } from '../contexts/ThemeContext'
import { SearchAutocomplete } from './ui/SearchAutocomplete'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/create', icon: PlusCircle, label: 'Create' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="hidden md:block border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-2xl font-serif font-bold">Lore</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground-muted hover:text-foreground hover:bg-secondary/10"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <SearchAutocomplete />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-xl font-serif font-bold">Lore</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-lg">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground-muted hover:text-foreground hover:bg-secondary/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar (alternative to menu) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-navy/80 backdrop-blur-md border-t border-border py-2 px-4 z-40">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "tab-item",
                location.pathname === item.href && "active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Floating Action Button for mobile */}
      <Link to="/create" className="md:hidden fab">
        <PlusCircle className="w-6 h-6" />
      </Link>
    </div>
  )
}
