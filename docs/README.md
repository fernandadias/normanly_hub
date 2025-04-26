# Normanly Hub - Documentação do Projeto

Este documento serve como guia principal para o Normanly Hub, um SaaS vertical com agentes de IA para UX designers.

## Visão Geral

O Normanly Hub é uma plataforma que oferece seis agentes de IA específicos para auxiliar UX designers em diferentes aspectos do processo de design:

1. **Análise de Heurísticas de Nielsen** - Avalia interfaces com base nas 10 heurísticas de Nielsen
2. **Repositório de Padrões UX/UI** - Fornece padrões de design para diferentes desafios
3. **Gerador de Casos de Uso** - Cria casos de uso para funcionalidades
4. **Definição de Core Action** - Ajuda a definir a ação principal do produto
5. **Confronto de Ideias** - Compara diferentes abordagens de design
6. **Ideação de Novas Features** - Gera ideias para novas funcionalidades

## Estrutura do Projeto

A estrutura do projeto segue o padrão Next.js com App Router, organizada em componentes modulares e reutilizáveis. Para mais detalhes, consulte [Arquitetura](./architecture.md).

## Tecnologias Utilizadas

- **Frontend**: Next.js 14.1.0, React 18.2.0, Tailwind CSS 3.3.0
- **UI Components**: Radix UI, Shadcn UI
- **Backend**: Supabase (autenticação e armazenamento)
- **IA**: OpenAI API
- **Testes**: Jest, React Testing Library

Para mais detalhes sobre as dependências, consulte [Dependências](./dependencies.md).

## Guias

- [Implantação](./deployment.md) - Instruções para implantar o projeto
- [Testes](./testing.md) - Informações sobre a estrutura de testes
- [Arquitetura](./architecture.md) - Detalhes sobre a arquitetura do projeto
- [Dependências](./dependencies.md) - Lista de dependências e versões

## Planos de Assinatura

O Normanly Hub oferece três planos de assinatura:

1. **Plano Free** - Limite de 3 usos por agente
2. **Plano Designer** - R$97/mês
3. **Plano Pro** - R$197/mês

Há também um plano Team para B2B que oferece acesso a times inteiros.

## Desenvolvimento

### Configuração do Ambiente de Desenvolvimento

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd normanly_hub

# Instale as dependências
npm install --legacy-peer-deps

# Execute o servidor de desenvolvimento
npm run dev
```

### Convenções de Código

- Utilize componentes funcionais com hooks
- Siga as convenções de nomenclatura do projeto
- Documente componentes com JSDoc
- Escreva testes para novos componentes

## Contribuição

Para contribuir com o projeto:

1. Crie um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Solução de Problemas

Consulte a seção de solução de problemas no [Guia de Implantação](./deployment.md) para resolver problemas comuns.

## Contato

Para mais informações ou suporte, entre em contato através do email: suporte@normanly.com
