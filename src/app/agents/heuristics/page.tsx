"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { Wizard } from '@/components/agents/wizard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'

const steps = [
  {
    title: 'Informações da Interface',
    description: 'Forneça os detalhes da interface que você deseja analisar',
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Upload da Interface</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="interface-upload"
            />
            <label
              htmlFor="interface-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-muted-foreground">
                Arraste uma imagem ou clique para selecionar
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Modelo de Negócio</Label>
          <Input
            placeholder="Ex: Marketplace, SaaS, Rede Social..."
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Ação</Label>
          <Input
            placeholder="Ex: Cadastro, Onboarding, Consumo de Conteúdo..."
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Fluxo</Label>
          <Input
            placeholder="Ex: Sucesso, Erro, Alternativo..."
          />
        </div>
      </div>
    ),
  },
  {
    title: 'Resultado da Análise',
    description: 'Veja as recomendações baseadas nas heurísticas de Nielsen',
    content: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">1. Visibilidade do Status do Sistema</h3>
          <p className="text-muted-foreground mt-2">
            O sistema deve manter os usuários informados sobre o que está acontecendo, através de feedback apropriado dentro de um tempo razoável.
          </p>
          <div className="mt-4">
            <div className="text-sm font-medium">Status: Pass</div>
            <div className="text-sm text-muted-foreground mt-2">
              Recomendação: Adicionar indicador de progresso durante o upload da imagem.
            </div>
          </div>
        </div>

        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">2. Correspondência entre o Sistema e o Mundo Real</h3>
          <p className="text-muted-foreground mt-2">
            O sistema deve falar a linguagem dos usuários, com palavras, frases e conceitos familiares ao usuário, em vez de termos orientados ao sistema.
          </p>
          <div className="mt-4">
            <div className="text-sm font-medium">Status: Fail</div>
            <div className="text-sm text-muted-foreground mt-2">
              Recomendação: Revisar os termos técnicos usados nos campos de input.
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function HeuristicsPage() {
  return (
    <MainLayout>
      <Wizard steps={steps} />
    </MainLayout>
  )
} 