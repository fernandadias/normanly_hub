# Arquitetura do Normanly Hub

Este documento descreve a arquitetura robusta implementada no Normanly Hub para garantir estabilidade, manutenibilidade e escalabilidade.

## Estrutura de Diretórios

```
normanly_hub/
├── docs/                  # Documentação do projeto
├── public/                # Arquivos estáticos
└── src/
    ├── app/               # Rotas e páginas (Next.js App Router)
    │   ├── agents/        # Páginas dos agentes de IA
    │   ├── api/           # Rotas de API
    │   └── ...
    ├── components/        # Componentes React
    │   ├── agents/        # Componentes específicos dos agentes
    │   ├── analysis/      # Componentes de análise
    │   ├── layout/        # Componentes de layout
    │   └── ui/            # Componentes de UI reutilizáveis
    ├── constants/         # Constantes e configurações
    ├── contexts/          # Contextos React para gerenciamento de estado
    ├── lib/               # Utilitários e funções auxiliares
    └── types/             # Definições de tipos TypeScript
```

## Padrões de Componentes

### Componentes UI

Os componentes UI seguem o padrão Shadcn UI, que utiliza Radix UI para acessibilidade e Tailwind CSS para estilização. Cada componente:

1. É fortemente tipado com TypeScript
2. Utiliza o padrão de composição para flexibilidade
3. Implementa acessibilidade seguindo as diretrizes WCAG
4. Mantém consistência visual através do Tailwind CSS

### Gerenciamento de Estado

O gerenciamento de estado é implementado através de:

1. **Contextos React** para estado global (ex: SubscriptionContext)
2. **useState/useReducer** para estado local de componentes
3. **Padrões de prop drilling minimizados** através de composição de componentes

## Estilo e Tema

O sistema de estilo utiliza:

1. **Tailwind CSS 3.3.0** para utilitários CSS
2. **CSS Modules** para estilos específicos de componentes quando necessário
3. **Tema escuro/claro** implementado via next-themes
4. **Variáveis CSS** para tokens de design consistentes

## Dependências Principais

- **Next.js**: Framework React para renderização e roteamento
- **React**: Biblioteca para construção de interfaces
- **Tailwind CSS**: Framework CSS utilitário
- **Radix UI**: Componentes primitivos acessíveis
- **Supabase**: Backend as a Service para autenticação e armazenamento

## Padrões de Código

1. **Componentes funcionais** com hooks React
2. **TypeScript** para tipagem estática
3. **ESLint** para linting e padrões de código
4. **Prettier** para formatação consistente

## Testes

A estratégia de testes inclui:

1. **Testes de componentes** para verificar renderização e comportamento
2. **Testes de integração** para fluxos de usuário
3. **Testes de acessibilidade** para garantir conformidade WCAG

## CI/CD

O pipeline de CI/CD verifica:

1. **Tipagem TypeScript**
2. **Linting e formatação**
3. **Testes automatizados**
4. **Build de produção**

## Considerações de Performance

1. **Carregamento sob demanda** de componentes e páginas
2. **Otimização de imagens** via Next.js
3. **Minimização de JavaScript** em produção
4. **Análise de bundle size** para evitar código desnecessário
