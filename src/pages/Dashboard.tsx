import { useState } from "react"
import { SidebarLayout } from "@/components/ui/sidebar-layout"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { DocumentUpload } from "@/components/dashboard/document-upload"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { ComplianceResults } from "@/components/dashboard/compliance-results"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, User, Bell, LogOut } from "lucide-react"
import { apiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [complianceResults, setComplianceResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleFileUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        const result = await apiService.uploadDocument(file)
        console.log("Uploaded:", result)
      }
      
      toast({
        title: "Success!",
        description: `${files.length} file(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (message: string): Promise<string> => {
    const result = await apiService.sendChatMessage(message)
    return result.response
  }

  const handleViewDetails = (id: string) => {
    console.log("Viewing details for:", id)
    toast({
      title: "Feature Coming Soon",
      description: "Detailed report view will be available soon!",
    })
  }

  const loadComplianceResults = async () => {
    try {
      const results = await apiService.getComplianceResults()
      setComplianceResults(results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load compliance results",
        variant: "destructive",
      })
    }
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview onNavigateToSection={setActiveSection} />
      
      case "documents":
        return (
          <div className="p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Document Management</h1>
              <p className="text-muted-foreground">
                Upload and manage documents for compliance analysis.
              </p>
            </div>
            <DocumentUpload onFileUpload={handleFileUpload} />
          </div>
        )
      
      case "compliance":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Compliance Results</h1>
                <p className="text-muted-foreground">
                  Review document compliance analysis and recommendations.
                </p>
              </div>
              <Button onClick={loadComplianceResults}>
                Refresh Results
              </Button>
            </div>
            <ComplianceResults 
              results={complianceResults} 
              onViewDetails={handleViewDetails}
            />
          </div>
        )
      
      case "chat":
        return (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">AI Compliance Assistant</h1>
              <p className="text-muted-foreground">
                Get instant help with compliance questions and document analysis.
              </p>
            </div>
            <div className="max-w-4xl">
              <ChatInterface onSendMessage={handleSendMessage} />
            </div>
          </div>
        )
      
      case "analytics":
        return (
          <div className="p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Analytics & Insights</h1>
              <p className="text-muted-foreground">
                Track compliance trends and analyze your organization's performance.
              </p>
            </div>
            <AnalyticsOverview 
              data={{
                totalDocuments: 47,
                complianceRate: 83,
                regionBreakdown: [
                  { region: "EU (GDPR)", count: 23, complianceRate: 78 },
                  { region: "US (CCPA)", count: 15, complianceRate: 91 },
                  { region: "UK (DPA)", count: 9, complianceRate: 85 }
                ],
                timeSeriesData: [
                  { date: "2024-08-26", compliant: 12, nonCompliant: 3 },
                  { date: "2024-08-27", compliant: 8, nonCompliant: 2 },
                  { date: "2024-08-28", compliant: 15, nonCompliant: 4 },
                  { date: "2024-08-29", compliant: 11, nonCompliant: 1 },
                  { date: "2024-08-30", compliant: 9, nonCompliant: 2 }
                ],
                topViolations: [
                  { rule: "Data Retention Period", count: 8, severity: "medium" },
                  { rule: "Right to Deletion", count: 6, severity: "high" },
                  { rule: "Consumer Rights Notice", count: 4, severity: "low" }
                ]
              }}
            />
          </div>
        )
      
      case "settings":
        return (
          <div className="p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Configure your compliance dashboard preferences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Organization Name</label>
                    <p className="text-sm text-muted-foreground mt-1">ACME Corporation</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Primary Region</label>
                    <p className="text-sm text-muted-foreground mt-1">European Union (GDPR)</p>
                  </div>
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Compliance Alerts</span>
                    <span className="text-sm text-success">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Weekly Reports</span>
                    <span className="text-sm text-success">Enabled</span>
                  </div>
                  <Button variant="outline" size="sm">Manage Notifications</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">API Endpoint</label>
                    <p className="text-sm text-muted-foreground mt-1">https://api.compliance.local</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Model Version</label>
                    <p className="text-sm text-muted-foreground mt-1">ComplianceAI v2.1</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-3 h-3 mr-1" />
                    Advanced Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <LogOut className="w-3 h-3 mr-1" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return <DashboardOverview onNavigateToSection={setActiveSection} />
    }
  }

  return (
    <SidebarLayout
      sidebar={
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      }
    >
      {renderMainContent()}
    </SidebarLayout>
  )
}