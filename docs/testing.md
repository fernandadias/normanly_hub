# Configuração de Testes do Normanly Hub

Este documento descreve a configuração de testes implementada no Normanly Hub para garantir a qualidade e estabilidade do código.

## Estrutura de Testes

```
normanly_hub/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── __tests__/
│   │   │   │   ├── button.test.tsx
│   │   │   │   ├── progress.test.tsx
│   │   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── __tests__/
│   │   │   │   ├── sidebar.test.tsx
│   │   │   │   ├── main-layout.test.tsx
│   │   │   │   └── ...
```

## Ferramentas de Teste

- **Jest**: Framework de teste principal
- **React Testing Library**: Biblioteca para testar componentes React
- **user-event**: Biblioteca para simular interações do usuário
- **jest-dom**: Extensões para matchers de DOM

## Tipos de Testes

### Testes de Componentes UI

Os testes de componentes UI verificam:
- Renderização correta
- Aplicação de variantes e estilos
- Comportamento interativo
- Acessibilidade

### Testes de Layout

Os testes de layout verificam:
- Estrutura e composição
- Comportamento responsivo
- Interações entre componentes
- Estados de navegação

## Mocks

Utilizamos mocks para:
- Componentes filhos em testes de componentes pais
- Hooks do Next.js (usePathname, useRouter)
- APIs do navegador (window.innerWidth, window.scrollY)
- Eventos do DOM

## Execução de Testes

Para executar os testes:

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm test -- --coverage

# Executar testes em modo watch
npm test -- --watch
```

## Boas Práticas

1. **Teste comportamento, não implementação**
   - Foque no que o usuário vê e interage, não em detalhes internos

2. **Use seletores acessíveis**
   - Prefira `getByRole`, `getByLabelText` em vez de `getByTestId`

3. **Teste estados diferentes**
   - Teste componentes em diferentes estados (carregando, erro, sucesso)

4. **Isole os testes**
   - Cada teste deve ser independente e não depender de outros

5. **Mantenha os testes simples**
   - Teste uma coisa por vez, evite testes complexos
