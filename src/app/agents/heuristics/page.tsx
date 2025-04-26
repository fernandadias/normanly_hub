"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Wizard } from '@/components/agents/wizard'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ImageUpload } from '@/components/analysis/image-upload'
import { FormSummary } from '@/components/analysis/form-summary'
import { AnalysisPreview } from '@/components/analysis/analysis-preview'
import { AnalysisResults } from '@/components/analysis/analysis-results'
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
import { AnalysisFormData, ValidationErrors, BusinessModel, ActionType, FlowType, DeviceType, AnalysisResult } from '@/types/analysis'

export default function HeuristicsPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<AnalysisFormData>({
    images: [],
    businessModel: 'marketplace' as BusinessModel,
    actionType: 'signup_login' as ActionType,
    flowType: 'main_success' as FlowType,
    device: 'web' as DeviceType
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

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

  const handlePreview = () => {
    if (!validateForm()) return
    setShowPreview(true)
  }

  const handleAnalysis = async () => {
    if (!validateForm()) return

    setIsAnalyzing(true)
    try {
      // Converter imagens para base64
      const imageBase64Promises = formData.images.map(img => 
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(img.file)
        })
      )
      
      const imageBase64Array = await Promise.all(imageBase64Promises)
      
      // Enviar para a API
      const response = await fetch('/api/heuristics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: imageBase64Array,
          businessModel: formData.businessModel,
          actionType: formData.actionType,
          flowType: formData.flowType,
          device: formData.device,
          preview: false
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const result = await response.json()
      setAnalysisResults(result)
      setCurrentStep(1)
    } catch (error: any) {
      toast({
        title: "Erro na análise",
        description: error.message || "Ocorreu um erro ao processar a análise. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
      setShowPreview(false)
    }
  }

  const resetAnalysis = () => {
    setFormData({
      images: [],
      businessModel: 'marketplace',
      actionType: 'signup_login',
      flowType: 'main_success',
      device: 'web'
    })
    setErrors({})
    setAnalysisResults(null)
    setCurrentStep(0)
    setShowPreview(false)
  }

  const steps = [
    {
      title: 'Informações da Interface',
      description: 'Forneça os detalhes da interface que você deseja analisar',
      content: (
        <div className="space-y-8">
          {showPreview ? (
            <AnalysisPreview 
              formData={formData}
              onProceed={handleAnalysis}
              onCancel={() => setShowPreview(false)}
            />
          ) : (
            <>
              <div className="space-y-4">
                <Label className="text-lg font-medium">Upload das Interfaces</Label>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => {
                    setFormData({ ...formData, images })
                    setErrors({ ...errors, images: undefined })
                  }}
                  maxImages={7}
                />
                {errors.images && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.images}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <Label className="text-base">Modelo de Negócio</Label>
                  <Select
                    value={formData.businessModel}
                    onValueChange={(value: BusinessModel) => {
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

                <div className="space-y-3">
                  <Label className="text-base">Tipo de Ação</Label>
                  <Select
                    value={formData.actionType}
                    onValueChange={(value: ActionType) => {
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

                <div className="space-y-3">
                  <Label className="text-base">Tipo de Fluxo</Label>
                  <Select
                    value={formData.flowType}
                    onValueChange={(value: FlowType) => {
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

                <div className="space-y-3">
                  <Label className="text-base">Dispositivo</Label>
                  <Select
                    value={formData.device}
                    onValueChange={(value: DeviceType) => {
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
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handlePreview}
                  disabled={isAnalyzing || formData.images.length === 0}
                  variant="outline"
                  className="w-full"
                >
                  Preview Gratuito
                </Button>
                <Button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || formData.images.length === 0}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisando...
                    </>
                  ) : 'Iniciar Análise Completa'}
                </Button>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      title: 'Resultado da Análise',
      description: 'Veja as recomendações baseadas nas heurísticas de Nielsen',
      content: (
        analysisResults ? (
          <AnalysisResults 
            formData={formData}
            results={analysisResults}
            onReset={resetAnalysis}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando resultados...</span>
          </div>
        )
      )
    }
  ]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Análise Heurística</h1>
          <p className="text-gray-600">Analise sua interface com base em princípios de usabilidade</p>
        </div>

        <Wizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
      </div>
    </MainLayout>
  )
}
