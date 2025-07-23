Tu és ClaudeCode, uma IA engenheira de software “full‑stack++” especializada em entregar produtos de classe enterprise—do discovery ao deploy—com qualidade de código, segurança e performance de referência. Receberás abaixo o PRD completo de uma Plataforma Web de Gestão de Contas de Bot de Jogo. A tua missão é:

Planear minuciosamente a entrega (arquitetura, backlog, roadmap de sprints);

Executar o desenvolvimento (frontend, backend, DB, CI/CD, IaC) com código pronto para produção;

Melhorar & otimizar continuamente (refactoring, performance tuning, hardening de segurança);

Ultrapassar o impensável — propor inovações além do escopo sempre que tragam ROI mensurável (p. ex. migração zero‑downtime para PostgreSQL, AI assistant in‑app, auto‑healing infra).

2. Entradas fornecidas
   «‹‹PRD_COMPLETO››»  ← substitui aqui.

Nenhum outro input será fornecido salvo tuas próprias perguntas.

3. Saídas esperadas
   Plano de voo inicial (entregue imediatamente):

Resumo executivo dos requisitos;

Lista de dúvidas ou ambiguidades a clarificar;

Diagrama de alto nível (texto ASCII ou PlantUML) da arquitetura proposta;

Estrutura de pastas/repos sugerida.

Backlog priorizado em formato table markdown:

Épicos → funcionalidades → tarefas → sub‑tasks;

Duração estimada (ideia de story points ou horas);

Critérios de aceite por item.

Roadmap de sprints (MVP → v1.0):

Sprint #, datas, objetivos, entregáveis, métricas de saída.

Artefactos técnicos:

Diagramas ER, OpenAPI Spec, documentação de endpoints;

Arquivos Dockerfile/compose, manifests K8s ou Terraform;

Scripts de CI (GitHub Actions) incluindo lint, test, build, deploy.

Código fonte:

Frontend React 18 + Vite + Tailwind + TypeScript, cobertura de testes > 80 %;

Backend Node 20 + Express + TypeScript, testes unitários e de integração;

Seed de base de dados com fixtures de exemplo.

Relatórios de melhoria contínua:

Checklist OWASP Top‑10 mitigations;

Benchmarks antes/depois de otimizações críticas (p99, Lighthouse, etc.);

Plano de migração SQLite→PostgreSQL sem downtime.

Propostas “moonshot”:

Máx. 3 ideias disruptivas, cada uma com análise de viabilidade, custo, risco, benefício.

4. Processo de trabalho
   Análise: revê exaustivamente o PRD, identifica lacunas.

Perguntas estruturadas ao stakeholder (no máximo 10 por iteração, numeradas).

Produção incremental: após cada resposta, atualiza plano e código, executa testes, mostra logs/TAP.

Auto‑revisão: utiliza ferramentas de static analysis, linters, cobertura; se score < A, refatora antes de entregar.

Documentação viva: atualiza README, CHANGELOG e diagramas sempre que houver alteração relevante.

Critérios de Done: cada tarefa só fecha com testes verdes, code review interno, atualização de docs e deploy em ambiente staging automático.

5. Expectativas de qualidade
   Performance ≥ 95 Lighthouse; API p99 < 300 ms a 1 000 clientes concorrentes.

Segurança : CSP estrita, rate‑limit 100 RPM, rot. de segredo diária, JWT httpOnly‑secure‑strict.

DX : comandos pnpm dev, pnpm test, pnpm deploy funcionais out‑of‑the‑box.

Observabilidade : logs JSON, métricas Prometheus, tracing OpenTelemetry.

6. Formato de comunicação
   Usa Português técnico claro e conciso.

Responde sempre em markdown, sem HTML salvo quando estritamente necessário.

Quando pedires clarificação, indica porquê a resposta é crítica para o próximo passo.

7. Começo da execução
   A seguir ao envio deste prompt, executa a etapa 1 (Plano de voo inicial). Só avança para o código após obter ou inferir respostas às tuas dúvidas essenciais.

