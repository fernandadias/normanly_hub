"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Wizard } from '@/components/agents/wizard'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ImageUpload } from '@/components/analysis/image-upload'
import { FormSummary } from '@/components/analysis/form-summary'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BUSINESS_MODEL_OPTIONS,
  ACTION_TYPE_OPTIONS,
  FLOW_TYPE_OPTIONS,
  DEVICE_OPTIONS
} from '@/constants/analysis-options'
import { AnalysisFormData, ValidationErrors } from '@/types/analysis'

export default function HeuristicsPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<AnalysisFormData>({
    images: [],
    businessModel: '',
    actionType: '',
    flowType: '',
    device: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (formData.images.length === 0) {
      newErrors.images = 'Por favor, faça upload de pelo menos uma imagem'
    }
    if (!formData.businessModel) {
      newErrors.businessModel = 'Campo obrigatório'
    }
    if (!formData.actionType) {
      newErrors.actionType = 'Campo obrigatório'
    }
    if (!formData.flowType) {
      newErrors.flowType = 'Campo obrigatório'
    }
    if (!formData.device) {
      newErrors.device = 'Campo obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAnalysis = async () => {
    if (!validateForm()) return

    setIsAnalyzing(true)
    try {
      // TODO: Implementar integração com backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      setAnalysisResults({
        visibility: { status: 'pass', recommendation: 'Adicionar indicador de progresso durante o upload da imagem.' },
        systemMatch: { status: 'fail', recommendation: 'Revisar os termos técnicos usados nos campos de input.' }
      })
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao processar a análise. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const steps = [
    {
      title: 'Informações da Interface',
      description: 'Forneça os detalhes da interface que você deseja analisar',
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Upload das Interfaces</Label>
            <ImageUpload
              images={formData.images}
              onChange={(images) => {
                setFormData({ ...formData, images })
                setErrors({ ...errors, images: undefined })
              }}
            />
            {errors.images && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.images}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label>Modelo de Negócio</Label>
            <Select
              value={formData.businessModel}
              onValueChange={(value) => {
                setFormData({ ...formData, businessModel: value })
                setErrors({ ...errors, businessModel: undefined })
              }}
            >
              <SelectTrigger className={errors.businessModel ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o modelo de negócio" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_MODEL_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessModel && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.businessModel}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo de Ação</Label>
            <Select
              value={formData.actionType}
              onValueChange={(value) => {
                setFormData({ ...formData, actionType: value })
                setErrors({ ...errors, actionType: undefined })
              }}
            >
              <SelectTrigger className={errors.actionType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o tipo de ação" />
              </SelectTrigger>
              <SelectContent>
                {ACTION_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.actionType && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.actionType}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo de Fluxo</Label>
            <Select
              value={formData.flowType}
              onValueChange={(value) => {
                setFormData({ ...formData, flowType: value })
                setErrors({ ...errors, flowType: undefined })
              }}
            >
              <SelectTrigger className={errors.flowType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o tipo de fluxo" />
              </SelectTrigger>
              <SelectContent>
                {FLOW_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.flowType && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.flowType}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label>Dispositivo</Label>
            <Select
              value={formData.device}
              onValueChange={(value) => {
                setFormData({ ...formData, device: value })
                setErrors({ ...errors, device: undefined })
              }}
            >
              <SelectTrigger className={errors.device ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o dispositivo" />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.device && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.device}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button 
            onClick={handleAnalysis}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analisando...' : 'Iniciar Análise'}
          </Button>
        </div>
      ),
    },
    {
      title: 'Resultado da Análise',
      description: 'Veja as recomendações baseadas nas heurísticas de Nielsen',
      content: (
        <div className="space-y-6">
          {analysisResults ? (
            <>
              <FormSummary data={formData} />
              
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">1. Visibilidade do Status do Sistema</h3>
                <p className="text-muted-foreground mt-2">
                  O sistema deve manter os usuários informados sobre o que está acontecendo, através de feedback apropriado dentro de um tempo razoável.
                </p>
                <div className="mt-4">
                  <div className="text-sm font-medium">
                    Status: {analysisResults.visibility.status === 'pass' ? 'Aprovado' : 'Reprovado'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Recomendação: {analysisResults.visibility.recommendation}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">2. Correspondência entre o Sistema e o Mundo Real</h3>
                <p className="text-muted-foreground mt-2">
                  O sistema deve falar a linguagem dos usuários, com palavras, frases e conceitos familiares ao usuário, em vez de termos orientados ao sistema.
                </p>
                <div className="mt-4">
                  <div className="text-sm font-medium">
                    Status: {analysisResults.systemMatch.status === 'pass' ? 'Aprovado' : 'Reprovado'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Recomendação: {analysisResults.systemMatch.recommendation}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Realize a análise para ver os resultados
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <MainLayout>
      <Wizard steps={steps} />
    </MainLayout>
  )
} 