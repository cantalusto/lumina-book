# ⚡ Comandos Rápidos - Lúmina

## 🚀 Instalação Inicial (Execute em ordem)

```powershell
# 1. Instalar dependências
npm install

# 2. Copiar arquivo de ambiente
Copy-Item .env.example .env

# 3. Editar .env com suas credenciais
# Use seu editor favorito para editar o arquivo .env
# Configure: DATABASE_URL, NEXTAUTH_SECRET, etc.

# 4. Gerar cliente Prisma
npx prisma generate

# 5. Criar migrations
npx prisma migrate dev --name init

# 6. Popular banco com dados
npx prisma db seed

# 7. Executar projeto
npm run dev
```

## 🛠️ Comandos Úteis

### Desenvolvimento
```powershell
# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start

# Lint do código
npm run lint
```

### Banco de Dados
```powershell
# Abrir Prisma Studio (interface visual)
npx prisma studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco de dados
npx prisma migrate reset

# Popular novamente
npx prisma db seed

# Ver status das migrations
npx prisma migrate status

# Gerar cliente após mudanças no schema
npx prisma generate
```

### Git
```powershell
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: initial commit - Lúmina project setup"

# Adicionar remote
git remote add origin <seu-repositorio>

# Push
git push -u origin main
```

## 🔧 Solução de Problemas

### Erro: Cannot find module '@prisma/client'
```powershell
npx prisma generate
```

### Erro: Database connection failed
```powershell
# Verificar se PostgreSQL está rodando
# No Windows, abra Services e procure por PostgreSQL

# Testar conexão
psql -U postgres -d lumina
```

### Erro: Module not found
```powershell
# Reinstalar dependências
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Limpar cache do Next.js
```powershell
Remove-Item .next -Recurse -Force
npm run dev
```

## 📝 Criar Novo Componente

```powershell
# Estrutura recomendada
New-Item -Path "components/features/NomeComponente" -ItemType Directory
New-Item -Path "components/features/NomeComponente/index.tsx" -ItemType File
```

## 🎨 Adicionar Nova Rota

```powershell
# Para criar nova página no dashboard
New-Item -Path "app/(dashboard)/nova-pagina" -ItemType Directory
New-Item -Path "app/(dashboard)/nova-pagina/page.tsx" -ItemType File
```

## 🔐 Gerar Secrets

```powershell
# Gerar NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Ou usar PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 📦 Adicionar Nova Dependência

```powershell
# Dependência normal
npm install nome-do-pacote

# Dependência de desenvolvimento
npm install --save-dev nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacote
```

## 🗄️ Backup do Banco

```powershell
# Fazer backup (PostgreSQL)
pg_dump -U postgres lumina > backup.sql

# Restaurar backup
psql -U postgres lumina < backup.sql
```

## 🚀 Deploy Rápido (Vercel)

```powershell
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 📊 Ver Logs

```powershell
# Ver logs do Next.js
# Os logs aparecem automaticamente no terminal onde você executou npm run dev

# Para ver logs mais detalhados
$env:DEBUG="*"; npm run dev
```

## 🧪 Testar Endpoints

```powershell
# Usando curl (se tiver instalado)
curl http://localhost:3000/api/auth/signin

# Ou use o navegador ou Postman/Insomnia
```

## 🔄 Atualizar Dependências

```powershell
# Ver dependências desatualizadas
npm outdated

# Atualizar todas
npm update

# Atualizar uma específica
npm update nome-do-pacote
```

## 🎯 Variáveis de Ambiente

Certifique-se de configurar no `.env`:

```env
# Obrigatório
DATABASE_URL="postgresql://usuario:senha@localhost:5432/lumina"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-gerada"

# Opcional (OAuth)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Opcional (IA)
OPENAI_API_KEY="sua-openai-api-key"
```

## 📱 Testar Responsividade

```powershell
# O Next.js dev server já está configurado
# Acesse pelo celular na mesma rede:
# http://<seu-ip-local>:3000

# Para descobrir seu IP:
ipconfig
# Procure por "IPv4 Address"
```

## 🎨 Adicionar Ícones (Lucide React)

```typescript
// Importar ícones
import { IconName } from "lucide-react";

// Usar no componente
<IconName className="h-6 w-6" />
```

## 📚 Documentação Útil

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Tailwind: https://tailwindcss.com/docs
- NextAuth: https://next-auth.js.org
- Framer Motion: https://www.framer.com/motion
- Lucide Icons: https://lucide.dev

---

**Dica**: Adicione este arquivo aos seus favoritos para acesso rápido! ⭐
