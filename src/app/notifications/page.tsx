"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react'

const mockNotifications = [
  {
    id: '1',
    type: 'success',
    title: 'Análise concluída',
    message: 'Sua análise de heurísticas foi finalizada com sucesso',
    date: '2024-04-25T10:30:00',
    read: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Atenção',
    message: 'Identificamos alguns pontos críticos na sua interface',
    date: '2024-04-24T15:45:00',
    read: true
  },
  {
    id: '3',
    type: 'info',
    title: 'Novo padrão disponível',
    message: 'Um novo padrão de UX foi adicionado à biblioteca',
    date: '2024-04-23T09:15:00',
    read: true
  }
]

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />
    default:
      return <Bell className="h-5 w-5 text-primary" />
  }
}

export default function NotificationsPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground mt-2">
            Fique por dentro de todas as atualizações
          </p>
        </div>

        <div className="space-y-4">
          {mockNotifications.map((item) => (
            <Card key={item.id} className={!item.read ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                  {!item.read && (
                    <Badge variant="secondary">Novo</Badge>
                  )}
                </div>
                <CardDescription>
                  {new Date(item.date).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{item.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
} 