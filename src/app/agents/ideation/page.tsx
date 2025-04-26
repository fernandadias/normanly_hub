"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, Lightbulb } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { IdeationFormData, ValidationErrors, IdeationResult, IdeationFeature } from '@/types/ideation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function IdeationPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<IdeationFormData>({
    currentFeature: '',
    userProblem: '',
    targetAudience: '',
    constraints: '',
    featureCount: 3
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<IdeationResult | null>(null)
  const [activeFeature, setActiveFeature] = useState<number>(0)

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.currentFeature.trim()) {
      newErrors.currentFeature = 'Por favor, descreva a funcionalidade atual'
    }
    if (!formData.userProblem.trim()) {
      newErrors.userProblem = 'Por favor, descreva o problema do usuário'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ideation', {
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
      setActiveFeature(0)
    } catch (error: any) {
      toast({
        title: "Erro ao gerar ideias",
        description: error.message || "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      currentFeature: '',
      userProblem: '',
      targetAudience: '',
      constraints: '',
      featureCount: 3
    })
    setErrors({})
    setResult(null)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Ideação de Novas Features</h1>
          <p className="text-gray-600">Gere ideias inovadoras para novas funcionalidades que melhoram a experiência do usuário</p>
        </div>

        {result ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Ideias Geradas</h2>
              <Button variant="outline" onClick={resetForm}>
                Nova Ideação
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contexto</CardTitle>
                <CardDescription>
                  Informações fornecidas para a geração de ideias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Funcionalidade Atual:</h3>
                    <p className="mt-1">{result.currentFeature}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Problema do Usuário:</h3>
                    <p className="mt-1">{result.userProblem}</p>
                  </div>
                  
                  {result.targetAudience && (
                    <div>
                      <h3 className="font-medium">Público-alvo:</h3>
                      <p className="mt-1">{result.targetAudience}</p>
                    </div>
                  )}
                  
                  {result.constraints && (
                    <div>
                      <h3 className="font-medium">Restrições:</h3>
                      <p className="mt-1">{result.constraints}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Ideias</CardTitle>
                    <CardDescription>
                      Selecione uma ideia para ver detalhes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.features.map((feature, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            activeFeature === index
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setActiveFeature(index)}
                        >
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            <span className="font-medium">{feature.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-3">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{result.features[activeFeature]?.title || 'Selecione uma ideia'}</CardTitle>
                    <CardDescription>
                      Detalhes da funcionalidade proposta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.features[activeFeature] ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-line">
                          {result.features[activeFeature].content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                        Selecione uma ideia para ver os detalhes
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Descreva o Contexto</CardTitle>
                  <CardDescription>
                    Forneça informações sobre a funcionalidade atual e o problema do usuário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentFeature">Funcionalidade Atual <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="currentFeature"
                        placeholder="Ex: Atualmente, os usuários podem filtrar produtos por categoria, preço e avaliação..."
                        rows={3}
                        value={formData.currentFeature}
                        onChange={(e) => {
                          setFormData({ ...formData, currentFeature: e.target.value })
                          if (errors.currentFeature) setErrors({ ...errors, currentFeature: undefined })
                        }}
                        className={errors.currentFeature ? 'border-destructive' : ''}
                      />
                      {errors.currentFeature && (
                        <Alert variant="destructive" className="mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.currentFeature}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userProblem">Problema do Usuário <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="userProblem"
                        placeholder="Ex: Os usuários têm dificuldade em encontrar produtos relevantes para suas necessidades específicas..."
                        rows={3}
                        value={formData.userProblem}
                        onChange={(e) => {
                          setFormData({ ...formData, userProblem: e.target.value })
                          if (errors.userProblem) setErrors({ ...errors, userProblem: undefined })
                        }}
                        className={errors.userProblem ? 'border-destructive' : ''}
                      />
                      {errors.userProblem && (
                        <Alert variant="destructive" className="mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.userProblem}</AlertDescription>
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
                      <Label htmlFor="constraints">Restrições (opcional)</Label>
                      <Textarea
                        id="constraints"
                        placeholder="Ex: Deve ser implementável em 2 meses, compatível com dispositivos móveis..."
                        rows={2}
                        value={formData.constraints || ''}
                        onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featureCount">Número de Ideias</Label>
                      <Select
                        value={formData.featureCount?.toString() || "3"}
                        onValueChange={(value) => setFormData({ ...formData, featureCount: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a quantidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 ideia</SelectItem>
                          <SelectItem value="2">2 ideias</SelectItem>
                          <SelectItem value="3">3 ideias</SelectItem>
                          <SelectItem value="4">4 ideias</SelectItem>
                          <SelectItem value="5">5 ideias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando Ideias...
                        </>
                      ) : 'Gerar Novas Ideias'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Ideação</CardTitle>
                  <CardDescription>
                    Como obter melhores resultados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-medium">Seja específico</h3>
                      <p className="mt-1 text-muted-foreground">
                        Descreva detalhadamente a funcionalidade atual e o problema do usuário para obter ideias mais relevantes.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Foque no problema</h3>
                      <p className="mt-1 text-muted-foreground">
                        Concentre-se no problema real do usuário, não apenas em melhorias incrementais da funcionalidade existente.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Considere o contexto</h3>
                      <p className="mt-1 text-muted-foreground">
                        Informações sobre o público-alvo e restrições ajudam a gerar ideias mais viáveis e direcionadas.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Seja aberto a inovações</h3>
                      <p className="mt-1 text-muted-foreground">
                        As melhores ideias podem vir de abordagens inesperadas ou de combinações de conceitos existentes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
