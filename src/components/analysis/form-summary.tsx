import { AnalysisFormData } from '@/types/analysis'
import {
  BUSINESS_MODEL_OPTIONS,
  ACTION_TYPE_OPTIONS,
  FLOW_TYPE_OPTIONS,
  DEVICE_OPTIONS
} from '@/constants/analysis-options'

interface FormSummaryProps {
  data: AnalysisFormData;
}

export function FormSummary({ data }: FormSummaryProps) {
  const getLabel = (value: string, options: Array<{ value: string; label: string }>) => {
    return options.find(option => option.value === value)?.label || value;
  };

  return (
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <h3 className="font-medium mb-4">Resumo da Análise</h3>
      
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Imagens:</span>
          <span className="font-medium">{data.images.length} imagem(ns)</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Modelo de Negócio:</span>
          <span className="font-medium">
            {getLabel(data.businessModel, BUSINESS_MODEL_OPTIONS)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tipo de Ação:</span>
          <span className="font-medium">
            {getLabel(data.actionType, ACTION_TYPE_OPTIONS)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tipo de Fluxo:</span>
          <span className="font-medium">
            {getLabel(data.flowType, FLOW_TYPE_OPTIONS)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dispositivo:</span>
          <span className="font-medium">
            {getLabel(data.device, DEVICE_OPTIONS)}
          </span>
        </div>
      </div>
    </div>
  );
} 