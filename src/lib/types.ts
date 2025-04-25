export interface Analysis {
  id: string
  agent: string
  title: string
  date: string
  status: 'completed' | 'in_progress' | 'failed'
  preview: string
}

export interface AnalysisResult {
  id: string
  agent: string
  title: string
  date: string
  status: 'completed' | 'in_progress' | 'failed'
  content: string
  metadata: {
    repository?: string
    branch?: string
    commitHash?: string
    files?: string[]
  }
}

export interface Agent {
  id: string
  name: string
  description: string
  type: 'heuristic' | 'security' | 'performance' | 'custom'
  isActive: boolean
  lastRun?: string
  configuration?: Record<string, unknown>
} 