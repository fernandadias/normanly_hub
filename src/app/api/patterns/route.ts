import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Categorias de padrões UX/UI
const UX_PATTERN_CATEGORIES = [
  {
    id: 'navigation',
    name: 'Navegação e Estrutura',
    description: 'Padrões relacionados à navegação, arquitetura da informação e estrutura do site/aplicativo.'
  },
  {
    id: 'forms',
    name: 'Formulários e Entrada de Dados',
    description: 'Padrões para design de formulários, validação e entrada de dados.'
  },
  {
    id: 'feedback',
    name: 'Feedback e Comunicação',
    description: 'Padrões para fornecer feedback ao usuário, mensagens de erro e confirmação.'
  },
  {
    id: 'onboarding',
    name: 'Onboarding e Educação',
    description: 'Padrões para introduzir novos usuários ao produto e educar sobre funcionalidades.'
  },
  {
    id: 'visual',
    name: 'Design Visual e Estética',
    description: 'Padrões relacionados à estética, cores, tipografia e elementos visuais.'
  },
  {
    id: 'interaction',
    name: 'Interação e Microinterações',
    description: 'Padrões para interações específicas, gestos e microinterações.'
  },
  {
    id: 'accessibility',
    name: 'Acessibilidade e Inclusão',
    description: 'Padrões para tornar o produto acessível a todos os usuários.'
  },
  {
    id: 'persuasion',
    name: 'Persuasão e Conversão',
    description: 'Padrões para aumentar conversão, engajamento e persuasão.'
  }
];

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    const { challenge, context, industryType } = data;
    
    // Validar dados
    if (!challenge || typeof challenge !== 'string') {
      return NextResponse.json(
        { error: 'Descrição do desafio não fornecida ou formato inválido' },
        { status: 400 }
      );
    }

    // Construir prompt para o modelo
    const systemPrompt = `Você é um especialista em UX/UI Design com vasto conhecimento em padrões de design, melhores práticas, princípios de usabilidade e psicologia do usuário.
    
Analise o desafio de design fornecido e forneça um relatório detalhado de padrões UX/UI, melhores práticas, estratégias de copy e gatilhos psicológicos que podem ser aplicados.

Para cada categoria relevante, forneça:
1. Padrões específicos que podem ser aplicados
2. Exemplos de implementação bem-sucedida
3. Princípios de design que fundamentam esses padrões
4. Considerações específicas para o contexto do usuário

Seu relatório deve ser estruturado, detalhado e prático, permitindo que o designer aplique essas recomendações diretamente ao seu trabalho.`;

    const userPrompt = `Desafio de Design: ${challenge}
    
${context ? `Contexto adicional: ${context}` : ''}
${industryType ? `Tipo de indústria: ${industryType}` : ''}

Por favor, forneça um relatório detalhado de padrões UX/UI, melhores práticas, estratégias de copy e gatilhos psicológicos que podem ser aplicados a este desafio.`;

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
    
    // Identificar categorias relevantes com base no conteúdo
    const relevantCategories = UX_PATTERN_CATEGORIES.filter(category => 
      content.toLowerCase().includes(category.name.toLowerCase()) || 
      content.toLowerCase().includes(category.id.toLowerCase())
    );

    return NextResponse.json({
      report: content,
      categories: relevantCategories,
      challenge,
      context: context || null,
      industryType: industryType || null
    });
  } catch (error: any) {
    console.error('Erro na API de padrões UX/UI:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