# Documento de Requisitos do Produto (PRD)

## 1. Informações Gerais

- **Projeto:** Plataforma Web de Gestão de Contas de Bot de Jogo
- **Versão:** 1.0 — 23‑Jul‑2025
- **Cliente:** Bruno Santos / Diesel
- **Autor:** ChatGPT (com base no briefing fornecido)
- **Objetivo deste PRD:** Descrever de forma exaustiva tudo o que é necessário para que um agente de IA possa implementar, testar e lançar o projeto sem informação adicional.

---

## 2. Visão e Objetivos

A plataforma deve permitir que jogadores administrem de forma _self‑service_ as configurações dos seus "castelos" (contas de jogo), enquanto o administrador gere clientes, planos e métricas. Os objetivos principais são:

1. **Automatizar** o processo hoje manual, eliminando dependência de suporte humano.
2. **Escalar** para centenas de clientes sem penalizar performance.
3. **Garantir segurança** de dados (credenciais, tokens, ficheiros JSON) de ponta a ponta.
4. **Fornecer UX consistente** em desktop, tablet e telemóvel.

---

## 3. Stakeholders & Personas

| Persona             | Papel             | Necessidades‑chave                                                                |
| ------------------- | ----------------- | --------------------------------------------------------------------------------- |
| Jogador             | Cliente final     | Acesso rápido, interface intuitiva, fiabilidade.                                  |
| Admin               | Gestor do sistema | Visão 360º dos clientes, controlo granular de permissões, métricas em tempo real. |
| Equipa DevOps       | Operação          | Deploy contínuo, monitorização, backups.                                          |
| Equipa de Segurança | Auditoria         | Logs completos, alertas, encriptação.                                             |

---

## 4. Escopo Funcional (Alto Nível)

1. **Autenticação & Sessão (clientes e admin)**
2. **Dashboard do Cliente** com lista de castelos
3. **Gestão de Castelo** (>50 parâmetros editáveis)
4. **Billing & Ciclos de Ativação** (admin)
5. **Templates de Castelo** (admin)
6. **Logs & Auditoria** (admin)
7. **Dashboard de Métricas** (admin)
8. **Reset de Password por email**
9. **Comunicação segura com Serviço Windows (API REST)**
10. **Sistema de Permissões granular**

---

## 5. Mapa de Navegação e Páginas

| #   | URL                     | Visível a | Componentes principais                                                 |
| --- | ----------------------- | --------- | ---------------------------------------------------------------------- |
| 1   | /login                  | Jogador   | Formulário de credenciais, link "Esqueci‑me da password".              |
| 2   | /forgot-password        | Jogador   | Envio de email com token.                                              |
| 3   | /reset-password/\:token | Jogador   | Definição de nova password.                                            |
| 4   | /dashboard              | Jogador   | Greeting, lista de castelos, CTA para editar.                          |
| 5   | /castle/\:id            | Jogador   | Tabs: Geral, Avançado, Logs; >50 campos configuráveis; botão “Salvar”. |
| 6   | /profile (opcional)     | Jogador   | Alterar email / password.                                              |
| 7   | /admin/login            | Admin     | Autenticação separada.                                                 |
| 8   | /admin/dashboard        | Admin     | KPIs em tempo real, gráficos (online, alterações, renovações).         |
| 9   | /admin/clients          | Admin     | Tabela com busca, filtros, CRUD.                                       |
| 10  | /admin/clients/\:id     | Admin     | Dados do cliente, datas de faturação, status, castelos, logs.          |
| 11  | /admin/templates        | Admin     | CRUD de templates de castelo.                                          |
| 12  | /admin/logs             | Admin     | Pesquisa de alterações (quem, quando, o quê).                          |
| 13  | /admin/metrics          | Admin     | Gráficos detalhados (último dia, 7 dias, mês).                         |
| 14  | /admin/settings         | Admin     | Configs globais (email SMTP, chaves API).                              |

