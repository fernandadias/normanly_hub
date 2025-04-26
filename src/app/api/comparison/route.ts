import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Critérios de avaliação para comparação de ideias
const COMPARISON_CRITERIA = [
  {
    id: 'feasibility',
    name: 'Viabilidade',
    description: 'Quão viável é implementar esta ideia considerando recursos, tempo e tecnologia disponíveis?'
  },
  {
    id: 'impact',
    name: 'Impacto',
    description: 'Qual o potencial impacto desta ideia na resolução do problema e na experiência do usuário?'
  },
  {
    id: 'innovation',
    name: 'Inovação',
    description: 'Quão inovadora é esta ideia em comparação com soluções existentes no mercado?'
  },
  {
    id: 'scalability',
    name: 'Escalabilidade',
    description: 'Quão bem esta ideia pode escalar para atender a um número crescente de usuários ou casos de uso?'
  },
  {
    id: 'alignment',
    name: 'Alinhamento',
    description: 'Quão bem esta ideia se alinha com os objetivos de negócio e necessidades dos usuários?'
  }
];

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    const { ideaA, ideaB, problem, context } = data;
    
    // Validar dados
    if (!ideaA || !ideaB || !problem) {
      return NextResponse.json(
        { error: 'Ambas as ideias e o problema são obrigatórios' },
        { status: 400 }
      );
    }

    // Construir prompt para o modelo
    const systemPrompt = `Você é um especialista em design thinking, UX/UI e avaliação de ideias, com vasto conhecimento em metodologias de inovação e resolução de problemas.
    
Analise as duas ideias fornecidas para resolver o problema descrito e faça uma comparação detalhada, avaliando cada ideia nos seguintes critérios:

1. Viabilidade: Quão viável é implementar esta ideia considerando recursos, tempo e tecnologia disponíveis?
2. Impacto: Qual o potencial impacto desta ideia na resolução do problema e na experiência do usuário?
3. Inovação: Quão inovadora é esta ideia em comparação com soluções existentes no mercado?
4. Escalabilidade: Quão bem esta ideia pode escalar para atender a um número crescente de usuários ou casos de uso?
5. Alinhamento: Quão bem esta ideia se alinha com os objetivos de negócio e necessidades dos usuários?

Para cada critério, atribua uma pontuação de 1 a 10 para cada ideia e forneça uma justificativa detalhada.

Ao final, determine qual ideia é a vencedora com base na análise global, explicando claramente os motivos da escolha.`;

    const userPrompt = `Problema: ${problem}
    
Ideia A: ${ideaA}

Ideia B: ${ideaB}

${context ? `Contexto adicional: ${context}` : ''}

Por favor, compare estas duas ideias e determine qual é a melhor solução para o problema descrito.`;

    // Chamar a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Usando GPT-4 para análise mais sofisticada
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    // Processar a resposta
    const content = response.choices[0].message.content || "";
    
    // Extrair pontuações e vencedor (implementação simplificada)
    const scores: Record<string, { ideaA: number; ideaB: number }> = {};
    let winner = '';
    let winnerJustification = '';
    
    // Inicializar scores com valores padrão
    COMPARISON_CRITERIA.forEach(criterion => {
      scores[criterion.id] = { ideaA: 0, ideaB: 0 };
    });
    
    // Tentar extrair pontuações para cada critério
    COMPARISON_CRITERIA.forEach(criterion => {
      const regexA = new RegExp(`${criterion.name}[^\\d]+(\\d+)(?:\\s*\\/\\s*10)?[^\\d]+(?:ideia|idea)\\s*a`, 'i');
      const regexB = new RegExp(`${criterion.name}[^\\d]+(\\d+)(?:\\s*\\/\\s*10)?[^\\d]+(?:ideia|idea)\\s*b`, 'i');
      
      const matchA = content.match(regexA);
      const matchB = content.match(regexB);
      
      if (matchA) {
        scores[criterion.id].ideaA = parseInt(matchA[1], 10);
      }
      
      if (matchB) {
        scores[criterion.id].ideaB = parseInt(matchB[1], 10);
      }
    });
    
    // Tentar extrair o vencedor
    const winnerRegex = /(?:vencedora|vencedor|melhor)[^:]*(?:é|seria)[^:]*(?:ideia|idea)\s*([ab])/i;
    const winnerMatch = content.match(winnerRegex);
    
    if (winnerMatch) {
      winner = winnerMatch[1].toLowerCase() === 'a' ? 'ideaA' : 'ideaB';
    } else {
      // Se não conseguir extrair diretamente, determinar pelo score total
      const totalA = Object.values(scores).reduce((sum, score) => sum + score.ideaA, 0);
      const totalB = Object.values(scores).reduce((sum, score) => sum + score.ideaB, 0);
      winner = totalA > totalB ? 'ideaA' : 'ideaB';
    }
    
    // Tentar extrair justificativa do vencedor
    const justificationRegex = /(?:vencedora|vencedor|melhor)[^:]*(?:é|seria)[^:]*(?:ideia|idea)\s*[ab][^.]*\.([^]*?)(?:\n\n|\n[A-Z]|$)/i;
    const justificationMatch = content.match(justificationRegex);
    
    if (justificationMatch) {
      winnerJustification = justificationMatch[1].trim();
    }
    
    // Preparar critérios com pontuações
    const criteriaWithScores = COMPARISON_CRITERIA.map(criterion => ({
      ...criterion,
      scores: {
        ideaA: scores[criterion.id].ideaA,
        ideaB: scores[criterion.id].ideaB
      }
    }));

    return NextResponse.json({
      criteria: criteriaWithScores,
      winner,
      winnerJustification: winnerJustification || 'Baseado na análise global dos critérios avaliados.',
      analysis: content,
      ideaA,
      ideaB,
      problem,
      context: context || null
    });
  } catch (error: any) {
    console.error('Erro na API de comparação de ideias:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
