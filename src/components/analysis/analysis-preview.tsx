"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AnalysisFormData, AnalysisResult } from '@/types/analysis'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface AnalysisPreviewProps {
  formData: AnalysisFormData;
  onProceed: () => void;
  onCancel: () => void;
}

export function AnalysisPreview({ formData, onProceed, onCancel }: AnalysisPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [previewResult, setPreviewResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Realizar preview ao montar o componente
  useState(() => {
    const fetchPreview = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Converter as primeiras 1-2 imagens para base64
        const imagesToAnalyze = formData.images.slice(0, 2)
        const imageBase64Promises = imagesToAnalyze.map(img => 
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
            preview: true
          }),
        })

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`)
        }

        const result = await response.json()
        setPreviewResult(result)
      } catch (err: any) {
        console.error('Erro ao obter preview:', err)
        setError(err.message || 'Erro ao realizar preview da análise')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPreview()
  }, [])

  const getQualityColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case 'alta':
        return 'text-green-500'
      case 'média':
        return 'text-amber-500'
      case 'baixa':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Preview da Análise</CardTitle>
        <CardDescription>
          Análise preliminar baseada nas primeiras imagens do fluxo
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Gerando preview...</span>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Qualidade estimada:</span>
                <span className={`text-sm font-bold ${getQualityColor(previewResult?.estimatedQuality || '')}`}>
                  {previewResult?.estimatedQuality || 'Não disponível'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Custo da análise completa:</span>
                <span className="text-sm font-bold">
                  {previewResult?.fullAnalysisCost || formData.images.length} imagens
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Análise preliminar:</h3>
              <p className="text-sm whitespace-pre-line">
                {previewResult?.analysis || 'Não foi possível gerar uma análise preliminar.'}
              </p>
            </div>
            
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Preview concluído</AlertTitle>
              <AlertDescription>
                Esta é apenas uma análise preliminar. A análise completa examinará todas as imagens do fluxo e fornecerá um relatório detalhado com pontuações por heurística.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={onProceed} disabled={isLoading || !!error}>
          Prosseguir com análise completa
        </Button>
      </CardFooter>
    </Card>
  )
}
