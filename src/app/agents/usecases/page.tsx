"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UseCaseFormData, ValidationErrors, UseCaseReport, UseCaseCategory } from '@/types/usecases'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function UseCasesPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<UseCaseFormData>({
    feature: '',
    userType: '',
    systemContext: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<UseCaseReport | null>(null)
  const [activeTab, setActiveTab] = useState('success')

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.feature.trim()) {
      newErrors.feature = 'Por favor, descreva a funcionalidade'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/usecases', {
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
      setReport(result)
      
      // Definir a primeira categoria com casos como ativa
      const firstWithCases = result.useCases.find(cat => cat.cases.length > 0)
      if (firstWithCases) {
        setActiveTab(firstWithCases.id)
      }
    } catch (error: any) {
      toast({
        title: "Erro ao gerar casos de uso",
        description: error.message || "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      feature: '',
      userType: '',
      systemContext: ''
    })
    setErrors({})
    setReport(null)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Gerador de Casos de Uso</h1>
          <p className="text-gray-600">Gere casos de uso detalhados para suas funcionalidades, incluindo fluxos de sucesso, erro e alternativos</p>
        </div>

        {report ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Casos de Uso Gerados</h2>
              <Button variant="outline" onClick={resetForm}>
                Nova Geração
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Funcionalidade</CardTitle>
                <CardDescription>
                  Detalhes da funcionalidade analisada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Funcionalidade:</h3>
                    <p className="mt-1">{report.feature}</p>
                  </div>
                  
                  {report.userType && (
                    <div>
                      <h3 className="font-medium">Tipo de Usuário:</h3>
                      <p className="mt-1">{report.userType}</p>
                    </div>
                  )}
                  
                  {report.systemContext && (
                    <div>
                      <h3 className="font-medium">Contexto do Sistema:</h3>
                      <p className="mt-1">{report.systemContext}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Casos de Uso</CardTitle>
                <CardDescription>
                  Diferentes cenários para a funcionalidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    {report.useCases.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        disabled={category.cases.length === 0}
                        className={category.cases.length === 0 ? 'opacity-50' : ''}
                      >
                        {category.name}
                        {category.cases.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {category.cases.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {report.useCases.map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        
                        {category.cases.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {category.cases.map((useCase, index) => (
                              <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>
                                  Caso {index + 1}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="whitespace-pre-line prose max-w-none">
                                    {useCase.content}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <div className="p-4 bg-muted rounded-md text-center text-muted-foreground">
                            Nenhum caso de uso deste tipo foi identificado para esta funcionalidade.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatório Completo</CardTitle>
                <CardDescription>
                  Todos os casos de uso em formato de texto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line">
                    {report.fullReport}
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
                  <CardTitle>Descreva a Funcionalidade</CardTitle>
                  <CardDescription>
                    Forneça detalhes sobre a funcionalidade para a qual deseja gerar casos de uso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="feature">Funcionalidade <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="feature"
                        placeholder="Ex: Sistema de autenticação de dois fatores para login de usuários..."
                        rows={5}
                        value={formData.feature}
                        onChange={(e) => {
                          setFormData({ ...formData, feature: e.target.value })
                          if (errors.feature) setErrors({ ...errors, feature: undefined })
                        }}
                        className={errors.feature ? 'border-destructive' : ''}
                      />
                      {errors.feature && (
                        <Alert variant="destructive" className="mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.feature}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userType">Tipo de Usuário (opcional)</Label>
                      <Input
                        id="userType"
                        placeholder="Ex: Administrador, Cliente, Usuário não autenticado..."
                        value={formData.userType || ''}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systemContext">Contexto do Sistema (opcional)</Label>
                      <Textarea
                        id="systemContext"
                        placeholder="Ex: Sistema web com banco de dados SQL, integração com serviços de email..."
                        rows={3}
                        value={formData.systemContext || ''}
                        onChange={(e) => setFormData({ ...formData, systemContext: e.target.value })}
                      />
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando Casos de Uso...
                        </>
                      ) : 'Gerar Casos de Uso'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Casos de Uso</CardTitle>
                  <CardDescription>
                    Cenários que serão gerados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-medium">Caso de Sucesso</h3>
                      <p className="mt-1 text-muted-foreground">
                        Fluxo principal onde o usuário atinge seu objetivo sem problemas.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Caso de Erro</h3>
                      <p className="mt-1 text-muted-foreground">
                        Fluxo onde ocorrem erros ou exceções que impedem o usuário de atingir seu objetivo.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Caso Alternativo</h3>
                      <p className="mt-1 text-muted-foreground">
                        Fluxo alternativo que leva ao mesmo objetivo por um caminho diferente.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Caso de Borda</h3>
                      <p className="mt-1 text-muted-foreground">
                        Situações extremas ou raras que testam os limites do sistema.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Caso Negativo</h3>
                      <p className="mt-1 text-muted-foreground">
                        Tentativas de uso indevido ou abusivo do sistema.
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
