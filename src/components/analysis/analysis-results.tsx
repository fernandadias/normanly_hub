"use client"

import { useState } from 'react'
import { AnalysisResult, HeuristicResult, HeuristicIssue, AnalysisFormData } from '@/types/analysis'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormSummary } from '@/components/analysis/form-summary'
import { AlertCircle, CheckCircle, XCircle, ArrowLeft, ArrowRight, Download } from 'lucide-react'

interface AnalysisResultsProps {
  formData: AnalysisFormData
  results: AnalysisResult
  onReset: () => void
}

export function AnalysisResults({ formData, results, onReset }: AnalysisResultsProps) {
  const [selectedHeuristic, setSelectedHeuristic] = useState<string | null>(
    results.heuristics && results.heuristics.length > 0 ? results.heuristics[0].id : null
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  // Preparar imagens para visualização
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    return formData.images.map(img => URL.createObjectURL(img.file))
  })

  // Encontrar a heurística selecionada
  const currentHeuristic = results.heuristics?.find(h => h.id === selectedHeuristic) || null

  // Filtrar problemas para a imagem atual
  const currentImageIssues = currentHeuristic?.issues.filter(
    issue => issue.imageIndex === selectedImageIndex
  ) || []

  // Função para exportar o relatório como PDF (placeholder)
  const exportReport = () => {
    alert('Funcionalidade de exportação será implementada em breve!')
  }

  // Função para renderizar marcadores nas imagens
  const renderMarkers = (issues: HeuristicIssue[]) => {
    return issues.map((issue, index) => (
      <div
        key={index}
        className="absolute w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full border-2 border-white text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:z-10"
        style={{
          left: `${issue.coordinates.x}%`,
          top: `${issue.coordinates.y}%`,
          zIndex: 5
        }}
        title={issue.description}
      >
        {index + 1}
      </div>
    ))
  }

  // Função para obter a cor baseada na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 5) return 'text-amber-500'
    return 'text-red-500'
  }

  // Função para obter a cor da barra de progresso
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resultados da Análise</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Nova Análise
          </Button>
          <Button size="sm" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <FormSummary data={formData} />

      <Card>
        <CardHeader>
          <CardTitle>Pontuação Geral</CardTitle>
          <CardDescription>
            Avaliação geral da usabilidade baseada nas heurísticas de Nielsen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold mb-4 flex items-center gap-2">
              <span className={getScoreColor(results.overallScore || 0)}>
                {results.overallScore || 0}
              </span>
              <span className="text-base text-muted-foreground">/100</span>
            </div>
            <Progress 
              value={results.overallScore} 
              max={100} 
              className={`w-full h-2 ${getProgressColor(results.overallScore || 0)}`} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Heurísticas</CardTitle>
              <CardDescription>
                Selecione uma heurística para ver detalhes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.heuristics?.map(heuristic => (
                  <div
                    key={heuristic.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedHeuristic === heuristic.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedHeuristic(heuristic.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{heuristic.name}</span>
                      <Badge variant={heuristic.score >= 7 ? 'default' : heuristic.score >= 4 ? 'outline' : 'destructive'}>
                        {heuristic.score}/10
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs">
                      {heuristic.issues.length} {heuristic.issues.length === 1 ? 'problema' : 'problemas'} identificados
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{currentHeuristic?.name || 'Selecione uma heurística'}</CardTitle>
              <CardDescription>
                {currentHeuristic?.description || ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentHeuristic ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Pontuação:</span>
                      <span className={`font-bold ${getScoreColor(currentHeuristic.score)}`}>
                        {currentHeuristic.score}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                        disabled={selectedImageIndex === 0}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Imagem {selectedImageIndex + 1} de {formData.images.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImageIndex(Math.min(formData.images.length - 1, selectedImageIndex + 1))}
                        disabled={selectedImageIndex === formData.images.length - 1}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <img
                      src={imageUrls[selectedImageIndex]}
                      alt={`Imagem ${selectedImageIndex + 1}`}
                      className="w-full h-auto rounded-md border"
                    />
                    {renderMarkers(currentImageIssues)}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Problemas Identificados</h3>
                    {currentImageIssues.length > 0 ? (
                      currentImageIssues.map((issue, index) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-red-500 text-white rounded-full text-xs font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{issue.description}</p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                <span className="font-medium">Recomendação:</span> {issue.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Nenhum problema identificado nesta imagem para esta heurística.</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Selecione uma heurística para ver os detalhes
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
