import { CheckCircle, XCircle, AlertCircle, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ComplianceResult {
  id: string
  documentName: string
  region: string
  overallScore: number
  status: "compliant" | "non-compliant" | "warning"
  checkedAt: Date
  violations: {
    id: string
    rule: string
    severity: "high" | "medium" | "low"
    description: string
    suggestion: string
  }[]
}

interface ComplianceResultsProps {
  results: ComplianceResult[]
  onViewDetails: (id: string) => void
  className?: string
}

export function ComplianceResults({ results, onViewDetails, className }: ComplianceResultsProps) {
  const getStatusIcon = (status: ComplianceResult["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "non-compliant":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />
    }
  }

  const getStatusColor = (status: ComplianceResult["status"]) => {
    switch (status) {
      case "compliant":
        return "text-success bg-success/10"
      case "non-compliant":
        return "text-destructive bg-destructive/10"
      case "warning":
        return "text-warning bg-warning/10"
    }
  }

  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "text-destructive bg-destructive/10"
      case "medium":
        return "text-warning bg-warning/10"
      case "low":
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {results.map((result) => (
        <Card key={result.id} className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5" />
                  {result.documentName}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {result.checkedAt.toLocaleDateString()}
                  </span>
                  <span>Region: {result.region}</span>
                </div>
              </div>
              <Badge className={getStatusColor(result.status)}>
                {getStatusIcon(result.status)}
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Compliance Score</span>
                <span className="text-muted-foreground">{result.overallScore}%</span>
              </div>
              <Progress value={result.overallScore} className="h-2" />
            </div>

            {result.violations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Issues Found</h4>
                <div className="space-y-2">
                  {result.violations.slice(0, 3).map((violation) => (
                    <div key={violation.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-sm text-foreground">{violation.rule}</p>
                        <Badge className={cn("text-xs", getSeverityColor(violation.severity))}>
                          {violation.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {violation.description}
                      </p>
                      <p className="text-xs text-accent">
                        <strong>Suggestion:</strong> {violation.suggestion}
                      </p>
                    </div>
                  ))}
                  {result.violations.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{result.violations.length - 3} more issues
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(result.id)}
              >
                View Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {results.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-2">No compliance results yet</h3>
            <p className="text-sm text-muted-foreground text-center">
              Upload documents and run compliance checks to see results here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}