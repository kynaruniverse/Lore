import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  showBackButton?: boolean
  backTo?: string
  backLabel?: string
}

export default function Layout({ 
  children, 
  showBackButton = false, 
  backTo = '/', 
  backLabel = 'Back' 
}: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {showBackButton && (
        <header className="sticky top-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#2A2A2A]">
          <div className="container mx-auto px-4 py-4">
            <Link 
              to={backTo} 
              className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{backLabel}</span>
            </Link>
          </div>
        </header>
      )}
      <main>{children}</main>
    </div>
  )
}
