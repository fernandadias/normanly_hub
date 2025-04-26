import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    const { currentFeature, userProblem, targetAudience, constraints, featureCount = 3 } = data;
    
    // Validar dados
    if (!currentFeature || !userProblem) {
      return NextResponse.json(
        { error: 'Funcionalidade atual e problema do usuário são obrigatórios' },
        { status: 400 }
      );
    }

    // Limitar o número de features para evitar custos excessivos
    const safeFeatureCount = Math.min(Math.max(1, featureCount), 5);

    // Construir prompt para o modelo
    const systemPrompt = `Você é um especialista em UX/UI Design e inovação de produtos, com vasto conhecimento em ideação de novas funcionalidades.
    
Analise a funcionalidade atual e o problema do usuário descritos, e gere ${safeFeatureCount} ideias inovadoras para novas funcionalidades que poderiam melhorar a experiência do usuário e resolver o problema de forma mais eficaz.

Para cada ideia de funcionalidade, forneça:
1. Um título descritivo
2. Uma descrição detalhada da funcionalidade
3. Os benefícios esperados para o usuário
4. Considerações técnicas para implementação
5. Uma descrição visual de como seria a interface

Suas ideias devem ser inovadoras, viáveis e alinhadas com as necessidades do usuário e as restrições fornecidas.`;

    const userPrompt = `Funcionalidade atual: ${currentFeature}
    
Problema do usuário: ${userProblem}

${targetAudience ? `Público-alvo: ${targetAudience}` : ''}
${constraints ? `Restrições: ${constraints}` : ''}

Por favor, gere ${safeFeatureCount} ideias inovadoras para novas funcionalidades que poderiam melhorar a experiência do usuário.`;

    // Chamar a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Usando GPT-4 para ideias mais criativas e detalhadas
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8, // Temperatura mais alta para maior criatividade
      max_tokens: 3000
    });

    // Processar a resposta
    const content = response.choices[0].message.content || "";
    
    // Extrair as ideias de funcionalidades (implementação simplificada)
    const features = [];
    const featureRegex = /(?:##|#)\s*(.*?)(?=(?:##|#|$))/gs;
    let match;
    
    while ((match = featureRegex.exec(content)) !== null) {
      const featureContent = match[1].trim();
      
      // Tentar extrair título e descrição
      const titleMatch = featureContent.match(/^(.*?)(?:\n|$)/);
      const title = titleMatch ? titleMatch[1].trim() : 'Nova Funcionalidade';
      
      features.push({
        title,
        content: featureContent
      });
    }
    
    // Se não conseguiu extrair usando regex, dividir o conteúdo em partes iguais
    if (features.length === 0) {
      const lines = content.split('\n');
      let currentFeature = { title: 'Ideia 1', content: '' };
      let featureIndex = 1;
      
      for (const line of lines) {
        if (line.match(/^(Ideia|Funcionalidade|Feature)\s*\d+/i) && featureIndex < safeFeatureCount) {
          features.push(currentFeature);
          featureIndex++;
          currentFeature = { title: line.trim(), content: line + '\n' };
        } else {
          currentFeature.content += line + '\n';
        }
      }
      
      features.push(currentFeature);
    }

    return NextResponse.json({
      features: features.slice(0, safeFeatureCount),
      fullContent: content,
      currentFeature,
      userProblem,
      targetAudience: targetAudience || null,
      constraints: constraints || null
    });
  } catch (error: any) {
    console.error('Erro na API de ideação:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
