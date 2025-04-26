import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Heurísticas de Nielsen
const NIELSEN_HEURISTICS = [
  {
    id: 'visibility',
    name: 'Visibilidade do Status do Sistema',
    description: 'O sistema deve manter os usuários informados sobre o que está acontecendo, através de feedback apropriado dentro de um tempo razoável.'
  },
  {
    id: 'match',
    name: 'Correspondência entre o Sistema e o Mundo Real',
    description: 'O sistema deve falar a linguagem dos usuários, com palavras, frases e conceitos familiares ao usuário, em vez de termos orientados ao sistema.'
  },
  {
    id: 'control',
    name: 'Controle e Liberdade do Usuário',
    description: 'Os usuários frequentemente escolhem funções por engano e precisam de uma "saída de emergência" claramente marcada para deixar o estado indesejado.'
  },
  {
    id: 'consistency',
    name: 'Consistência e Padrões',
    description: 'Os usuários não devem ter que se perguntar se diferentes palavras, situações ou ações significam a mesma coisa.'
  },
  {
    id: 'errors',
    name: 'Prevenção de Erros',
    description: 'Melhor que boas mensagens de erro é um design cuidadoso que previne que um problema ocorra.'
  },
  {
    id: 'recognition',
    name: 'Reconhecimento em vez de Lembrança',
    description: 'Minimize a carga de memória do usuário tornando objetos, ações e opções visíveis.'
  },
  {
    id: 'flexibility',
    name: 'Flexibilidade e Eficiência de Uso',
    description: 'Aceleradores invisíveis para o usuário novato podem frequentemente acelerar a interação para o usuário experiente.'
  },
  {
    id: 'aesthetic',
    name: 'Design Estético e Minimalista',
    description: 'Os diálogos não devem conter informações irrelevantes ou raramente necessárias.'
  },
  {
    id: 'recovery',
    name: 'Ajude os Usuários a Reconhecer, Diagnosticar e Recuperar-se de Erros',
    description: 'Mensagens de erro devem ser expressas em linguagem simples, indicar precisamente o problema e sugerir uma solução.'
  },
  {
    id: 'help',
    name: 'Ajuda e Documentação',
    description: 'Mesmo que seja melhor que um sistema possa ser usado sem documentação, pode ser necessário fornecer ajuda e documentação.'
  }
];

// Função para analisar imagens com o modelo econômico (preview)
async function analyzeImagesPreview(images: string[], context: any) {
  try {
    // Usar apenas a primeira imagem para o preview
    const firstImage = images[0];
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Modelo mais econômico para preview
      messages: [
        {
          role: "system",
          content: `Você é um especialista em UX/UI que analisa interfaces com base nas heurísticas de Nielsen. 
          Faça uma análise rápida da imagem fornecida, identificando possíveis problemas de usabilidade.
          Forneça uma estimativa da qualidade dos resultados que uma análise completa poderia gerar.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Analise esta interface para um preview rápido. Contexto: ${JSON.stringify(context)}` },
            { type: "image_url", image_url: { url: firstImage } }
          ]
        }
      ],
      max_tokens: 500
    });

    return {
      preview: true,
      analysis: response.choices[0].message.content,
      estimatedQuality: "alta", // Poderia ser calculado com base em alguma métrica
      fullAnalysisCost: images.length // Estimativa simples do custo da análise completa
    };
  } catch (error) {
    console.error('Erro na análise de preview:', error);
    throw error;
  }
}

// Função para analisar imagens com o modelo premium
async function analyzeImagesFull(images: string[], context: any) {
  try {
    // Construir mensagens para cada imagem
    const messages = [
      {
        role: "system",
        content: `Você é um especialista em UX/UI que analisa interfaces com base nas heurísticas de Nielsen.
        Analise detalhadamente as imagens fornecidas, considerando que elas representam um fluxo de interação.
        Para cada heurística de Nielsen, identifique problemas específicos, forneça uma pontuação (0-10) e recomendações.
        Indique em quais imagens cada problema ocorre, referenciando-as por número (Imagem 1, Imagem 2, etc.).
        Forneça também coordenadas aproximadas (x,y em %) para cada problema identificado.
        Ao final, calcule um score geral de usabilidade (0-100).`
      }
    ];

    // Adicionar contexto e primeira imagem
    messages.push({
      role: "user",
      content: [
        { 
          type: "text", 
          text: `Analise este fluxo de interface. Contexto: ${JSON.stringify(context)}. Esta é a primeira imagem (início do fluxo).` 
        },
        { 
          type: "image_url", 
          image_url: { url: images[0] } 
        }
      ]
    });

    // Adicionar imagens intermediárias
    for (let i = 1; i < images.length - 1; i++) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: `Esta é a imagem ${i+1} (interação intermediária).` },
          { type: "image_url", image_url: { url: images[i] } }
        ]
      });
    }

    // Adicionar última imagem se houver mais de uma
    if (images.length > 1) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: `Esta é a última imagem (fim do fluxo).` },
          { type: "image_url", image_url: { url: images[images.length - 1] } }
        ]
      });
    }

    // Solicitar análise estruturada
    messages.push({
      role: "user",
      content: `Forneça sua análise no seguinte formato JSON:
      {
        "overallScore": número de 0 a 100,
        "heuristics": [
          {
            "id": "id_da_heuristica",
            "score": número de 0 a 10,
            "issues": [
              {
                "description": "descrição do problema",
                "imageIndex": número da imagem (começando em 0),
                "coordinates": {"x": percentual, "y": percentual},
                "recommendation": "recomendação para resolver"
              }
            ]
          }
        ]
      }`
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview", // Modelo premium para análise completa
      messages: messages as any,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    // Extrair e validar o JSON da resposta
    const content = response.choices[0].message.content || "{}";
    const analysisResult = JSON.parse(content);
    
    return {
      preview: false,
      ...analysisResult
    };
  } catch (error) {
    console.error('Erro na análise completa:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    const { images, businessModel, actionType, flowType, device, preview = false } = data;
    
    // Validar dados
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Imagens não fornecidas ou formato inválido' },
        { status: 400 }
      );
    }

    // Contexto para a análise
    const context = { businessModel, actionType, flowType, device };
    
    // Realizar análise de acordo com o tipo (preview ou completa)
    const result = preview 
      ? await analyzeImagesPreview(images, context)
      : await analyzeImagesFull(images, context);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro na API de análise heurística:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
