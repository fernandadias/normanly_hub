# Guia de Implantação do Normanly Hub

Este documento fornece instruções para implantar o Normanly Hub em diferentes ambientes.

## Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- Git

## Instalação Local

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd normanly_hub
   ```

2. **Instale as dependências**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Execute o ambiente de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   Abra seu navegador em `http://localhost:3000`

## Construção para Produção

1. **Construa a aplicação**
   ```bash
   npm run build
   ```

2. **Teste a versão de produção localmente**
   ```bash
   npm run start
   ```

## Implantação em Vercel

A maneira mais simples de implantar o Normanly Hub é usando a Vercel:

1. **Crie uma conta na Vercel** (se ainda não tiver)
   Acesse [vercel.com](https://vercel.com) e crie uma conta

2. **Instale a CLI da Vercel**
   ```bash
   npm install -g vercel
   ```

3. **Faça login na Vercel**
   ```bash
   vercel login
   ```

4. **Implante o projeto**
   ```bash
   vercel
   ```

5. **Para implantação em produção**
   ```bash
   vercel --prod
   ```

## Implantação com Docker

1. **Construa a imagem Docker**
   ```bash
   docker build -t normanly-hub .
   ```

2. **Execute o contêiner**
   ```bash
   docker run -p 3000:3000 normanly-hub
   ```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
OPENAI_API_KEY=sua-chave-da-api-openai
```

## Configuração de Banco de Dados

O Normanly Hub utiliza o Supabase como backend. Siga estas etapas para configurar:

1. **Crie um projeto no Supabase**
   Acesse [supabase.com](https://supabase.com) e crie um novo projeto

2. **Configure as tabelas necessárias**
   Execute os scripts SQL fornecidos em `docs/database-setup.sql`

3. **Configure a autenticação**
   Ative os provedores de autenticação desejados no painel do Supabase

## Monitoramento e Logs

- Use o painel da Vercel para monitoramento básico
- Considere integrar com serviços como Sentry para monitoramento de erros
- Configure logs estruturados para ambientes de produção

## Solução de Problemas Comuns

### Erro de Dependências
Se encontrar erros relacionados a dependências, tente:
```bash
npm clean-install --legacy-peer-deps
```

### Problemas com lightningcss
Se encontrar erros relacionados ao lightningcss:
```bash
npm rebuild
# ou
npm install lightningcss@1.18.0 --legacy-peer-deps
```

### Problemas de Renderização CSS
Se os estilos não estiverem sendo aplicados corretamente:
- Verifique se o componente `Providers` está envolvendo a aplicação
- Confirme que o arquivo globals.css está sendo importado no layout raiz
- Verifique se as classes do Tailwind estão corretas
