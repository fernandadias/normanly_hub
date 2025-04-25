"use client"

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface WizardProps {
  steps: {
    title: string
    description: string
    content: ReactNode
  }[]
}

export function Wizard({ steps }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
        <p className="text-muted-foreground mt-2">
          {steps[currentStep].description}
        </p>
      </div>

      <div className="space-y-4">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={previousStep}
          disabled={isFirstStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Button onClick={nextStep}>
          {isLastStep ? 'Concluir' : 'Próximo'}
          {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
} 