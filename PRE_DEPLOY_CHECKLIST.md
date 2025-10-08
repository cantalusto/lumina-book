# ✅ Checklist Pré-Deploy - Lúmina

Use este checklist antes de fazer deploy para garantir que tudo está configurado corretamente.

## 📋 Configuração Básica

- [ ] **Variáveis de ambiente** configuradas no `.env`
  - [ ] `DATABASE_URL` (PostgreSQL)
  - [ ] `NEXTAUTH_URL` (http://localhost:3000 em dev)
  - [ ] `NEXTAUTH_SECRET` (gerado com openssl rand -base64 32)

## 🗄️ Banco de Dados

- [ ] PostgreSQL rodando (local ou remoto)
- [ ] Migrations aplicadas: `npx prisma migrate dev`
- [ ] Prisma Client gerado: `npx prisma generate`
- [ ] (Opcional) Seed executado: `npm run db:seed`
- [ ] Conexão testada: tente fazer login

## 🔐 Autenticação

### Email/Senha
- [ ] Registro funcionando
- [ ] Login funcionando
- [ ] Logout funcionando
- [ ] Hash de senha configurado (bcrypt)

### OAuth (Opcional)
- [ ] Google Cloud Console configurado ([OAUTH_SETUP.md](OAUTH_SETUP.md))
  - [ ] `GOOGLE_CLIENT_ID` no `.env`
  - [ ] `GOOGLE_CLIENT_SECRET` no `.env`
  - [ ] Callbacks configurados: `/api/auth/callback/google`
  
- [ ] GitHub Developer Settings configurado
  - [ ] `GITHUB_ID` no `.env`
  - [ ] `GITHUB_SECRET` no `.env`
  - [ ] Callbacks configurados: `/api/auth/callback/github`

### Reset de Senha (Opcional)
- [ ] SMTP configurado
  - [ ] `EMAIL_SERVER_HOST` (ex: smtp.gmail.com)
  - [ ] `EMAIL_SERVER_PORT` (587)
  - [ ] `EMAIL_SERVER_USER` (seu email)
  - [ ] `EMAIL_SERVER_PASSWORD` (app password do Gmail)
  - [ ] `EMAIL_FROM` (noreply@lumina.com)
- [ ] Email de teste enviado com sucesso
- [ ] Link de reset funcionando

## 🎨 Frontend

- [ ] Build sem erros: `npm run build`
- [ ] Todas as páginas carregam sem erro 404
- [ ] Landing page (`/`) funcionando
- [ ] Login (`/auth/signin`) funcionando
- [ ] Cadastro (`/auth/signup`) funcionando
- [ ] Dashboard (`/discover`) funcionando
- [ ] Biblioteca (`/library`) funcionando
- [ ] Clubes (`/clubs`) funcionando
- [ ] Perfil (`/profile`) funcionando

## 🧪 Testes Funcionais

### Autenticação
- [ ] Criar nova conta
- [ ] Fazer login
- [ ] Fazer logout
- [ ] Resetar senha (se configurado)
- [ ] Login com Google (se configurado)
- [ ] Login com GitHub (se configurado)

### Rotas Protegidas
- [ ] Tentar acessar `/discover` sem login → Redireciona para `/auth/signin`
- [ ] Tentar acessar `/library` sem login → Redireciona para `/auth/signin`
- [ ] Tentar acessar `/clubs` sem login → Redireciona para `/auth/signin`
- [ ] Landing page (`/`) acessível sem login

### Funcionalidades
- [ ] Sistema de swipe funcionando
- [ ] Adicionar livro à biblioteca
- [ ] Filtros da biblioteca funcionando
- [ ] Criar clube
- [ ] Entrar em clube

## 📱 Responsividade

- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] Navegação mobile funcionando
- [ ] Imagens carregando corretamente

## 🚀 Deploy na Vercel

### Antes do Deploy
- [ ] Código commitado no GitHub
- [ ] `.gitignore` configurado (não commit `.env`)
- [ ] README.md atualizado
- [ ] `vercel.json` configurado

### Durante Deploy
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas na Vercel:
  - [ ] `DATABASE_URL` (Vercel Postgres, Supabase, Neon, etc.)
  - [ ] `NEXTAUTH_URL` (https://seu-projeto.vercel.app)
  - [ ] `NEXTAUTH_SECRET` (mesmo do dev ou novo)
  - [ ] Variáveis OAuth (se aplicável)
  - [ ] Variáveis Email (se aplicável)
- [ ] Build command: `npm run vercel-build`
- [ ] Deploy iniciado

### Após Deploy
- [ ] Build completado sem erros
- [ ] Site acessível no domínio Vercel
- [ ] Testar login no site de produção
- [ ] Testar criar conta no site de produção
- [ ] OAuth callbacks atualizados:
  - [ ] Google: `https://seu-projeto.vercel.app/api/auth/callback/google`
  - [ ] GitHub: `https://seu-projeto.vercel.app/api/auth/callback/github`
- [ ] Verificar logs na Vercel Dashboard
- [ ] Testar todas as rotas principais

## 🔍 SEO & Performance

- [ ] Favicon configurado (`/public/favicon.ico`)
- [ ] Meta tags configuradas (`app/layout.tsx`)
- [ ] Open Graph tags (para redes sociais)
- [ ] Lighthouse score > 90 (Performance)
- [ ] Imagens otimizadas (Next.js Image)

## 📊 Monitoramento

- [ ] Vercel Analytics ativado
- [ ] Logs de erro configurados
- [ ] Notificações de deploy configuradas (email)

## 📄 Documentação

- [ ] README.md completo
- [ ] DEPLOY.md com instruções
- [ ] OAUTH_SETUP.md com guias OAuth
- [ ] Comentários no código importantes
- [ ] `.env.example` atualizado

## 🔒 Segurança

- [ ] `.env` no `.gitignore` (NUNCA commitar!)
- [ ] Secrets seguros (32+ caracteres)
- [ ] HTTPS em produção (automático na Vercel)
- [ ] CORS configurado (se necessário)
- [ ] Rate limiting ativo (se implementado)

## 📞 Pós-Deploy

- [ ] Compartilhar com beta testers
- [ ] Monitorar erros nas primeiras horas
- [ ] Criar backups do banco de dados
- [ ] Documentar issues encontradas
- [ ] Planejar próximas features

---

## 🎉 Tudo Pronto!

Se todos os itens acima estão checados, seu projeto está pronto para produção!

### Comandos Úteis Pós-Deploy

```bash
# Ver logs em produção
vercel logs

# Reverter para deploy anterior
vercel rollback

# Verificar variáveis de ambiente
vercel env ls

# Pull variáveis localmente
vercel env pull .env.local
```

### Links Importantes

- 🌐 **Seu Site**: https://seu-projeto.vercel.app
- 📊 **Dashboard**: https://vercel.com/seu-usuario/seu-projeto
- 📈 **Analytics**: https://vercel.com/seu-usuario/seu-projeto/analytics
- 🔧 **Logs**: https://vercel.com/seu-usuario/seu-projeto/logs

---

**Boa sorte com seu deploy! 🚀✨**
