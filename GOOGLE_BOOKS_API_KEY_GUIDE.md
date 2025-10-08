# 🔑 Como Obter API Key do Google Books

## ❗ Problema Atual
A API do Google Books está retornando **403 Forbidden**, o que significa que **uma API Key é obrigatória**.

---

## 📋 Passo a Passo para Obter a API Key (GRATUITO)

### 1. Acesse o Google Cloud Console
👉 https://console.cloud.google.com/

### 2. Crie um Novo Projeto (ou use existente)
- Clique em "Select a project" no topo
- Clique em "NEW PROJECT"
- Nome: `Lumina` ou qualquer nome
- Clique em "CREATE"

### 3. Ative a API do Google Books
- No menu lateral, vá em: **APIs & Services** > **Library**
- Ou acesse diretamente: https://console.cloud.google.com/apis/library
- Busque por: **"Books API"**
- Clique em **"Books API"**
- Clique no botão **"ENABLE"**

### 4. Crie uma Credencial (API Key)
- Vá em: **APIs & Services** > **Credentials**
- Ou acesse: https://console.cloud.google.com/apis/credentials
- Clique em **"+ CREATE CREDENTIALS"**
- Selecione **"API key"**
- Sua chave será gerada! Copie ela

### 5. (Opcional mas Recomendado) Restrinja a API Key
- Clique em "RESTRICT KEY" ou no ícone de editar
- Em "API restrictions":
  - Selecione "Restrict key"
  - Marque apenas **"Books API"**
- Em "Application restrictions" (opcional):
  - Selecione "HTTP referer"
  - Adicione: `http://localhost:3000/*`
  - Adicione: `https://seudominio.com/*` (quando publicar)
- Clique em "SAVE"

### 6. Adicione no Arquivo `.env`
```env
GOOGLE_BOOKS_API_KEY=sua_chave_aqui
```

### 7. Reinicie o Servidor
```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

---

## 💰 Custo
✅ **TOTALMENTE GRATUITO**
- Google Books API tem **1.000 requisições POR DIA grátis**
- Isso é mais que suficiente para desenvolvimento e até produção inicial

---

## ⏱️ Tempo Estimado
- 5-10 minutos para todo o processo

---

## 🎯 Solução Temporária
Enquanto você não obtém a API Key, criei **dados mockados** na biblioteca para você poder ver a interface funcionando!

---

## 📞 Suporte
Se tiver alguma dúvida, me avise!
