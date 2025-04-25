"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useState } from 'react'

const mockPatterns = [
  {
    id: '1',
    title: 'Onboarding Progressivo',
    description: 'Mostra como implementar um onboarding que revela funcionalidades gradualmente',
    category: 'Onboarding',
    example: 'https://example.com/onboarding.png',
    bestPractices: [
      'Comece com o essencial',
      'Use tooltips contextuais',
      'Permita pular etapas',
      'Mantenha o progresso salvo'
    ]
  },
  {
    id: '2',
    title: 'Feedback em Tempo Real',
    description: 'Padrão para mostrar feedback imediato das ações do usuário',
    category: 'Feedback',
    example: 'https://example.com/feedback.png',
    bestPractices: [
      'Use micro-animações',
      'Mantenha o feedback próximo à ação',
      'Seja específico no feedback',
      'Use cores apropriadas'
    ]
  },
  {
    id: '3',
    title: 'Navegação Contextual',
    description: 'Como implementar uma navegação que se adapta ao contexto do usuário',
    category: 'Navegação',
    example: 'https://example.com/navigation.png',
    bestPractices: [
      'Mostre opções relevantes',
      'Mantenha o histórico visível',
      'Permita personalização',
      'Use breadcrumbs'
    ]
  }
]

export default function PatternsPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)

    // Simulando resposta do assistente
    setTimeout(() => {
      const relevantPatterns = mockPatterns.filter(pattern => 
        pattern.title.toLowerCase().includes(userMessage.toLowerCase()) ||
        pattern.description.toLowerCase().includes(userMessage.toLowerCase()) ||
        pattern.category.toLowerCase().includes(userMessage.toLowerCase())
      )

      const response = relevantPatterns.length > 0
        ? `Encontrei ${relevantPatterns.length} padrões relevantes para sua busca:\n\n${relevantPatterns.map(pattern => `
**${pattern.title}** (${pattern.category})
${pattern.description}

Melhores práticas:
${pattern.bestPractices.map(practice => `- ${practice}`).join('\n')}
`).join('\n\n')}`
        : 'Não encontrei padrões específicos para sua busca. Tente ser mais específico ou explorar outras categorias.'

      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patterns de UX/UI</h1>
          <p className="text-muted-foreground mt-2">
            Descreva o que você está procurando e encontre os melhores padrões para seu caso
          </p>
        </div>

        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary/10 ml-auto max-w-[80%]'
                  : 'bg-card max-w-[90%]'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="p-4 rounded-lg bg-card max-w-[90%]">
              <p>Pensando...</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Como implementar um bom onboarding?"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </MainLayout>
  )
} 