import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, FileText, Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  totalDocuments: number
  complianceRate: number
  regionBreakdown: { region: string; count: number; complianceRate: number }[]
  timeSeriesData: { date: string; compliant: number; nonCompliant: number }[]
  topViolations: { rule: string; count: number; severity: string }[]
}

interface AnalyticsOverviewProps {
  data: AnalyticsData
  className?: string
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--destructive))"]

export function AnalyticsOverview({ data, className }: AnalyticsOverviewProps) {
  const complianceChange = 5.2 // Mock percentage change

  return (
    <div className={cn("space-y-6", className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold text-foreground">{data.totalDocuments}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{data.complianceRate}%</p>
                  <Badge className={cn(
                    "text-xs",
                    complianceChange > 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                  )}>
                    {complianceChange > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(complianceChange)}%
                  </Badge>
                </div>
              </div>
              <Shield className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
                <p className="text-2xl font-bold text-foreground">
                  {data.topViolations.reduce((sum, v) => sum + v.count, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trends */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Compliance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="compliant" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Compliant"
                />
                <Line 
                  type="monotone" 
                  dataKey="nonCompliant" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Non-compliant"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.regionBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, count }) => `${region}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.regionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Violations & Regional Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Top Compliance Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topViolations.map((violation, index) => (
                <div key={violation.rule} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{violation.rule}</p>
                      <p className="text-sm text-muted-foreground">{violation.count} occurrences</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    violation.severity === "high" ? "text-destructive bg-destructive/10" :
                    violation.severity === "medium" ? "text-warning bg-warning/10" :
                    "text-muted-foreground bg-muted"
                  )}>
                    {violation.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Regional Compliance Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.regionBreakdown} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Compliance Rate"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Bar dataKey="complianceRate" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}