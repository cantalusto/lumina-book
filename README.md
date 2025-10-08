# ✨ Lúmina

<div align="center">

![Lúmina Logo](https://img.shields.io/badge/Lúmina-Iluminando%20sua%20jornada%20literária-blueviolet?style=for-the-badge)

**Descubra seu próximo livro perfeito através de vibes, mood e inteligência artificial**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[📖 Documentação Completa](DEPLOY.md) · [🔐 OAuth Setup](OAUTH_SETUP.md) · [Reportar Bug](https://github.com/seu-usuario/lumina/issues)

</div>

---

## 📖 Sobre o Projeto

**Lúmina** é uma plataforma inovadora de descoberta de livros que vai além dos algoritmos tradicionais. Utilizamos IA e um sistema único de **vibes** para conectar leitores a livros que realmente ressoam com seu momento de vida, humor e preferências literárias.

---

## 🚀 Funcionalidades

### 🔐 Autenticação & Segurança
- ✅ Login com email/senha (bcrypt hash)
- ✅ OAuth (Google, GitHub)
- ✅ Reset de senha com email
- ✅ Verificação de email
- ✅ Rate limiting (proteção contra ataques)
- ✅ Audit logs (histórico de segurança)
- ✅ Middleware de proteção de rotas

### 🎨 Descoberta por Vibes
- 💫 Sistema de swipe intuitivo
- 🌙 Filtros por atmosfera e mood
- ⚡ Recomendações contextuais
- 📚 Integração com Open Library API
- ❤️ Super like para favoritos

### 📚 Biblioteca Pessoal
- 📊 Estatísticas de leitura
- 🏷️ Organização por status e vibes
- 📈 Acompanhamento de progresso
- ⭐ Sistema de avaliações
- 🔍 Busca e filtros avançados

### 👥 Clubes de Leitura
- 💬 Sistema de comunidades
- 📅 Livro do mês
- 🎯 Criação de clubes públicos/privados
- 🏆 Engajamento em grupo

### 🎮 Gamificação (Planejado)
- 🏅 Sistema de conquistas
- 📊 Rotas de leitura temáticas
- 🔥 Streaks de leitura
- 🎖️ Badges personalizados

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** - App Router, Server Components
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações suaves
- **Radix UI** - Componentes acessíveis
- **shadcn/ui** - Sistema de design

### Backend
- **Next.js API Routes** - Serverless
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Banco relacional
- **NextAuth.js** - Autenticação
- **Nodemailer** - Envio de emails
- **bcryptjs** - Hash de senhas

### DevOps
- **Vercel** - Hospedagem e CI/CD
- **GitHub** - Controle de versão
- **Prisma Migrate** - Migrations

---

## 📦 Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lumina.git
cd lumina

# Instale dependências
npm install

# Configure .env
cp .env.example .env
# Edite .env com suas credenciais

# Configure banco de dados
npx prisma migrate dev
npx prisma generate

# Inicie o servidor
npm run dev
```

Acesse: **http://localhost:3000**

📖 **Deploy na Vercel**: Veja [DEPLOY.md](DEPLOY.md)

---

## ⚙️ Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lumina"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"  # gere com: openssl rand -base64 32

# OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# Email (opcional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="seu@email.com"
EMAIL_SERVER_PASSWORD="sua_senha_app"
EMAIL_FROM="noreply@lumina.com"
```

---

## 📂 Estrutura do Projeto

```
lumina/
├── app/
│   ├── (dashboard)/         # Rotas protegidas
│   │   ├── discover/       # Swipe de livros
│   │   ├── library/        # Biblioteca
│   │   ├── clubs/          # Clubes
│   │   └── profile/        # Perfil
│   ├── auth/               # Autenticação
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/                # API Routes
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn components
│   └── features/           # Feature components
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   └── email.ts           # Email service
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── middleware.ts          # Auth middleware
├── DEPLOY.md             # Guia de deploy
└── OAUTH_SETUP.md        # Configurar OAuth
```

---

## 🔐 Segurança Implementada

- ✅ **Password Hashing**: bcrypt com 12 rounds
- ✅ **JWT Sessions**: Tokens seguros
- ✅ **CSRF Protection**: Built-in NextAuth
- ✅ **Rate Limiting**: Proteção contra brute force
- ✅ **Audit Logs**: Rastreamento de ações
- ✅ **Email Verification**: Confirmação de conta
- ✅ **Password Reset**: Tokens temporários (1h)
- ✅ **OAuth 2.0**: Login social seguro

---

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npm run db:migrate   # Rodar migrations
npm run db:push      # Push schema (dev)
npm run db:seed      # Popular banco
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! 🎉

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit: `git commit -m 'feat: Minha feature'`
4. Push: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

### Convenções de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👥 Autor

**Lucas**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- Comunidade open source ❤️

---

<div align="center">

**Feito com ❤️ e ☕**

⭐ **Star este projeto se ele te ajudou!**

</div>
