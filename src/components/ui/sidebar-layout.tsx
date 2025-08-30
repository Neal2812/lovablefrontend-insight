import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  className?: string
}

export function SidebarLayout({ children, sidebar, className }: SidebarLayoutProps) {
  return (
    <div className={cn("flex h-screen bg-background", className)}>
      <aside className="w-64 bg-card border-r border-border shadow-card">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}