> **Nota:** Todas as páginas devem carregar < 2 s em rede 4G.

---

## 6. Fluxos de Utilizador (Resumidos)

### 6.1 Jogador

1. Faz login → é redirecionado para /dashboard.
2. Seleciona castelo → ajusta parâmetros → "Salvar".
3. Backend grava DB, chama API Windows → devolve sucesso.

### 6.2 Admin

1. Login admin.
2. Acede a /admin/dashboard.
3. Navega até /admin/clients, cria novo cliente com data início + dias de uso.
4. Opcional: aplica template → cliente passa a ver parâmetros permitidos.
5. Analisa métricas em /admin/metrics.

---

## 7. Requisitos Funcionais Detalhados

### 7.1 Autenticação & Sessão

- **F‑1.1** Login deve usar email + hash bcrypt (cost ≥12).
- **F‑1.2** Sessões mantidas via JWT (exp: 12 h) com refresh token (30 dias).
- **F‑1.3** Tokens guardados apenas em `httpOnly, secure, sameSite=strict` cookies.
- **F‑1.4** Endpoint /auth/forgot envia email com token único (válido 30 min).

### 7.2 Dashboard do Cliente

- **F‑2.1** Listar castelos do cliente ordenados por nome.
- **F‑2.2** Mostrar badge de estado (Ativo / Suspenso).
- **F‑2.3** Se cliente desativado, bloquear acesso com modal.

### 7.3 Gestão de Castelo

- **F‑3.1** Renderizar >50 controles (boolean, select, número, texto).
- **F‑3.2** Validação client‑side (React Hook Form) + server‑side (Joi).
- **F‑3.3** Botão "Salvar" deve ficar _disabled_ até alteração.
- **F‑3.4** Backend guarda versão anterior → cria registo em tabela logs.
- **F‑3.5** Chamar `POST /windows-api/castles/:id` enviando JSON completo.

### 7.4 Backoffice

- **F‑4.1** Admin pode CRUD clientes, definir `billing_end`.
- **F‑4.2** Ao expirar `billing_end`, cron job diária desativa cliente.
- **F‑4.3** Admin define quais parâmetros cada cliente vê (ACL via tabela `client_param_allow`).
- **F‑4.4** Dashboard exibe nº clientes ativos, média de requests, etc.

### 7.5 Logs & Auditoria

- **F‑5.1** Cada alteração grava `user_id`, `castle_id`, `field`, `old`, `new`, timestamp.
- **F‑5.2** Interface de busca por intervalo de datas, campo, utilizador.

### 7.6 Email & Reset Password

- **F‑6.1** Enviar email SMTP TLS 1.2.
- **F‑6.2** Link deve abrir componente de redefinição de password.

### 7.7 Responsividade & Acessibilidade

- **F‑7.1** Suportar breakpoints 1280, 768, 480 px.
- **F‑7.2** Contraste AA, navegação por teclado completa.

---

## 8. Requisitos Não Funcionais

| Categoria       | Requisito                                                             |
| --------------- | --------------------------------------------------------------------- |
| Performance     | 95+ no Lighthouse em desktop & mobile.                                |
| Segurança       | OWASP Top‑10 mitigado; HTTPS obrigatório; rate‑limit 100 RPM por IP.  |
| Escalabilidade  | 1 000 clientes simultâneos com p99 < 300 ms.                          |
| Manutenção      | Cobertura de testes ≥80 %.                                            |
| Observabilidade | Logs estruturados (JSON), métricas Prometheus, tracing OpenTelemetry. |

---

## 9. Arquitetura Técnica

1. **Frontend**: React 18, Vite, TypeScript; estado via Context.
2. **Backend**: Node 20 LTS, Express 4, TypeScript.
3. **DB**: SQLite 3 (migração planeada para PostgreSQL ≥v16).
4. **Comunicação** com Serviço Windows: REST JSON sobre HTTPS em porta 4433.
5. **Infra**: Docker Compose local; produção em Kubernetes (opcional future).

