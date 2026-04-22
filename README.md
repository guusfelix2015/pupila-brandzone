# Pupila Brand Zone

MVP frontend para gerenciamento local de referencias visuais da Pupila Brand Studio.

## Stack

- React
- TypeScript
- Vite
- shadcn/ui-style components
- Tailwind CSS
- Zustand
- React Hook Form
- Zod
- Jest
- React Testing Library
- `localStorage`

## Escopo do MVP

O MVP implementa:

- cadastro e listagem de imagens por URL;
- cadastro e listagem de paletas de cores;
- grupos;
- tags;
- comentarios em imagens e paletas;
- busca por titulo, comentario e tag;
- filtros por grupo e tag;
- persistencia local com `localStorage`;
- testes unitarios das camadas principais.

Fora do escopo atual:

- backend real;
- autenticacao;
- exportacao/importacao;
- recursos de IA;
- dashboard de estatisticas;
- editor avancado de cores;
- IndexedDB.

## Como executar

Instalar dependencias:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build de producao:

```bash
npm run build
```

Executar preview do build:

```bash
npm run preview
```

## Validacoes

Formatar:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

Typecheck:

```bash
npm run typecheck
```

Testes:

```bash
npm run test
```

Coverage:

```bash
npm run test:coverage
```

O relatorio HTML fica em:

```txt
coverage/lcov-report/index.html
```

O coverage exige pelo menos 70% de branches. A coleta cobre `lib`, stores, hooks/controllers e componentes. Arquivos de entrada/composicao de pagina e views finas ficam fora do calculo porque a regra do projeto concentra comportamento em controllers e componentes testaveis.

Gate completo recomendado:

```bash
npm run format && npm run lint && npm run typecheck && npm run build && npm run test
```

## Estrutura

```txt
src/
  app/
    providers/
    routes/
  pages/
    images/
    palettes/
    groups/
    tags/
  core/
    constants/
    types/
  features/
    images/
    palettes/
    groups/
    tags/
  shared/
    components/
    ui/
  store/
  lib/
    factories/
    filters/
    search/
    storage/
    utils/
    validation/
  styles/
  test/
```

## Arquitetura

As paginas seguem o padrao Page + Controller + View:

```tsx
export function ImagesPage() {
  const imagesPageController = useImagesPageController();

  return <ImagesPageView imagesPageController={imagesPageController} />;
}
```

Regras aplicadas:

- `pages/` conecta controller e view;
- controllers ficam em `features/<module>/hooks`;
- views ficam em `features/<module>/views`;
- componentes especificos ficam em `features/<module>/components`;
- estado global fica em Zustand;
- acesso ao `localStorage` fica isolado em `src/lib/storage`;
- regras puras ficam em `src/lib`;
- componentes filhos recebem apenas dados e callbacks necessarios.

## Decisoes tecnicas

- Vite foi usado por ser suficiente para uma SPA com dados locais.
- Zustand centraliza estado global e simplifica actions do MVP.
- React Hook Form + Zod separam formulario e validacao.
- Busca e filtros rodam em memoria por ser um MVP local.
- `localStorage` foi escolhido por simplicidade e por nao haver backend.
- Testes foram separados por camada: `lib`, store, hooks/controllers e componentes.

## Testes cobertos

- schemas Zod;
- helpers de cores;
- busca;
- filtros;
- persistencia local;
- actions da store;
- controllers de grupos, tags, imagens e paletas;
- formularios;
- listas/grids;
- toolbar de busca e filtros.

## Limitacoes conhecidas

- Dados ficam apenas no navegador atual.
- Imagens sao referenciadas por URL; arquivos binarios nao sao armazenados.
- Sem sincronizacao entre dispositivos.
- Sem autenticacao.
- Sem backend real.
- Testes end-to-end nao foram implementados.

## Possiveis melhorias

- Exportacao e importacao de dados para backup e portabilidade.
- Backend real com sincronizacao entre dispositivos.
- Autenticacao e isolamento de acervo por usuario.
- Visualizacoes avancadas para paletas e referencias.
- Editor avancado de cores com ajustes e variacoes.
- Testes end-to-end para cobrir jornadas completas da interface.
