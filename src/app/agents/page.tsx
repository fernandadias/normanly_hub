import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Lock } from 'lucide-react'
import Link from 'next/link'

const agents = [
  {
    id: 'heuristics',
    title: 'Análise de Heurísticas',
    description: 'Analise interfaces com base nas 10 heurísticas de Nielsen',
    category: 'padrões',
    isBeta: true,
    isPremium: false,
  },
  {
    id: 'patterns',
    title: 'Patterns de UX/UI',
    description: 'Banco de padrões de produtos digitais',
    category: 'padrões',
    isBeta: false,
    isPremium: true,
  },
  {
    id: 'core-action',
    title: 'Definição de Core Action',
    description: 'Ajuda a definir a ação principal do seu produto',
    category: 'estratégia',
    isBeta: false,
    isPremium: false,
  },
  {
    id: 'comparison',
    title: 'Confronto de Ideias',
    description: 'Compare diferentes soluções para um problema',
    category: 'argumentação',
    isBeta: true,
    isPremium: true,
  },
]

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'padrões', label: 'Padrões' },
  { id: 'estratégia', label: 'Estratégia' },
  { id: 'argumentação', label: 'Argumentação' },
]

export default function AgentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hub de Agentes</h1>
          <p className="text-muted-foreground mt-2">
            Escolha um agente para começar sua análise
          </p>
        </div>

        <div className="flex gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant="outline"
              className="cursor-pointer hover:bg-accent"
            >
              {category.label}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link href={`/agents/${agent.id}`} key={agent.id}>
              <Card className={`${agent.isPremium ? 'opacity-50' : ''} hover:bg-accent/50 transition-colors`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {agent.title}
                    </CardTitle>
                    {agent.isPremium && <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{agent.category}</Badge>
                    {agent.isBeta && <Badge variant="outline">Beta</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  )
} 