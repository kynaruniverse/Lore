import React from 'react'
import { cn } from '../lib/utils'

interface SectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function ContentSection({ title, children, className }: SectionProps) {
  return (
    <div className={cn(
      "mb-8 last:mb-0",
      className
    )}>
      <h2 className="text-xl md:text-2xl font-serif font-semibold mb-4 pb-2 border-b border-border/50 relative">
        <span className="relative inline-block">
          {title}
          <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary" />
        </span>
      </h2>
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </div>
  )
}

interface ContentBoxProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'compact' | 'featured'
}

export function ContentBox({ children, className, variant = 'default' }: ContentBoxProps) {
  return (
    <div className={cn(
      "border border-border rounded-xl p-6",
      variant === 'compact' && "p-4",
      variant === 'featured' && "bg-gradient-to-br from-primary/5 to-transparent border-primary/20",
      className
    )}>
      {children}
    </div>
  )
}

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ContentGrid({ children, cols = 2, gap = 'md', className }: GridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8'
  }

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      'grid',
      colClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface KnowledgeGapProps {
  missingFields: string[]
  completeness: number
  className?: string
}

export function KnowledgeGapCard({ missingFields, completeness, className }: KnowledgeGapProps) {
  if (missingFields.length === 0) return null

  return (
    <div className={cn(
      "border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg",
      className
    )}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <h3 className="font-semibold text-sm">Knowledge Gaps</h3>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
          {completeness}% complete
        </span>
      </div>
      
      <p className="text-xs text-muted-foreground mb-2">
        This page needs the following information:
      </p>
      
      <ul className="space-y-1">
        {missingFields.map((field, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
            <span>{field}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
