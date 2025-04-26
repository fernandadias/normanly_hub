# Solução de Problemas Comuns no Normanly Hub

Este documento fornece soluções para problemas comuns que podem ser encontrados durante o desenvolvimento e implantação do Normanly Hub.

## Problemas de CSS e Tailwind

### Erro: "Cannot apply unknown utility class"

Se você encontrar erros como `Cannot apply unknown utility class: border-neutral-700` ou similar:

1. **Verifique se a classe existe no Tailwind**
   - Nem todas as combinações de propriedades e valores são automaticamente disponíveis no Tailwind
   - Use apenas classes que fazem parte do conjunto padrão do Tailwind ou que foram explicitamente estendidas na configuração

2. **Solução para problemas com bordas**
   - Em vez de usar `border-[cor]` diretamente, separe a propriedade da cor:
     ```css
     /* Incorreto */
     @apply border-neutral-700;
     
     /* Correto */
     @apply border border-gray-700;
     ```
   - Ou use cores definidas no tema:
     ```css
     @apply border-gray-700; /* Cor padrão do Tailwind */
     @apply border-border; /* Cor definida no tema */
     ```

3. **Estenda o tema se necessário**
   - Se precisar de cores personalizadas, adicione-as ao `tailwind.config.js`:
     ```js
     theme: {
       extend: {
         colors: {
           'custom-color': '#123456',
         }
       }
     }
     ```

### Erro: "lightningcss"

Se encontrar erros relacionados ao lightningcss:

```bash
npm rebuild
# ou
npm install lightningcss@1.18.0 --legacy-peer-deps
```

## Problemas de Compatibilidade

### Versões do Next.js e React

- O projeto foi configurado para usar Next.js 14.1.0 (LTS) e React 18.2.0
- Evite atualizar para versões mais recentes sem testar completamente
- Se precisar atualizar, faça-o gradualmente e teste cada etapa

### Dependências Conflitantes

Se encontrar erros de dependências conflitantes:

```bash
npm install --legacy-peer-deps
```

## Problemas de Renderização

### Estilos não aplicados corretamente

Se os estilos não estiverem sendo aplicados:

1. Verifique se o componente `Providers` está envolvendo a aplicação no `layout.tsx`
2. Confirme que o arquivo `globals.css` está sendo importado no layout raiz
3. Limpe o cache do Next.js:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Componentes UI não renderizando corretamente

1. Verifique se todas as dependências do Radix UI estão instaladas
2. Confirme que os componentes estão sendo importados corretamente
3. Verifique se há erros no console do navegador

## Problemas de Implantação

### Erros na Vercel

Se encontrar erros ao implantar na Vercel:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Tente implantar com a opção de ignorar a verificação de build:
   ```bash
   vercel --force
   ```

### Problemas com Docker

Se encontrar problemas ao usar Docker:

1. Verifique se o Dockerfile está configurado corretamente
2. Tente reconstruir a imagem sem cache:
   ```bash
   docker build --no-cache -t normanly-hub .
   ```

## Quando tudo mais falhar

Se você tentou todas as soluções acima e ainda está enfrentando problemas:

1. Verifique os logs de erro completos
2. Consulte a documentação oficial do Next.js e Tailwind CSS
3. Crie um ambiente de desenvolvimento limpo e reinstale as dependências
4. Entre em contato com o suporte em suporte@normanly.com
