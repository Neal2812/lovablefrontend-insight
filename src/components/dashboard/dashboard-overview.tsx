import { useState, useEffect } from "react"
import { FileText, Shield, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AnalyticsOverview } from "./analytics-overview"
import { ComplianceResults } from "./compliance-results"
import { mockApiService } from "@/services/api"

interface RecentActivity {
  id: string
  type: "upload" | "compliance_check" | "issue_resolved"
  description: string
  timestamp: Date
  status?: "success" | "warning" | "error"
}

interface DashboardOverviewProps {
  onNavigateToSection: (section: string) => void
}

export function DashboardOverview({ onNavigateToSection }: DashboardOverviewProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [complianceResults, setComplianceResults] = useState<any[]>([])
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "upload",
      description: "Privacy Policy v2.1.pdf uploaded",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "success"
    },
    {
      id: "2",
      type: "compliance_check",
      description: "GDPR compliance check completed",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "warning"
    },
    {
      id: "3",
      type: "issue_resolved",
      description: "Data retention issue resolved in Terms of Service",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "success"
    }
  ])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analytics, results] = await Promise.all([
          mockApiService.getAnalytics(),
          mockApiService.getComplianceResults()
        ])
        setAnalyticsData(analytics)
        setComplianceResults(results)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      }
    }

    loadData()
  }, [])

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "upload":
        return <FileText className="w-4 h-4" />
      case "compliance_check":
        return <Shield className="w-4 h-4" />
      case "issue_resolved":
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const getActivityColor = (status?: RecentActivity["status"]) => {
    switch (status) {
      case "success":
        return "text-success"
      case "warning":
        return "text-warning"
      case "error":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to ComplianceAI Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor your document compliance across different regions and regulations.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow" 
              onClick={() => onNavigateToSection("documents")}>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium text-foreground">Upload Documents</h3>
            <p className="text-sm text-muted-foreground">Add new documents for analysis</p>
          </CardContent>
        </Card>

        <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => onNavigateToSection("compliance")}>
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
            <h3 className="font-medium text-foreground">Run Compliance Check</h3>
            <p className="text-sm text-muted-foreground">Analyze document compliance</p>
          </CardContent>
        </Card>

        <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => onNavigateToSection("chat")}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-warning" />
            <h3 className="font-medium text-foreground">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Get compliance guidance</p>
          </CardContent>
        </Card>

        <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => onNavigateToSection("analytics")}>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <h3 className="font-medium text-foreground">View Analytics</h3>
            <p className="text-sm text-muted-foreground">Analyze compliance trends</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics */}
        <div className="lg:col-span-2">
          <AnalyticsOverview data={analyticsData} />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`mt-0.5 ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                  {activity.status && (
                    <Badge className={`text-xs ${
                      activity.status === "success" ? "text-success bg-success/10" :
                      activity.status === "warning" ? "text-warning bg-warning/10" :
                      "text-destructive bg-destructive/10"
                    }`}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="text-foreground">2.3 GB / 10 GB</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">API Calls</span>
                  <span className="text-foreground">847 / 5000</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">System Health</span>
                  <Badge className="text-success bg-success/10">All Systems Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Compliance Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Compliance Results</h2>
          <Button variant="outline" onClick={() => onNavigateToSection("compliance")}>
            View All Results
          </Button>
        </div>
        <ComplianceResults 
          results={complianceResults.slice(0, 2)} 
          onViewDetails={(id) => console.log("View details for:", id)}
        />
      </div>
    </div>
  )
}