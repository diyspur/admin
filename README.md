# DIYSPUR Admin

Painel administrativo e editorial do clube de leitura DIYSPUR.

## Rotas Administrativas

- **`/admin`** — Painel Geral com visão resumida e atalhos rápidos
- **`/admin/books`** — Catálogo de livros, cadastro e edição de sinopse, capa e páginas
- **`/admin/seasons/[id]`** — Editor de temporada, publicação e agendamento de capítulos
- **`/admin/seasons`** — Lista de temporadas cadastradas
- **`/admin/moderation`** — Fila de moderação comunitária (denúncias, resolução, ocultação)
- **`/entrar`** — Autenticação administrativa com auto-login e acesso em 1 clique

## Arquitetura & Tecnologias

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Backend / Database**: Supabase (PostgreSQL com RLS e RPCs)
- **Estilos**: Design system unificado DIYSPUR em CSS tokens
- **Testes**: Vitest

## Execução Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar testes unitários
npm test

# Build de produção
npm run build
```

## Credenciais & Auto-Login

Configurável via `.env`:
```env
ADMIN_DEFAULT_EMAIL=admin@diyspur.com
ADMIN_DEFAULT_PASSWORD=Admin@Diyspur2026!
NEXT_PUBLIC_ADMIN_DEV_AUTH=true
```
