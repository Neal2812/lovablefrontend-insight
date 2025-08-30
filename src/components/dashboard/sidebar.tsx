import { Shield, FileText, BarChart3, MessageSquare, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "compliance", label: "Compliance Check", icon: Shield },
  { id: "chat", label: "AI Assistant", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">ComplianceAI</h1>
            <p className="text-xs text-muted-foreground">Geo Compliance System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              activeSection === item.id && "bg-primary text-primary-foreground shadow-glow"
            )}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>v1.0.0 - Beta</p>
          <p className="mt-1">Powered by RAG & LLM</p>
        </div>
      </div>
    </div>
  )
}