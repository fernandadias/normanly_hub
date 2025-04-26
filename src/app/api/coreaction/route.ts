import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Dimensões de avaliação da Core Action baseadas na metodologia Reforge
const CORE_ACTION_DIMENSIONS = [
  {
    id: 'frequency',
    name: 'Frequência',
    description: 'Com que frequência os usuários realizam esta ação?',
    questions: [
      'Com que frequência os usuários realizam esta ação?',
      'Esta ação é realizada diariamente, semanalmente ou mensalmente?',
      'Qual é o intervalo típico entre repetições desta ação?'
    ]
  },
  {
    id: 'value',
    name: 'Valor',
    description: 'Quanto valor esta ação gera para o usuário e para o negócio?',
    questions: [
      'Qual é o valor direto que esta ação gera para o usuário?',
      'Como esta ação contribui para a proposta de valor do produto?',
      'Qual é o impacto financeiro desta ação para o negócio?'
    ]
  },
  {
    id: 'network',
    name: 'Efeito de Rede',
    description: 'Esta ação contribui para efeitos de rede ou loops virais?',
    questions: [
      'Esta ação cria valor para outros usuários além de quem a executa?',
      'A ação contribui para atrair novos usuários para a plataforma?',
      'Existe um efeito multiplicador quando mais usuários realizam esta ação?'
    ]
  },
  {
    id: 'defensibility',
    name: 'Defensibilidade',
    description: 'Esta ação cria barreiras competitivas ou aumenta o custo de troca?',
    questions: [
      'Esta ação cria dados ou conteúdo que aumentam o valor do produto ao longo do tempo?',
      'A ação contribui para aumentar o custo de troca para concorrentes?',
      'Existe algum aspecto único na forma como esta ação é implementada?'
    ]
  },
  {
    id: 'alignment',
    name: 'Alinhamento',
    description: 'Esta ação está alinhada com os objetivos de longo prazo do negócio?',
    questions: [
      'Como esta ação se alinha com a visão e missão da empresa?',
      'Esta ação contribui para os objetivos estratégicos de longo prazo?',
      'Existe algum conflito potencial entre esta ação e outros objetivos do negócio?'
    ]
  }
];

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    const { 
      productName, 
      productDescription, 
      targetAudience, 
      businessModel,
      currentActions = []
    } = data;
    
    // Validar dados
    if (!productName || !productDescription) {
      return NextResponse.json(
        { error: 'Nome e descrição do produto são obrigatórios' },
        { status: 400 }
      );
    }

    // Construir prompt para o modelo
    const systemPrompt = `Você é um especialista em estratégia de produto e growth, com profundo conhecimento da metodologia Reforge para identificação de Core Actions.

Uma Core Action é a ação principal que os usuários realizam em um produto, que gera valor tanto para eles quanto para o negócio. A Core Action ideal tem alta frequência, alto valor, contribui para efeitos de rede, cria defensibilidade e está alinhada com os objetivos de longo prazo.

Analise o produto descrito e identifique a Core Action ideal, avaliando as ações candidatas em cada uma das dimensões: Frequência, Valor, Efeito de Rede, Defensibilidade e Alinhamento.

Forneça uma análise detalhada e estruturada, com pontuações para cada dimensão (1-10) e uma pontuação geral.`;

    const userPrompt = `Produto: ${productName}
    
Descrição: ${productDescription}

Público-alvo: ${targetAudience || 'Não especificado'}

Modelo de negócio: ${businessModel || 'Não especificado'}

${currentActions.length > 0 ? `Ações candidatas a Core Action:
${currentActions.map((action: string) => `- ${action}`).join('\n')}` : 'Não foram fornecidas ações candidatas específicas.'}

Por favor, identifique a Core Action ideal para este produto, analisando as dimensões de Frequência, Valor, Efeito de Rede, Defensibilidade e Alinhamento. Se foram fornecidas ações candidatas, avalie cada uma. Caso contrário, sugira possíveis Core Actions.`;

    // Chamar a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // Modelo com boa relação custo-benefício e contexto amplo
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    // Processar a resposta
    const content = response.choices[0].message.content || "";
    
    // Extrair a Core Action recomendada e as pontuações (implementação simplificada)
    let coreAction = "";
    const dimensionScores: Record<string, number> = {};
    let overallScore = 0;
    
    // Tentativa simples de extrair a Core Action recomendada
    const coreActionMatch = content.match(/Core Action(?:\s+recomendada)?(?:\s+identificada)?(?:\s+sugerida)?(?:\s+ideal)?:?\s*([^\n.]+)/i);
    if (coreActionMatch) {
      coreAction = coreActionMatch[1].trim();
    }
    
    // Tentativa de extrair pontuações para cada dimensão
    CORE_ACTION_DIMENSIONS.forEach(dimension => {
      const scoreMatch = content.match(new RegExp(`${dimension.name}[^\\d]+(\\d+)(?:\\s*\\/\\s*10)?`, 'i'));
      if (scoreMatch) {
        dimensionScores[dimension.id] = parseInt(scoreMatch[1], 10);
      } else {
        dimensionScores[dimension.id] = 0; // Valor padrão se não encontrar
      }
    });
    
    // Calcular pontuação geral
    const scoreValues = Object.values(dimensionScores);
    if (scoreValues.length > 0) {
      overallScore = Math.round(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length);
    }
    
    // Preparar dimensões com pontuações
    const dimensionsWithScores = CORE_ACTION_DIMENSIONS.map(dimension => ({
      ...dimension,
      score: dimensionScores[dimension.id] || 0
    }));

    return NextResponse.json({
      coreAction,
      dimensions: dimensionsWithScores,
      overallScore,
      analysis: content,
      productName,
      productDescription,
      targetAudience: targetAudience || null,
      businessModel: businessModel || null,
      currentActions: currentActions || []
    });
  } catch (error: any) {
    console.error('Erro na API de Core Action:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
