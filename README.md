# ComplianceAI - Geo Compliance Dashboard

A modern React-based frontend for the geo-compliance-classifier backend, providing an intuitive interface for document compliance analysis, AI-powered chat assistance, and comprehensive analytics.

## 🚀 Features

- **Document Management**: Upload and process documents (PDF, DOC, DOCX, TXT)
- **AI Compliance Analysis**: Automated compliance checking across different regions (GDPR, CCPA, DPA)
- **Interactive Chat Interface**: AI assistant for compliance guidance and document analysis
- **Real-time Analytics**: Comprehensive dashboards with compliance trends and insights
- **Multi-region Support**: Handle compliance requirements for EU, US, UK, and other regions
- **Professional UI**: Modern design with dark/light mode support and responsive layout

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom design system
- **Shadcn/ui** components for consistent UI
- **React Query** for API state management
- **Recharts** for data visualization
- **React Router** for navigation

### Backend Integration
Connects to your geo-compliance-classifier backend with:
- **LLM Integration**: Chat interface powered by your language model
- **RAG System**: Document retrieval and analysis
- **MCP Server**: Model Context Protocol implementation
- **Compliance Engine**: Regional compliance checking

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── sidebar-layout.tsx  # Custom layout component
│   │   └── ...
│   └── dashboard/              # Dashboard-specific components
│       ├── sidebar.tsx         # Navigation sidebar
│       ├── document-upload.tsx # File upload with drag & drop
│       ├── chat-interface.tsx  # AI chat assistant
│       ├── compliance-results.tsx # Results display
│       ├── analytics-overview.tsx # Charts and metrics
│       └── dashboard-overview.tsx # Main dashboard view
├── pages/
│   ├── Dashboard.tsx           # Main dashboard page
│   └── Index.tsx               # Entry point
├── services/
│   └── api.ts                  # API service layer
├── hooks/                      # Custom React hooks
├── lib/
│   └── utils.ts               # Utility functions
└── index.css                  # Design system & Tailwind config
```

## 🔧 Backend API Integration

### Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com'     // Your production URL
  : 'http://localhost:8000'             // Your local backend URL
```

### Expected API Endpoints

The frontend expects these endpoints from your backend:

#### Document Management
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents` - List uploaded documents

#### Compliance Analysis
- `POST /api/compliance/check` - Run compliance analysis
- `GET /api/compliance/results` - Get compliance results

#### AI Chat/LLM
- `POST /api/chat` - Send messages to AI assistant

#### RAG System
- `POST /api/rag/search` - Search documents
- `POST /api/rag/embeddings` - Get text embeddings

#### Analytics
- `GET /api/analytics` - Get dashboard analytics

#### Health Check
- `GET /api/health` - Backend health status

### Request/Response Examples

#### Document Upload
```typescript
// Request
POST /api/documents/upload
Content-Type: multipart/form-data
Body: FormData with 'file' field

// Response
{
  "documentId": "doc_123",
  "message": "Document uploaded successfully"
}
```

#### Compliance Check
```typescript
// Request
POST /api/compliance/check
{
  "documentId": "doc_123",
  "region": "EU (GDPR)"
}

// Response
{
  "id": "check_456",
  "documentId": "doc_123",
  "region": "EU (GDPR)",
  "overallScore": 85,
  "status": "compliant",
  "violations": [
    {
      "id": "v1",
      "rule": "Data Retention Period",
      "severity": "medium",
      "description": "...",
      "suggestion": "..."
    }
  ],
  "checkedAt": "2024-08-30T10:00:00Z"
}
```

#### Chat Message
```typescript
// Request
POST /api/chat
{
  "message": "What are GDPR requirements for data retention?",
  "context": {
    "documentIds": ["doc_123"],
    "previousMessages": [...]
  }
}

// Response
{
  "response": "According to GDPR, data retention periods...",
  "sources": ["regulation_article_5", "doc_123"]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Your geo-compliance-classifier backend running

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API configuration in `src/services/api.ts`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080)

### Development Mode

The app includes mock API responses for development. To use real backend:

1. Replace `mockApiService` calls with `apiService` in components
2. Ensure your backend is running and accessible
3. Update CORS settings in your backend to allow frontend requests

## 🎨 Design System

The app uses a custom design system with:

### Colors
- `--primary`: Deep blue for primary actions and branding
- `--accent`: Green for success states and positive actions  
- `--warning`: Amber for warnings and attention
- `--destructive`: Red for errors and negative actions
- `--success`: Green for successful operations

### Components
- Professional card layouts with subtle shadows
- Consistent spacing and typography
- Interactive elements with hover states
- Responsive design for all screen sizes

### Customization

Modify colors and styles in:
- `src/index.css` - CSS variables and design tokens
- `tailwind.config.ts` - Tailwind theme configuration

## 🔄 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Set these in your production environment:
- Update `BASE_URL` in `src/services/api.ts`
- Configure any authentication tokens or API keys

### Hosting Options

The built app is a static site that can be deployed to:
- Vercel, Netlify, or similar static hosting
- AWS S3 + CloudFront
- Your own web server

## 🧪 Development Notes

### Mock Data
- The app includes realistic mock data for development
- Switch to real API by updating service calls in component files
- Remove `mockApiService` when connecting to production backend

### Error Handling
- Toast notifications for user feedback
- Graceful fallbacks for API failures
- Loading states for better UX

### Performance
- React Query for efficient API caching
- Lazy loading for heavy components
- Optimized bundle size with tree shaking

## 🤝 Backend Integration Checklist

- [ ] Update API base URL in `src/services/api.ts`
- [ ] Implement required API endpoints in your backend
- [ ] Configure CORS to allow frontend requests
- [ ] Test file upload functionality
- [ ] Verify LLM chat integration
- [ ] Test compliance analysis workflow
- [ ] Validate analytics data format
- [ ] Set up error handling and logging

## 📝 License

This project is built for integration with your geo-compliance-classifier backend. Refer to your backend project's license terms.

## 🆘 Support

For questions about the frontend implementation or integration:
1. Check the component documentation in code comments
2. Review the API service layer in `src/services/api.ts`
3. Test with mock data first, then integrate with real backend
4. Ensure your backend implements the expected API contract

---

**Ready to deploy!** This compliance dashboard provides a professional, feature-rich interface for your geo-compliance-classifier backend. The modular architecture makes it easy to extend and customize for your specific requirements.