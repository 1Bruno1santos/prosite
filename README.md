# ProSite - Plataforma de Gestão de Bots

Sistema web para gestão self-service de configurações de bots de jogo.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js 20 + Express + TypeScript
- **Database**: SQLite (migração futura para PostgreSQL)
- **Monorepo**: pnpm workspaces + Turbo

## 📦 Estrutura do Projeto

```
prosite/
├── apps/
│   ├── frontend/     # App React para clientes
│   ├── admin/        # App React para admin
│   └── backend/      # API Express
├── packages/
│   ├── shared/       # Types e utils compartilhados
│   ├── ui/          # Componentes UI compartilhados
│   └── database/    # Schema e migrations
└── infrastructure/  # Docker, K8s, Terraform
```

## 🛠️ Setup do Desenvolvimento

### Pré-requisitos

- Node.js 20+
- pnpm 8+
- SQLite3

### Instalação

```bash
# Clone o repositório
git clone https://github.com/1Bruno1santos/prosite.git
cd prosite

# Instale as dependências
pnpm install

# Setup do banco de dados
pnpm db:migrate
pnpm db:seed

# Copie os arquivos de ambiente
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### Executando o Projeto

```bash
# Desenvolvimento (todos os apps)
pnpm dev

# Apenas backend
pnpm --filter @prosite/backend dev

# Apenas frontend
pnpm --filter @prosite/frontend dev
```

### Docker

```bash
# Build e run com Docker Compose
docker-compose up -d

# Logs
docker-compose logs -f
```

## 🔐 Credenciais de Teste

- **Admin**: admin@prosite.com / admin123456
- **Cliente**: test@example.com / test123456

## 📝 Scripts Disponíveis

- `pnpm dev` - Inicia todos os apps em modo desenvolvimento
- `pnpm build` - Build de produção
- `pnpm test` - Executa testes
- `pnpm lint` - Linting do código
- `pnpm typecheck` - Verifica tipos TypeScript
- `pnpm db:migrate` - Executa migrations
- `pnpm db:seed` - Popula banco com dados de teste

## 🔧 Configuração

### Backend (.env)

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=./data/prosite.db
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
WINDOWS_SERVICE_URL=https://localhost:4433
WINDOWS_SERVICE_API_KEY=your-api-key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## 📊 Roadmap

- [x] Setup inicial do monorepo
- [x] Autenticação JWT
- [x] CRUD de castelos
- [x] Interface cliente
- [ ] Interface admin
- [ ] Sistema de templates
- [ ] Logs e auditoria
- [ ] Migração para PostgreSQL
- [ ] Deploy em produção

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Proprietary - Todos os direitos reservados
