# 🚀 Deploy na Vercel - Guia Completo

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta na Vercel (https://vercel.com)
- ✅ Banco de dados PostgreSQL (Vercel Postgres, Supabase, Neon, Railway, etc.)

---

## 🗄️ 1. Configurar Banco de Dados

### Opção A: Vercel Postgres (Recomendado - Integrado)

1. Acesse https://vercel.com/dashboard
2. Vá em "Storage" > "Create Database"
3. Escolha "Postgres"
4. Nome: `lumina-db`
5. Região: `São Paulo (gru1)` (mais próxima do Brasil)
6. Clique em "Create"
7. Copie a `DATABASE_URL` da seção "Quickstart"

### Opção B: Supabase (Gratuito)

1. Acesse https://supabase.com
2. Create new project
3. Nome: `lumina`
4. Database Password: [senha forte]
5. Região: `South America (São Paulo)`
6. Em "Settings" > "Database"
7. Copie "Connection string" (modo `Transaction`)
8. Formato: `postgresql://postgres:[password]@[host]:5432/postgres`

### Opção C: Neon (Serverless - Gratuito)

1. Acesse https://neon.tech
2. Create Project
3. Nome: `lumina`
4. Região: `AWS / South America (São Paulo)`
5. Copie a Connection String
6. Formato: `postgresql://[user]:[password]@[host]/[db]?sslmode=require`

---

## 🔐 2. Gerar NEXTAUTH_SECRET

Execute no terminal (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Ou no Linux/Mac:

```bash
openssl rand -base64 32
```

Copie o resultado (ex: `dGhpc2lzYXJhbmRvbXN0cmluZzEyMzQ1Njc4OTA=`)

---

## 📤 3. Push para GitHub

```bash
# Inicializar git (se ainda não fez)
git init
git add .
git commit -m "feat: initial commit - Lúmina platform"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/lumina.git
git branch -M main
git push -u origin main
```

---

## 🌐 4. Deploy na Vercel

### 4.1 Importar Projeto

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório `lumina`
4. Framework Preset: **Next.js** (detectado automaticamente)
5. Root Directory: `./` (raiz do projeto)
6. **NÃO clique em Deploy ainda!**

### 4.2 Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

#### Obrigatórias:

```env
DATABASE_URL=postgresql://user:password@host:5432/lumina
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=sua_chave_gerada_no_passo_2
```

#### OAuth (Opcional - se configurou):

```env
GOOGLE_CLIENT_ID=seu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-seu_google_client_secret
GITHUB_ID=seu_github_client_id
GITHUB_SECRET=seu_github_client_secret
```

#### Email (Opcional - para reset de senha):

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=seu@gmail.com
EMAIL_SERVER_PASSWORD=sua_senha_app_gmail
EMAIL_FROM=noreply@lumina.com
```

#### APIs (Opcional):

```env
GOOGLE_BOOKS_API_KEY=sua_api_key
GEMINI_API_KEY=sua_gemini_key
OPENAI_API_KEY=sua_openai_key
```

### 4.3 Configurar Build Settings

- **Build Command**: `npm run vercel-build` (já configurado no package.json)
- **Output Directory**: `.next` (padrão Next.js)
- **Install Command**: `npm install` (padrão)

### 4.4 Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. ✅ Projeto no ar!

---

## 🔧 5. Pós-Deploy

### 5.1 Atualizar OAuth Callbacks

Se configurou OAuth, atualize as URLs de callback:

**Google Cloud Console:**
- Authorized redirect URIs: `https://seu-projeto.vercel.app/api/auth/callback/google`

**GitHub Developer Settings:**
- Authorization callback URL: `https://seu-projeto.vercel.app/api/auth/callback/github`

### 5.2 Rodar Migrations

As migrations são executadas automaticamente no build via `prisma migrate deploy`.

Se precisar rodar manualmente:

```bash
npx vercel env pull .env.local
npx prisma migrate deploy
```

### 5.3 Seed do Banco (Opcional)

Para popular com dados iniciais:

```bash
# Baixar env vars da Vercel
npx vercel env pull .env.local

# Rodar seed
npm run db:seed
```

---

## 🌍 6. Configurar Domínio Customizado

1. Na Vercel Dashboard, vá em seu projeto
2. Settings > Domains
3. Adicione seu domínio (ex: `lumina.com.br`)
4. Configure DNS conforme instruções:
   - Tipo: `A` ou `CNAME`
   - Valor: `cname.vercel-dns.com`
5. Aguarde propagação (5-30 minutos)
6. **Atualize NEXTAUTH_URL** com novo domínio

---

## 🔄 7. Deploy Automático

Agora todo push para `main` fará deploy automático!

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Deploy automático na Vercel!
```

### Branches de Preview

Crie branches para testar:

```bash
git checkout -b feature/nova-feature
git push origin feature/nova-feature
# Vercel cria URL de preview automaticamente!
```

---

## 📊 8. Monitoramento

### Analytics

1. Vercel Dashboard > seu projeto > Analytics
2. Veja métricas de performance, visitantes, etc.

### Logs

1. Vercel Dashboard > seu projeto > Deployments
2. Clique no deployment > "View Function Logs"
3. Veja logs em tempo real

### Errors

1. Instale Sentry (opcional):
   ```bash
   npm install @sentry/nextjs
   ```
2. Configure monitoramento de erros

---

## 🛠️ 9. Troubleshooting

### Build Failed

**Erro: "Prisma Client not generated"**
```bash
# Solução: Já configurado no postinstall
npm run postinstall
```

**Erro: "Migration failed"**
```bash
# Verifique DATABASE_URL
# Teste localmente:
npx prisma migrate deploy
```

### Runtime Errors

**Erro: "NEXTAUTH_URL não configurado"**
- Adicione variável de ambiente na Vercel
- Formato correto: `https://seu-dominio.com` (sem barra no final)

**Erro: "Database connection failed"**
- Verifique se DATABASE_URL está correto
- Adicione `?sslmode=require` no final da URL se necessário
- Exemplo: `postgresql://user:pass@host:5432/db?sslmode=require`

### Email não envia

- Verifique credenciais SMTP
- Gmail: Use "App Password" (não senha normal)
- Teste com ferramentas como Mailtrap em dev

---

## 📱 10. Performance & SEO

### Otimizações Automáticas

Vercel já otimiza:
- ✅ Compressão Gzip/Brotli
- ✅ CDN Global
- ✅ Image Optimization
- ✅ Edge Functions
- ✅ Cache inteligente

### Melhorias Adicionais

1. **Adicionar metadata** (SEO):
   ```typescript
   // app/layout.tsx
   export const metadata = {
     title: "Lúmina - Descubra seu próximo livro perfeito",
     description: "Plataforma inteligente de descoberta de livros",
   };
   ```

2. **PWA** (opcional):
   ```bash
   npm install next-pwa
   ```

3. **Analytics**:
   - Vercel Analytics (já incluído)
   - Google Analytics
   - Plausible (privacy-friendly)

---

## 🎉 11. Checklist Final

Antes de compartilhar seu site:

- [ ] ✅ Build sem erros
- [ ] ✅ Migrations aplicadas
- [ ] ✅ OAuth funcionando (se configurou)
- [ ] ✅ Email funcionando (teste reset de senha)
- [ ] ✅ Todas as páginas carregam
- [ ] ✅ Mobile responsivo
- [ ] ✅ Domínio customizado (opcional)
- [ ] ✅ Analytics configurado
- [ ] ✅ Favicon e metadata
- [ ] ✅ Política de privacidade (recomendado)
- [ ] ✅ Termos de uso (recomendado)

---

## 📞 Suporte

**Vercel:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Email: support@vercel.com

**Prisma:**
- Docs: https://www.prisma.io/docs
- Discord: https://pris.ly/discord

**Next.js:**
- Docs: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js

---

## 🎯 URLs Úteis

Após deploy, você terá:

- 🌐 **Site**: `https://seu-projeto.vercel.app`
- 📊 **Dashboard**: `https://vercel.com/seu-usuario/seu-projeto`
- 🔗 **Preview**: `https://seu-projeto-branch.vercel.app` (por branch)
- 📈 **Analytics**: `https://vercel.com/seu-usuario/seu-projeto/analytics`

---

## 🚀 Deploy Alternativo

Se preferir Railway, Render, ou Netlify, consulte:
- Railway: Dockerfile incluído
- Render: Similar à Vercel
- Netlify: Plugin Next.js disponível

**Boa sorte com seu deploy! 🎉✨**
