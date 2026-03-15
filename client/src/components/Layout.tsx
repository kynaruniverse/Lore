// LORE — Layout Component
// Ember Archive: dark warm charcoal, burnt orange accents
// Mobile: bottom navigation bar | Desktop: left sidebar

import { Link, useLocation } from "wouter";
import { Home, Search, PlusCircle, BookOpen, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/", icon: Home, label: "Discover" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/create", icon: PlusCircle, label: "Create" },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar sticky top-0 h-screen">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center ember-glow">
              <Flame className="w-4 h-4 text-primary-foreground" />
            </div>
            <span
              className="text-xl font-semibold text-foreground"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Lore
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Community knowledge, beautifully organised.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span
                  className="text-lg font-semibold text-foreground"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  Lore
                </span>
              </div>
            </Link>
            <Link href="/search">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border bottom-nav">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-150",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon
                    className={cn("w-5 h-5 transition-all", active && "drop-shadow-[0_0_6px_oklch(0.62_0.18_42)]")}
                  />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
          <Link href="/create">
            <div className="flex flex-col items-center gap-1 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ember-glow">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