---

## 10. Modelo de Dados (Simplificado)

```
Tabela clients
  id PK, email, pass_hash, created_at, last_login, billing_end, active
Tabela castles
  id PK, client_id FK, name, settings_json, updated_at
Tabela admin_users
  id PK, email, pass_hash, role
Tabela logs
  id PK, client_id, castle_id, field, old_value, new_value, created_at
Tabela templates
  id PK, name, settings_json
```

---

## 11. API Design (REST)

| Método | Endpoint            | Auth      | Request            | Response 200           |
| ------ | ------------------- | --------- | ------------------ | ---------------------- |
| POST   | /auth/login         | —         | email, password    | access + refresh JWT   |
| POST   | /auth/forgot        | —         | email              | 202 Accepted           |
| POST   | /auth/reset         | —         | token, newPassword | 204 No Content         |
| GET    | /castles            | JWT       | —                  | [ {id, name, status} ] |
| GET    | /castles/\:id       | JWT       | —                  | detalhes               |
| PUT    | /castles/\:id       | JWT       | body: settings     | 200 OK                 |
| GET    | /admin/clients      | JWT‑admin | filtros            | lista                  |
| POST   | /admin/clients      | JWT‑admin | body               | objeto                 |
| PUT    | /admin/clients/\:id | JWT‑admin | body               | objeto                 |
| GET    | /admin/logs         | JWT‑admin | filtros            | lista                  |
| GET    | /admin/metrics      | JWT‑admin | —                  | métricas agregadas     |

**Windows Service** | POST | /windows-api/castles/\:id | HMAC header | body: settings_json | 200 OK |

---

## 12. UI/UX Especificações

- **Design System:** Tailwind CSS + Radix UI.
- **Componentes genéricos:** Button, Input, Select, Toggle, Card, Modal.
- **Tabela de Estado de Castelo:** colunas fixas em desktop, scroll horizontal em mobile.
- **Feedback de ação:** Toast 3 s após salvar, spinner inline.
- **Tema:** Dark + Light (preferência do SO por defeito).

---

## 13. Critérios de Aceitação (Exemplo Gherkin)

```
Funcionalidade: Salvar Configurações de Castelo
  Cenário: Jogador altera parâmetro e salva
    Dado que o jogador está autenticado
    E está na página /castle/123
    Quando altera o campo "autoFight" para true
    E clica em "Salvar"
    Então o sistema responde 200 OK
    E mostra toast "Alterações aplicadas"
    E cria log com old=false new=true
```

---

## 14. Métricas de Sucesso

- ≥90 % dos clientes utilizam self‑service sem tickets de suporte.
- <5 % erros 5xx mensais.
- Tempo médio de resposta API <150 ms.

---

## 15. Roadmap & MVP

1. **Sprint 1:** Autenticação cliente, Dashboard lista de castelos.
2. **Sprint 2:** Edição de castelo + salvar.
3. **Sprint 3:** Backoffice (CRUD clientes, billing).
4. **Sprint 4:** Logs, reset password.
5. **Sprint 5:** Dashboards de métricas, hardening segurança.

---

## 16. Riscos & Mitigações

| Risco                       | Impacto                  | Mitigação                             |
| --------------------------- | ------------------------ | ------------------------------------- |
| Crescimento rápido > SQLite | Perda de performance     | Plano de migração para PostgreSQL.    |
| Serviço Windows offline     | Alterações não aplicadas | Implementar fila de retries + alerta. |
| Vazamento de JWT            | Acesso não autorizado    | Rotação diária de chave secreta.      |

---

## 17. Glossário

- **Castelo:** Conta de jogo gerida pelo bot.
- **Template:** Conjunto pré‑definido de configurações.
- **Billing End:** Data‑hora em que expira o ciclo pago.

---

**Fim do Documento**
