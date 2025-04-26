"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, PlusCircle, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CoreActionFormData, ValidationErrors, CoreActionResult, CoreActionDimension } from '@/types/coreaction'
import { Badge } from '@/components/ui/badge'

export default function CoreActionPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<CoreActionFormData>({
    productName: '',
    productDescription: '',
    targetAudience: '',
    businessModel: '',
    currentActions: []
  })
  const [newAction, setNewAction] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CoreActionResult | null>(null)

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.productName.trim()) {
      newErrors.productName = 'Por favor, informe o nome do produto'
    }
    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Por favor, descreva o produto'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddAction = () => {
    if (!newAction.trim()) return
    
    setFormData({
      ...formData,
      currentActions: [...(formData.currentActions || []), newAction.trim()]
    })
    setNewAction('')
  }

  const handleRemoveAction = (index: number) => {
    const updatedActions = [...(formData.currentActions || [])]
    updatedActions.splice(index, 1)
    setFormData({
      ...formData,
      currentActions: updatedActions
    })
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/coreaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const result = await response.json()
      setResult(result)
    } catch (error: any) {
      toast({
        title: "Erro ao identificar Core Action",
        description: error.message || "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      productName: '',
      productDescription: '',
      targetAudience: '',
      businessModel: '',
      currentActions: []
    })
    setNewAction('')
    setErrors({})
    setResult(null)
  }

  // Função para obter a cor baseada na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 5) return 'text-amber-500'
    return 'text-red-500'
  }

  // Função para obter a cor da barra de progresso
  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Definição de Core Action</h1>
          <p className="text-gray-600">Identifique a ação principal que gera valor para usuários e negócio, baseado na metodologia Reforge</p>
        </div>

        {result ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Resultado da Análise</h2>
              <Button variant="outline" onClick={resetForm}>
                Nova Análise
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Core Action Identificada</CardTitle>
                <CardDescription>
                  A ação principal que gera valor para usuários e negócio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl font-bold mb-2">{result.coreAction}</div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium">Pontuação Geral:</span>
                    <span className={`text-xl font-bold ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}/10
                    </span>
                  </div>
                  <Progress 
                    value={result.overallScore * 10} 
                    max={100} 
                    className={`w-full h-2 ${getProgressColor(result.overallScore)}`} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avaliação por Dimensão</CardTitle>
                <CardDescription>
                  Análise da Core Action em cada dimensão da metodologia Reforge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.dimensions.map((dimension) => (
                    <div key={dimension.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{dimension.name}</h3>
                        <span className={`font-bold ${getScoreColor(dimension.score || 0)}`}>
                          {dimension.score}/10
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{dimension.description}</p>
                      <Progress 
                        value={(dimension.score || 0) * 10} 
                        max={100} 
                        className={`h-2 ${getProgressColor(dimension.score || 0)}`} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise Detalhada</CardTitle>
                <CardDescription>
                  Explicação completa da Core Action e suas dimensões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line">
                    {result.analysis}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Produto</CardTitle>
                  <CardDescription>
                    Forneça detalhes sobre o produto para identificar a Core Action ideal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Nome do Produto <span className="text-red-500">*</span></Label>
                      <Input
                        id="productName"
                        placeholder="Ex: Spotify, Airbnb, Notion..."
                        value={formData.productName}
                        onChange={(e) => {
                          setFormData({ ...formData, productName: e.target.value })
                          if (errors.productName) setErrors({ ...errors, productName: undefined })
                        }}
                        className={errors.productName ? 'border-destructive' : ''}
                      />
                      {errors.productName && (
                        <Alert variant="destructive" className="mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.productName}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Descrição do Produto <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="productDescription"
                        placeholder="Ex: Um aplicativo de streaming de música que permite aos usuários ouvir milhões de músicas..."
                        rows={4}
                        value={formData.productDescription}
                        onChange={(e) => {
                          setFormData({ ...formData, productDescription: e.target.value })
                          if (errors.productDescription) setErrors({ ...errors, productDescription: undefined })
                        }}
                        className={errors.productDescription ? 'border-destructive' : ''}
                      />
                      {errors.productDescription && (
                        <Alert variant="destructive" className="mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.productDescription}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">Público-alvo (opcional)</Label>
                      <Input
                        id="targetAudience"
                        placeholder="Ex: Profissionais de marketing, estudantes universitários..."
                        value={formData.targetAudience || ''}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessModel">Modelo de Negócio (opcional)</Label>
                      <Input
                        id="businessModel"
                        placeholder="Ex: Assinatura, freemium, marketplace..."
                        value={formData.businessModel || ''}
                        onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ações Candidatas (opcional)</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ex: Criar playlist, enviar mensagem..."
                          value={newAction}
                          onChange={(e) => setNewAction(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddAction()
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddAction}
                          disabled={!newAction.trim()}
                          size="icon"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {formData.currentActions && formData.currentActions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.currentActions.map((action, index) => (
                            <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
                              {action}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1"
                                onClick={() => handleRemoveAction(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Identificando Core Action...
                        </>
                      ) : 'Identificar Core Action'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>O que é Core Action?</CardTitle>
                  <CardDescription>
                    Baseado na metodologia Reforge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <p>
                      A <strong>Core Action</strong> é a ação principal que os usuários realizam em um produto, que gera valor tanto para eles quanto para o negócio.
                    </p>
                    
                    <div>
                      <h3 className="font-medium">Frequência</h3>
                      <p className="mt-1 text-muted-foreground">
                        Com que frequência os usuários realizam esta ação? Ações frequentes têm maior impacto.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Valor</h3>
                      <p className="mt-1 text-muted-foreground">
                        Quanto valor esta ação gera para o usuário e para o negócio?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Efeito de Rede</h3>
                      <p className="mt-1 text-muted-foreground">
                        Esta ação contribui para efeitos de rede ou loops virais?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Defensibilidade</h3>
                      <p className="mt-1 text-muted-foreground">
                        Esta ação cria barreiras competitivas ou aumenta o custo de troca?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Alinhamento</h3>
                      <p className="mt-1 text-muted-foreground">
                        Esta ação está alinhada com os objetivos de longo prazo do negócio?
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <a 
                    href="https://www.reforge.com/blog/growth-loops" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Saiba mais sobre a metodologia Reforge
                  </a>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
