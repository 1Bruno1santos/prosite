# Claude Code Assistant Instructions

## Comandos Importantes

### Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Executar testes
pnpm test

# Lint e formatação
pnpm lint
pnpm format
```

### Banco de Dados

```bash
# Executar migrations
cd packages/database && npx tsx src/run-migration.ts

# Executar seed
cd packages/database && sqlite3 data/prosite.db < src/seed.sql

# Verificar dados
sqlite3 packages/database/data/prosite.db ".tables"
```

### Docker

```bash
# Build e executar
docker-compose up -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

## Estrutura do Projeto

- `apps/frontend` - App React para clientes
- `apps/admin` - App React para administradores
- `apps/backend` - API Express
- `packages/shared` - Types e utilidades compartilhadas
- `packages/ui` - Componentes UI compartilhados
- `packages/database` - Schema e migrations

## Notas Importantes

1. **Better-SQLite3**: Devido a problemas com native modules no WSL, usamos scripts SQL diretos para migrations e seed.

2. **Autenticação**: JWT com access token (12h) e refresh token (30d).

3. **Credenciais de teste**:
   - Admin: admin@prosite.com / admin123456
   - Cliente: test@example.com / test123456

4. **Portas**:
   - Backend: 3001
   - Frontend: 3000
   - Admin: 3002
   - MailHog: 8025 (UI), 1025 (SMTP)

## Próximos Passos

1. Implementar interface admin completa
2. Sistema de templates
3. Logs e auditoria detalhados
4. Migração para PostgreSQL
5. Testes E2E com Playwright
6. Monitoramento com Prometheus/Grafana
