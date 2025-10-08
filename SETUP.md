# 🚀 Setup Completo - Lumina Book

Guia definitivo para configurar o projeto em uma nova máquina após clonar do Git.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **PostgreSQL** (versão 14 ou superior) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **npm** ou **yarn** (vem com Node.js)

---

## 🔧 Passo a Passo

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/cantalusto/lumina-book.git
cd lumina-book
```

### 2️⃣ Instalar Dependências

```bash
npm install
# ou
yarn install
```

**Tempo estimado:** 2-5 minutos

### 3️⃣ Configurar PostgreSQL

#### **Criar o Banco de Dados:**

**Opção 1 - Via psql (terminal):**
```bash
psql -U postgres
CREATE DATABASE lumina;
\q
```

**Opção 2 - Via pgAdmin ou DBeaver:**
- Abra a ferramenta
- Crie um novo banco chamado `lumina`

### 4️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Banco de Dados (OBRIGATÓRIO)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/lumina?schema=public"

# NextAuth (OBRIGATÓRIO)
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google Books API (OBRIGATÓRIO)
GOOGLE_BOOKS_API_KEY="sua-chave-do-google-books"

# Gemini AI API (OBRIGATÓRIO)
GEMINI_API_KEY="sua-chave-do-gemini"

# Email (OPCIONAL - para reset de senha)
EMAIL_SERVER_USER="seu-email@gmail.com"
EMAIL_SERVER_PASSWORD="sua-senha-de-app"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@lumina.com"
```

#### **⚠️ IMPORTANTE: Como obter as chaves**

**NEXTAUTH_SECRET** (gere uma chave aleatória):
```bash
# No terminal:
openssl rand -base64 32

# Ou use: https://generate-secret.vercel.app/32
```

**Google Books API:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs & Services" > "Library"
4. Busque por "Books API" e ative
5. Vá em "Credentials" > "Create Credentials" > "API Key"
6. Copie a chave gerada

**Gemini API:**
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Clique em "Get API Key"
3. Crie ou selecione um projeto
4. Copie a API Key gerada

### 5️⃣ Configurar o Banco de Dados

#### **Aplicar Migrations:**

```bash
# Aplicar todas as migrations
npx prisma migrate deploy

# OU em desenvolvimento (recomendado):
npx prisma migrate dev
```

#### **Gerar Prisma Client:**

```bash
npx prisma generate
```

#### **Popular com Dados de Exemplo (opcional):**

```bash
npx prisma db seed
```

Isso criará:
- ✅ 10 livros de exemplo
- ✅ 8 conquistas
- ✅ 1 usuário de teste: `user@example.com` / `password123`
- ✅ 1 clube de leitura exemplo

### 6️⃣ Verificar Configuração

```bash
# Ver status das migrations
npx prisma migrate status

# Abrir interface visual do banco
npx prisma studio
```

O Prisma Studio abrirá em: http://localhost:5555

### 7️⃣ Iniciar o Projeto

```bash
npm run dev
# ou
yarn dev
```

Abra no navegador: **http://localhost:3000**

---

## ✅ Checklist de Verificação

Antes de começar a usar o projeto, verifique:

- [ ] **Node.js instalado** - `node -v` (deve mostrar v18+)
- [ ] **PostgreSQL rodando** - Verifique o serviço
- [ ] **Banco de dados criado** - Banco `lumina` existe
- [ ] **Arquivo .env configurado** - Todas as variáveis preenchidas
- [ ] **Dependências instaladas** - Pasta `node_modules` existe
- [ ] **Migrations aplicadas** - `npx prisma migrate status` sem erros
- [ ] **Prisma Client gerado** - Pasta `node_modules/.prisma` existe
- [ ] **Projeto rodando** - http://localhost:3000 abre
- [ ] **Login funciona** - Consegue fazer login com user@example.com

---

## 🐛 Troubleshooting (Problemas Comuns)

### ❌ Erro: "Property 'clubDiscussion' does not exist on type..."

**Causa:** Cache do TypeScript desatualizado após gerar Prisma Client

**Solução:**
```bash
# No VS Code, pressione:
Ctrl + Shift + P

# Digite e selecione:
Developer: Reload Window
```

### ❌ Erro: "P1001: Can't reach database server"

**Causas possíveis:**
- PostgreSQL não está rodando
- Credenciais erradas no DATABASE_URL
- Porta 5432 ocupada por outro processo

**Soluções:**
```bash
# Verificar se PostgreSQL está rodando:
# Windows:
services.msc  # Procure por "postgresql"

# Ou tente conectar:
psql -U postgres -d lumina
```

### ❌ Erro: "prisma command not found"

**Solução:**
```bash
# Reinstalar dependências:
npm install

# Ou usar via npx:
npx prisma [comando]
```

### ❌ Erro: "Migration failed" ou "Database drift detected"

**Solução:**
```bash
# Resetar banco e reaplicar migrations:
npx prisma migrate reset

# Ou criar nova migration:
npx prisma migrate dev --name fix_schema
```

### ❌ Erro: "Invalid `prisma.X.findMany()` invocation"

