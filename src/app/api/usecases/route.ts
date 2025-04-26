import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Tipos de casos de uso
const USE_CASE_TYPES = [
  {
    id: 'success',
    name: 'Caso de Sucesso',
    description: 'Fluxo principal onde o usuário atinge seu objetivo sem problemas.'
  },
  {
    id: 'error',
    name: 'Caso de Erro',
    description: 'Fluxo onde ocorrem erros ou exceções que impedem o usuário de atingir seu objetivo.'
  },
  {
    id: 'alternative',
    name: 'Caso Alternativo',
    description: 'Fluxo alternativo que leva ao mesmo objetivo por um caminho diferente.'
  },
  {
    id: 'edge',
    name: 'Caso de Borda',
    description: 'Situações extremas ou raras que testam os limites do sistema.'
  },
  {
    id: 'negative',
    name: 'Caso Negativo',
    description: 'Tentativas de uso indevido ou abusivo do sistema.'
  }
];

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    const { feature, userType, systemContext } = data;
    
    // Validar dados
    if (!feature || typeof feature !== 'string') {
      return NextResponse.json(
        { error: 'Descrição da funcionalidade não fornecida ou formato inválido' },
        { status: 400 }
      );
    }

    // Construir prompt para o modelo
    const systemPrompt = `Você é um especialista em UX/UI Design e engenharia de requisitos, com vasto conhecimento em casos de uso, fluxos de usuário e cenários de teste.
    
Analise a funcionalidade descrita e gere casos de uso detalhados para cada tipo (sucesso, erro, alternativo, borda e negativo).

Para cada caso de uso, forneça:
1. Um título descritivo
2. Pré-condições necessárias
3. Atores envolvidos
4. Fluxo detalhado passo a passo
5. Pós-condições esperadas
6. Observações ou considerações especiais

Seu relatório deve ser estruturado, detalhado e prático, permitindo que designers e desenvolvedores entendam todos os cenários possíveis.`;

    const userPrompt = `Funcionalidade: ${feature}
    
${userType ? `Tipo de usuário: ${userType}` : ''}
${systemContext ? `Contexto do sistema: ${systemContext}` : ''}

Por favor, gere casos de uso detalhados para esta funcionalidade, incluindo casos de sucesso, erro, alternativos, de borda e negativos.`;

    // Chamar a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // Modelo com boa relação custo-benefício e contexto amplo
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    // Processar a resposta
    const content = response.choices[0].message.content || "";
    
    // Extrair casos de uso por tipo (implementação simplificada)
    const useCases = USE_CASE_TYPES.map(type => {
      // Buscar seções no conteúdo que correspondem a cada tipo de caso de uso
      const regex = new RegExp(`(?:${type.name}|${type.id}).*?(?=\\n\\s*\\n|$)`, 'is');
      const match = content.match(regex);
      
      return {
        ...type,
        cases: match ? [{ content: match[0] }] : []
      };
    });

    return NextResponse.json({
      useCases,
      feature,
      userType: userType || null,
      systemContext: systemContext || null,
      fullReport: content
    });
  } catch (error: any) {
    console.error('Erro na API de casos de uso:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
