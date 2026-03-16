import { Link, useLocation } from 'react-router-dom'
import { Home, Search, PlusCircle, Flame, Sun, Moon } from 'lucide-react'
import { SearchAutocomplete } from './ui/SearchAutocomplete'
import { cn } from '../lib/utils'
import { useTheme } from '../contexts/ThemeContext'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: '/', icon: Home, label: 'Discover' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/create', icon: PlusCircle, label: 'Create' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center ember-glow">
              <Flame className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-semibold">Lore</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm transition-colors",
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search Autocomplete - Desktop */}
            <div className="hidden md:block">
              <SearchAutocomplete />
            </div>

            {/* Keyboard shortcut hint */}
            <div className="hidden md:block text-xs text-muted-foreground">
              Press / to search
            </div>

            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <SearchAutocomplete />
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center px-4 py-2 text-xs",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content with padding for mobile nav */}
      <main className="container py-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  )
}
