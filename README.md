# Pupila Brand Zone

Frontend do Pupila Brand Zone, uma biblioteca visual local para organizar referências de imagens, paletas, grupos, tags e comentários com identidade visual inspirada no ecossistema da Pupila.

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

## Escopo do frontend

O MVP implementa:

- cadastro e listagem de imagens por URL;
- cadastro e listagem de paletas de cores;
- modos de visualização de paletas em grade, lista e detalhes;
- grupos;
- tags;
- comentários em imagens e paletas;
- busca por título, comentário e tag;
- filtros por grupo e tag;
- telas de login e cadastro preparadas para integração futura com backend;
- persistência local com `localStorage`;
- testes unitários das camadas principais.

Fora do escopo atual:

- backend real;
- autenticação funcional;
- exportação/importação;
- recursos de IA;
- dashboard de estatísticas;
- editor avançado de cores;
- IndexedDB.

## Como executar

Instalar dependências:

```bash
cd frontend
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Executar preview do build:

```bash
npm run preview
```

## Validações

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

O relatório HTML fica em:

```txt
coverage/lcov-report/index.html
```

O coverage exige pelo menos 70% de branches. A coleta cobre `lib`, stores, hooks/controllers e componentes. Arquivos de entrada/composição de página e views finas ficam fora do cálculo porque a regra do projeto concentra comportamento em controllers e componentes testáveis.

Gate completo recomendado:

```bash
npm run format && npm run lint && npm run typecheck && npm run build && npm run test
```

## Estrutura

```txt
pupila-brandzone/
  docs/
  frontend/
    src/
      app/
        providers/
        routes/
      pages/
        auth/
        images/
        palettes/
        groups/
        tags/
      core/
        constants/
        types/
      features/
        auth/
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

As páginas seguem o padrão Page + Controller + View:

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
- componentes específicos ficam em `features/<module>/components`;
- autenticação visual segue o mesmo princípio de composição por feature;
- estado global fica em Zustand;
- acesso ao `localStorage` fica isolado em `src/lib/storage`;
- regras puras ficam em `src/lib`;
- componentes filhos recebem apenas dados e callbacks necessários.

## Decisões técnicas

- Vite foi usado por ser suficiente para uma SPA com dados locais.
- Zustand centraliza estado global e simplifica actions do MVP.
- React Hook Form + Zod separam formulário e validação.
- Busca e filtros rodam em memória por ser um MVP local.
- `localStorage` foi escolhido por simplicidade e por não haver backend.
- modos de visualização de paletas usam apenas estado transitório no controller, sem persistência;
- Testes foram separados por camada: `lib`, store, hooks/controllers e componentes.

## Testes cobertos

- schemas Zod;
- helpers de cores;
- busca;
- filtros;
- persistência local;
- actions da store;
- controllers de grupos, tags, imagens e paletas;
- alternância de visualização da feature de paletas;
- formularios;
- listas/grids;
- toolbar de busca e filtros.

## Limitações conhecidas

- Dados ficam apenas no navegador atual.
- Imagens são referenciadas por URL; arquivos binários não são armazenados.
- Sem sincronização entre dispositivos.
- Sem backend real e sem autenticação funcional.
- Testes end-to-end não foram implementados.

## Possíveis melhorias

- Exportação e importação de dados para backup e portabilidade.
- Backend real com sincronização entre dispositivos.
- Autenticação e isolamento de acervo por usuário.
- Visualizações avançadas para paletas e referências.
- Editor avançado de cores com ajustes e variações.
- Testes end-to-end para cobrir jornadas completas da interface.
