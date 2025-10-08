# Configuração OAuth - Guia Completo

## 🔵 Google OAuth

### Passo 1: Acessar Google Cloud Console
1. Acesse https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Credentials"

### Passo 2: Criar OAuth 2.0 Client ID
1. Clique em "Create Credentials" > "OAuth client ID"
2. Configure a tela de consentimento se solicitado:
   - User Type: External
   - App name: Lúmina
   - User support email: seu@email.com
   - Developer contact: seu@email.com
3. Tipo de aplicativo: "Web application"
4. Nome: "Lúmina Web App"

### Passo 3: Configurar URLs
**Authorized JavaScript origins:**
- `http://localhost:3000`
- `https://seu-dominio.com` (produção)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google`
- `https://seu-dominio.com/api/auth/callback/google`

### Passo 4: Copiar Credenciais
Após criar, você receberá:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

---

## 🔴 GitHub OAuth

### Passo 1: Acessar GitHub Developer Settings
1. Acesse https://github.com/settings/developers
2. Clique em "New OAuth App"

### Passo 2: Preencher Informações
- **Application name**: `Lúmina`
- **Homepage URL**: `http://localhost:3000`
- **Application description**: `Plataforma de descoberta de livros`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### Passo 3: Gerar Client Secret
1. Após criar, clique em "Generate a new client secret"
2. Copie imediatamente (não será mostrado novamente)

### Passo 4: Copiar Credenciais
- **Client ID**: `Iv1.xxxxx`
- **Client Secret**: `ghp_xxxxx`

---

## ⚙️ Configurar .env

Adicione as credenciais no arquivo `.env`:

```env
# NextAuth
NEXTAUTH_SECRET=use_openssl_rand_base64_32_para_gerar
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-seu_google_client_secret

# GitHub OAuth
GITHUB_ID=seu_github_client_id
GITHUB_SECRET=seu_github_client_secret
```

---

## 🔐 Gerar NEXTAUTH_SECRET

Execute no terminal:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 🚀 Testar OAuth

1. Reinicie o servidor de desenvolvimento
2. Acesse `/auth/signin` ou `/auth/signup`
3. Clique nos botões "Google" ou "GitHub"
4. Você será redirecionado para autenticação
5. Após autorizar, será criada uma conta automaticamente

---

## 📝 Notas Importantes

### Google
- Escopos padrão: `email`, `profile`
- Limite: 100 usuários em modo teste (remova para produção)
- Verificação: Google pode pedir verificação do app

### GitHub
- Escopos padrão: `user:email`, `read:user`
- Emails privados: GitHub pode não expor o email
- Organizações: Pode solicitar acesso a orgs se necessário

### Produção
- Atualize as URLs de callback com seu domínio real
- Use HTTPS sempre
- Guarde secrets em variáveis de ambiente seguras
- Considere usar serviços como Vercel/Railway para deploy

---

## 🛠️ Troubleshooting

### "Redirect URI mismatch"
- Verifique se a URL de callback está exatamente igual
- Inclua http/https correto
- Não esqueça a porta (3000 em dev)

### "Invalid client"
- Confirme que copiou Client ID corretamente
- Verifique se não há espaços extras no .env

### "Access denied"
- Usuário cancelou autorização
- App pode estar em modo restrito (Google)
- Verifique permissões do app

### Email não retornado
- GitHub: Habilite "Public email" nas settings
- Google: Email sempre é retornado
- Trate casos onde email pode ser null
