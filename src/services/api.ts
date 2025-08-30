// API service for connecting to the geo-compliance-classifier backend
// Update the BASE_URL to match your backend deployment

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-backend-url.com' 
  : 'http://localhost:8000'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  }

  // Document processing endpoints
  async uploadDocument(file: File): Promise<{ documentId: string; message: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  async getDocuments(): Promise<{
    id: string
    name: string
    uploadedAt: string
    size: number
    status: string
  }[]> {
    return this.request('/api/documents')
  }

  // Compliance checking endpoints
  async checkCompliance(documentId: string, region?: string): Promise<{
    id: string
    documentId: string
    region: string
    overallScore: number
    status: 'compliant' | 'non-compliant' | 'warning'
    violations: {
      id: string
      rule: string
      severity: 'high' | 'medium' | 'low'
      description: string
      suggestion: string
    }[]
    checkedAt: string
  }> {
    return this.request('/api/compliance/check', {
      method: 'POST',
      body: JSON.stringify({ documentId, region }),
    })
  }

  async getComplianceResults(documentId?: string): Promise<{
    id: string
    documentName: string
    region: string
    overallScore: number
    status: 'compliant' | 'non-compliant' | 'warning'
    violations: {
      id: string
      rule: string
      severity: 'high' | 'medium' | 'low'
      description: string
      suggestion: string
    }[]
    checkedAt: string
  }[]> {
    const endpoint = documentId 
      ? `/api/compliance/results?documentId=${documentId}`
      : '/api/compliance/results'
    return this.request(endpoint)
  }

  // Chat/LLM endpoints
  async sendChatMessage(message: string, context?: {
    documentIds?: string[]
    previousMessages?: { role: string; content: string }[]
  }): Promise<{ response: string; sources?: string[] }> {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    })
  }

  // RAG endpoints
  async searchDocuments(query: string, limit: number = 10): Promise<{
    id: string
    content: string
    source: string
    relevanceScore: number
  }[]> {
    return this.request('/api/rag/search', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    })
  }

  async getEmbeddings(text: string): Promise<{ embeddings: number[] }> {
    return this.request('/api/rag/embeddings', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
  }

  // Analytics endpoints
  async getAnalytics(timeRange: 'week' | 'month' | 'year' = 'month'): Promise<{
    totalDocuments: number
    complianceRate: number
    regionBreakdown: { region: string; count: number; complianceRate: number }[]
    timeSeriesData: { date: string; compliant: number; nonCompliant: number }[]
    topViolations: { rule: string; count: number; severity: string }[]
  }> {
    return this.request(`/api/analytics?timeRange=${timeRange}`)
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/api/health')
  }
}

export const apiService = new ApiService()

// Mock data for development - remove when connecting to real backend
export const mockApiService = {
  async uploadDocument(file: File): Promise<{ documentId: string; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      documentId: Math.random().toString(36).substr(2, 9),
      message: 'Document uploaded successfully'
    }
  },

  async sendChatMessage(message: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responses = [
      "I understand you're asking about compliance requirements. Based on the current regulations, here are the key points you should consider...",
      "For document analysis, I can help identify potential compliance issues. The main areas of concern typically include data privacy, regional regulations, and industry-specific requirements.",
      "Let me analyze that for you. Based on the patterns I've seen, this appears to relate to GDPR compliance in the European region. Here are the specific requirements...",
      "That's a great question about regulatory compliance. The key factors to consider are jurisdictional requirements, data handling practices, and documentation standards."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  },

  async getComplianceResults(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return [
      {
        id: "1",
        documentName: "Privacy Policy v2.1.pdf",
        region: "EU (GDPR)",
        overallScore: 78,
        status: "warning" as const,
        checkedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        violations: [
          {
            id: "v1",
            rule: "Data Retention Period",
            severity: "medium" as const,
            description: "Document doesn't specify clear data retention periods for user data",
            suggestion: "Add specific retention periods for different types of personal data"
          },
          {
            id: "v2",
            rule: "Right to Deletion",
            severity: "high" as const,
            description: "Missing clear procedure for users to request data deletion",
            suggestion: "Include detailed steps for data deletion requests and response timeframes"
          }
        ]
      },
      {
        id: "2",
        documentName: "Terms of Service.docx",
        region: "US (CCPA)",
        overallScore: 92,
        status: "compliant" as const,
        checkedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        violations: [
          {
            id: "v3",
            rule: "Consumer Rights Notice",
            severity: "low" as const,
            description: "Consumer rights section could be more prominent",
            suggestion: "Consider adding a dedicated section header for CCPA rights"
          }
        ]
      }
    ]
  },

  async getAnalytics(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      totalDocuments: 47,
      complianceRate: 83,
      regionBreakdown: [
        { region: "EU (GDPR)", count: 23, complianceRate: 78 },
        { region: "US (CCPA)", count: 15, complianceRate: 91 },
        { region: "UK (DPA)", count: 9, complianceRate: 85 }
      ],
      timeSeriesData: [
        { date: "2024-01-01", compliant: 12, nonCompliant: 3 },
        { date: "2024-01-02", compliant: 8, nonCompliant: 2 },
        { date: "2024-01-03", compliant: 15, nonCompliant: 4 },
        { date: "2024-01-04", compliant: 11, nonCompliant: 1 },
        { date: "2024-01-05", compliant: 9, nonCompliant: 2 }
      ],
      topViolations: [
        { rule: "Data Retention Period", count: 8, severity: "medium" },
        { rule: "Right to Deletion", count: 6, severity: "high" },
        { rule: "Consumer Rights Notice", count: 4, severity: "low" }
      ]
    }
  }
}