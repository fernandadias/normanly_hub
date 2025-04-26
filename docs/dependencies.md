# Configuração de Dependências do Normanly Hub

Este documento detalha as versões específicas das dependências utilizadas no Normanly Hub para garantir compatibilidade e estabilidade.

## Dependências Principais

### Framework e React
- **Next.js**: 14.1.0 (LTS) - Versão estável com suporte de longo prazo
- **React**: 18.2.0 - Versão estável com amplo suporte de bibliotecas
- **React DOM**: 18.2.0 - Compatível com a versão do React

### UI e Estilização
- **Tailwind CSS**: 3.3.0 - Versão estável sem problemas de compatibilidade com lightningcss
- **Radix UI**: Componentes primitivos na versão ^1.x.x (estável)
- **class-variance-authority**: ^0.7.0 - Para variantes de componentes
- **clsx**: ^2.0.0 - Para composição de classes CSS
- **tailwind-merge**: ^3.0.0 - Para mesclar classes Tailwind

### Gerenciamento de Formulários
- **react-hook-form**: ^7.45.0 - Versão estável para gerenciamento de formulários
- **@hookform/resolvers**: ^3.1.0 - Para integração com validação
- **zod**: ^3.21.4 - Para validação de esquemas

### Backend e Autenticação
- **@supabase/auth-helpers-nextjs**: ^0.7.0 - Versão compatível com Next.js 14
- **@supabase/supabase-js**: ^2.26.0 - Cliente Supabase estável

### Utilitários
- **next-themes**: ^0.2.1 - Para suporte a temas claro/escuro
- **lucide-react**: ^0.263.0 - Ícones vetoriais
- **react-dropzone**: ^14.2.3 - Para upload de arquivos
- **sonner**: ^1.0.0 - Para notificações toast

## DevDependencies

- **typescript**: ^5.1.6 - Versão estável do TypeScript
- **eslint**: ^8.44.0 - Linting de código
- **eslint-config-next**: 14.0.4 - Configuração ESLint compatível com Next.js 14
- **@types/node**: ^20.4.2 - Tipos para Node.js
- **@types/react**: ^18.2.15 - Tipos para React 18
- **@types/react-dom**: ^18.2.7 - Tipos para React DOM 18
- **tailwindcss-animate**: ^1.0.6 - Animações para Tailwind CSS

## Compatibilidade

Esta configuração foi cuidadosamente selecionada para evitar os seguintes problemas:

1. **Conflitos com lightningcss** - Usando Tailwind 3.3.0 em vez da versão 4
2. **Incompatibilidades entre React e Next.js** - Usando versões comprovadamente compatíveis
3. **Problemas com componentes Radix UI** - Usando versões estáveis e testadas

## Atualizações Futuras

Ao atualizar dependências no futuro, siga estas diretrizes:

1. Sempre teste em ambiente de desenvolvimento antes de atualizar em produção
2. Prefira atualizações incrementais em vez de saltos de versão principais
3. Verifique a compatibilidade entre Next.js, React e Tailwind CSS
4. Mantenha um registro de alterações de dependências
