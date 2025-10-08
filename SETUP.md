# 🚀 Guia de Instalação e Execução - Lúmina

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (versão 14 ou superior)
- **npm** ou **yarn**

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```powershell
npm install
```

### 2. Configurar Banco de Dados

Crie um banco de dados PostgreSQL local:

```sql
CREATE DATABASE lumina;
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

Edite o arquivo `.env` e configure:

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/lumina"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui-gere-com-openssl"

# Opcional - para autenticação com Google
GOOGLE_CLIENT_ID="seu_google_client_id"
GOOGLE_CLIENT_SECRET="seu_google_client_secret"

# Opcional - para IA
OPENAI_API_KEY="sua_openai_api_key"
```

Para gerar o `NEXTAUTH_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Configurar Prisma e Banco de Dados

Gere o cliente Prisma:

```powershell
npx prisma generate
```

Execute as migrations:

```powershell
npx prisma migrate dev --name init
```

Popule o banco com dados de exemplo:

```powershell
npx prisma db seed
```

## 🎨 Executar o Projeto

### Modo Desenvolvimento

```powershell
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Modo Produção

```powershell
npm run build
npm start
```

## 📱 Funcionalidades Disponíveis

### ✅ Implementado

- 🏠 **Landing Page**: Página inicial com apresentação da plataforma
- 🔐 **Autenticação**: Sistema de login/registro
- 📊 **Onboarding**: Fluxo de configuração de perfil em 4 etapas
- 🎯 **Sistema de Perfil**: Preferências multidimensionais
- 📚 **Banco de Dados**: Schema completo com seed de dados

### 🚧 Para Implementar

#### 1. Sistema de Descoberta (Discover)

Criar `app/(dashboard)/discover/page.tsx`:

- Interface de swipe para livros
- Animações com Framer Motion
- Filtros por contexto ("viajar", "relaxar", "aprender")
- Integração com algoritmo de recomendação

#### 2. Biblioteca Pessoal (Library)

Criar `app/(dashboard)/library/page.tsx`:

- Grid de livros organizados por status
- Filtros por vibes e gêneros
- Estatísticas de leitura
- Progresso de leitura

#### 3. Clubes de Leitura (Clubs)

Criar `app/(dashboard)/clubs/page.tsx`:

- Lista de clubes disponíveis
- Criação de novos clubes
- Chat em tempo real
- Progresso coletivo

#### 4. Perfil do Usuário (Profile)

Criar `app/(dashboard)/profile/page.tsx`:

- Visualização 3D do perfil de leitura
- Histórico de leitura
- Conquistas desbloqueadas
- Edição de preferências

#### 5. Sistema de Gamificação

- Algoritmo de conquistas
- Sistema de pontos
- Badges visuais
- Rotas de leitura temáticas

## 🛠️ Ferramentas de Desenvolvimento

### Prisma Studio

Para visualizar e editar dados no banco:

```powershell
npx prisma studio
```

### Linting

```powershell
npm run lint
```

## 📝 Estrutura de Rotas

```
/                          → Landing Page
/login                     → Página de Login
/register                  → Página de Registro
/onboarding                → Configuração inicial
/discover                  → Descoberta de livros (swipe)
/library                   → Biblioteca pessoal
/clubs                     → Clubes de leitura
/profile                   → Perfil do usuário
```

## 🎨 Design System

### Cores

- **Primary**: `#6366f1` (Índigo)
- **Secondary**: `#8b5cf6` (Violeta)
- **Accent**: `#06b6d4` (Ciano)
- **Background**: `#0f172a` (Azul escuro)

### Componentes UI

Baseados em **shadcn/ui**:

- Button
- Card
- Input
- Label
- Avatar
- Dialog
- Tabs
- etc.

## 🔌 APIs Necessárias

### Google Books API (opcional)

Para buscar informações de livros reais:

```
https://www.googleapis.com/books/v1/volumes?q=search+terms
```

### OpenAI API (opcional)

Para recomendações avançadas com IA:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```powershell
npx prisma generate
```

### Erro de conexão com banco de dados

Verifique:
- PostgreSQL está rodando
- Credenciais corretas no `.env`
- Banco `lumina` foi criado

### Erros de TypeScript

```powershell
npm install --save-dev @types/node @types/react @types/react-dom
```

## 📚 Próximos Passos

1. **Implementar Descoberta**: Criar o componente `BookSwiper` com animações
2. **Adicionar API Routes**: Endpoints para livros, swipes, clubes
3. **Integrar IA**: Usar OpenAI para recomendações mais inteligentes
4. **Chat em Tempo Real**: Implementar WebSockets para clubes
5. **PWA**: Adicionar service workers para funcionalidade offline
6. **Testes**: Adicionar testes unitários e E2E

## 💡 Dicas

- Use `npm run dev` para hot reload durante desenvolvimento
- Use Prisma Studio para debug do banco de dados
- Consulte a documentação do Next.js 14 para App Router
- Explore os componentes do shadcn/ui: https://ui.shadcn.com

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Implemente as mudanças
3. Teste localmente
4. Commit com mensagens descritivas
5. Abra um Pull Request

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto!

---

**Desenvolvido com 💜 por Lúmina Team**