**Causa:** Prisma Client desatualizado

**Solução:**
```bash
npx prisma generate
```

### ❌ Página em branco ou erro 500

**Verificar:**
1. Console do navegador (F12) - Procure erros
2. Terminal do Next.js - Veja o log de erros
3. Variáveis de ambiente - Todas configuradas?
4. Banco de dados - Conectado?

---

## 📊 Estrutura de Migrations

O projeto possui **6 migrations**:

1. `20251007225029_init` - Configuração inicial
2. `20251007235127_add_auth_security_fields` - Segurança auth
3. `20251008153616_add_user_bio` - Campo bio do usuário
4. `20251008160810_add_social_models` - Feed social (posts, likes, comments)
5. `20251008195145_add_club_discussions_and_invites` - Sistema de clubes
6. `20251008200430_sync_all_models` - Sincronização final

**Todas serão aplicadas automaticamente** ao rodar `npx prisma migrate dev`

---

## 🗄️ Modelos do Banco (23 tabelas)

- **Auth:** User, Account, Session, VerificationToken
- **Perfil:** ReadingProfile, UserAchievement, Achievement
- **Livros:** Book, Swipe, ReadingHistory, BookCollection, BookCollectionItem
- **Clubes:** Club, ClubMember, ClubBook, ClubDiscussion, ClubDiscussionLike, ClubInvite
- **Social:** Post, Follow, Like, Comment
- **Sistema:** AuditLog

---

## 📱 Funcionalidades Disponíveis

Após o setup completo, você terá acesso a:

### ✅ Autenticação
- Registro e login com email/senha
- Reset de senha por email (se EMAIL_SERVER configurado)
- Sessão persistente com NextAuth

### ✅ Descoberta de Livros
- Swipe de livros estilo Tinder
- Busca na Google Books API
- Recomendações personalizadas com IA

### ✅ Chat com IA (Lumina)
- Conversa sobre livros com Gemini AI
- Busca integrada de livros durante chat
- Livros clicáveis para ver detalhes

### ✅ Biblioteca Pessoal
- Livros curtidos
- Coleções customizadas
- Histórico de leitura

### ✅ Feed Social
- Posts sobre livros
- Seguir outros usuários
- Curtir e comentar

### ✅ Clubes de Leitura
- Criar e gerenciar clubes
- Sistema de discussões/chat do clube
- Votação e gerenciamento de livros
- Convites para clubes privados

### ✅ Perfil
- Bio e estatísticas
- Conquistas desbloqueáveis
- Histórico de atividades

---

## 🚀 Deploy (Produção)

### **Opção 1: Vercel (Recomendado)**

1. Crie conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente no painel da Vercel:
   - DATABASE_URL (use um PostgreSQL na nuvem)
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (https://seu-dominio.vercel.app)
   - GOOGLE_BOOKS_API_KEY
   - GEMINI_API_KEY

4. Deploy automático!

**Database na Nuvem (escolha um):**
- [Neon](https://neon.tech/) - Serverless Postgres (free tier)
- [Supabase](https://supabase.com/) - Postgres completo (free tier)
- [Railway](https://railway.app/) - PostgreSQL gerenciado

**IMPORTANTE:** Após deploy, rode as migrations:
```bash
# Instale Vercel CLI:
npm i -g vercel

# Conecte ao projeto:
vercel link

# Execute migrations:
vercel env pull .env.production
npx prisma migrate deploy
```

### **Opção 2: Railway**

1. Crie conta em [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Adicione PostgreSQL ao projeto
4. Configure variáveis de ambiente
5. Deploy automático!

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor dev
npm run build            # Build para produção
npm start                # Rodar build de produção

# Prisma
npx prisma studio        # Interface visual do banco
npx prisma migrate dev   # Criar nova migration
npx prisma migrate reset # Resetar banco e reseeder
npx prisma db seed       # Popular com dados de exemplo
npx prisma generate      # Gerar Prisma Client
npx prisma migrate status # Ver status das migrations

# TypeScript
npx tsc --noEmit         # Verificar erros de tipo

# Linting
npm run lint             # Verificar código
```

---

## 📚 Recursos Adicionais

- **Documentação do Projeto:** Veja os arquivos `*.md` na raiz
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org
- **Gemini AI Docs:** https://ai.google.dev/docs
- **Google Books API:** https://developers.google.com/books

---

## 🆘 Precisa de Ajuda?

1. **Verifique o Troubleshooting** acima
2. **Veja os logs** no terminal e console do navegador
3. **Consulte a documentação** dos arquivos `*.md`
4. **Verifique issues no GitHub** do projeto

---

:

1. **Faça login** com `user@example.com` / `password123`
2. **Explore a Discover** - Sistema de swipe de livros
3. **Teste o Chat Lumina** - Converse sobre livros com IA
4. **Crie um Clube** - Comece um clube de leitura
5. **Personalize o Perfil** - Adicione sua bio e foto

---

**🎉 Setup completo! Aproveite o Lumina Book!**

---

_Desenvolvido com 💜 - Lumina Book Team_
