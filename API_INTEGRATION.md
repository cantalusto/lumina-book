# 🔌 Guia de Integração de APIs - Lúmina

Este guia explica como usar as integrações com Google Books API e Gemini AI no projeto Lúmina.

## 🔑 APIs Configuradas

### Google Books API
- **Propósito**: Buscar informações reais de livros, capas, autores, descrições
- **Documentação**: https://developers.google.com/books/docs/v1/using
- **API Key**: Já configurada no `.env`

### Google Gemini AI
- **Propósito**: Análise inteligente de livros, geração de vibes/moods, recomendações personalizadas
- **Documentação**: https://ai.google.dev/docs
- **API Key**: Já configurada no `.env`

## 📚 Google Books API - Uso

### Buscar Livros

```typescript
import { searchBooks, searchAndConvertBooks } from "@/lib/google-books";

// Buscar livros e converter para formato Lúmina
const books = await searchAndConvertBooks("Harry Potter", 10);

// Buscar livros (formato original Google)
const googleBooks = await searchBooks("ficção científica", 20);
```

### Buscar por Categoria

```typescript
import { searchBooksByCategory } from "@/lib/google-books";

const fantasyBooks = await searchBooksByCategory("Fantasy", 20);
const scienceFictionBooks = await searchBooksByCategory("Science Fiction", 15);
```

### Buscar por ISBN

```typescript
import { searchBookByISBN } from "@/lib/google-books";

const book = await searchBookByISBN("9788580416107");
```

### Buscar por Autor

```typescript
import { searchBooksByAuthor } from "@/lib/google-books";

const authorBooks = await searchBooksByAuthor("J.K. Rowling", 10);
```

### API Endpoint

```bash
# Buscar livros via API
GET /api/books/search?q=harry+potter&maxResults=10

# Resposta:
{
  "success": true,
  "count": 10,
  "books": [
    {
      "title": "Harry Potter e a Pedra Filosofal",
      "author": "J.K. Rowling",
      "cover": "https://...",
      "description": "...",
      "pages": 264,
      "genres": ["Fantasy", "Adventure"]
    }
  ]
}
```

## 🤖 Gemini AI - Uso

### Analisar Livro (Gerar Vibes/Moods)

```typescript
import { analyzeBookWithGemini } from "@/lib/gemini";

const analysis = await analyzeBookWithGemini(
  "O Nome do Vento",
  "Patrick Rothfuss",
  "A história de Kvothe, um jovem prodígio...",
  ["Fantasia", "Aventura"]
);

// Resultado:
{
  "vibeTags": ["atmospheric", "mysterious", "thought-provoking"],
  "mood": ["reflective", "tense"],
  "atmosphere": ["winter-night", "mountain-cabin"],
  "pace": "medium",
  "intensity": 4,
  "reasoning": "O livro combina elementos atmosféricos..."
}
```

### API Endpoint para Análise

```bash
# Analisar livro via API
POST /api/books/analyze
Content-Type: application/json

{
  "title": "1984",
  "author": "George Orwell",
  "description": "Uma distopia sobre vigilância...",
  "genres": ["Distopia", "Ficção Científica"]
}

# Resposta:
{
  "success": true,
  "analysis": {
    "vibeTags": ["dark", "thought-provoking", "tense"],
    "mood": ["anxious", "reflective"],
    "atmosphere": ["city-night"],
    "pace": "medium",
    "intensity": 5,
    "reasoning": "..."
  }
}
```

### Gerar Recomendações Personalizadas

```typescript
import { generatePersonalizedRecommendations } from "@/lib/gemini";

const recommendations = await generatePersonalizedRecommendations({
  favoriteGenres: ["Fantasia", "Ficção Científica"],
  moodTags: ["reflective", "hopeful"],
  vibePreferences: {
    atmospheric: 8,
    plotDriven: 7,
    characterDriven: 9,
  },
  lifeMoment: "explorando novos horizontes",
});

// Resultado:
[
  { title: "The Name of the Wind", author: "Patrick Rothfuss" },
  { title: "Dune", author: "Frank Herbert" },
  ...
]
```

### API Endpoint para Recomendações

```bash
# Obter recomendações personalizadas
GET /api/recommendations?userId=user_id_here

# Resposta:
{
  "success": true,
  "recommendations": [
    {
      "title": "The Name of the Wind",
      "author": "Patrick Rothfuss",
      "cover": "https://...",
      ...
    }
  ]
}
```

### Melhorar Descrição de Livro

```typescript
import { enhanceBookDescription } from "@/lib/gemini";

const enhanced = await enhanceBookDescription(
  "1984",
  "George Orwell",
  "Descrição original curta..."
);

// Resultado: descrição mais cativante e envolvente
```

## 🔄 Fluxo Completo de Importação de Livros

### 1. Buscar livro na Google Books

```typescript
import { searchAndConvertBooks } from "@/lib/google-books";

const books = await searchAndConvertBooks("Neuromancer", 1);
const book = books[0];
```

### 2. Analisar com IA para gerar vibes

```typescript
import { analyzeBookWithGemini } from "@/lib/gemini";

const analysis = await analyzeBookWithGemini(
  book.title,
  book.author,
  book.description,
  book.genres
);
```

### 3. Combinar dados e salvar no banco

```typescript
import { prisma } from "@/lib/prisma";

const completeBook = {
  ...book,
  ...analysis,
};

await prisma.book.create({
  data: completeBook,
});
```

## 📝 Exemplo Completo: Script de Importação

Crie `scripts/import-books.ts`:

```typescript
import { searchAndConvertBooks } from "@/lib/google-books";
import { analyzeBookWithGemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

async function importBooks(queries: string[]) {
  for (const query of queries) {
    console.log(`🔍 Buscando: ${query}`);
    
    const books = await searchAndConvertBooks(query, 5);
    
    for (const book of books) {
      console.log(`📚 Analisando: ${book.title}`);
      
      const analysis = await analyzeBookWithGemini(
        book.title,
        book.author,
        book.description,
        book.genres
      );
      
      if (analysis) {
        await prisma.book.create({
          data: {
            ...book,
            ...analysis,
          },
        });
        
        console.log(`✅ Importado: ${book.title}`);
      }
      
      // Aguardar 1 segundo entre requisições para não sobrecarregar API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Executar importação
importBooks([
  "The Lord of the Rings",
  "Harry Potter",
  "The Hitchhiker's Guide to the Galaxy",
  "Pride and Prejudice",
  "1984",
]).then(() => console.log("✨ Importação concluída!"));
```

Execute:
```bash
npx ts-node scripts/import-books.ts
```

## 🎯 Use Cases Práticos

### 1. Descoberta de Livros
```typescript
// Buscar livros por mood do usuário
const books = await searchAndConvertBooks("cozy mystery books", 10);

// Analisar todos para obter vibes
const analyzed = await Promise.all(
  books.map(book => analyzeBookWithGemini(
    book.title,
    book.author,
    book.description,
    book.genres
  ))
);
```

### 2. Recomendações Inteligentes
```typescript
// Obter perfil do usuário
const profile = await prisma.readingProfile.findUnique({
  where: { userId: "user_123" }
});

// Gerar recomendações com IA
const recs = await generatePersonalizedRecommendations(profile);

// Buscar livros recomendados
const books = await Promise.all(
  recs.map(rec => searchAndConvertBooks(`${rec.title} ${rec.author}`, 1))
);
```

### 3. Popular Banco de Dados
```typescript
// Buscar livros de um gênero específico
const fantasyBooks = await searchBooksByCategory("Fantasy", 50);

// Processar em lote
for (const book of fantasyBooks) {
  const converted = convertGoogleBookToLuminaFormat(book);
  const analysis = await analyzeBookWithGemini(
    converted.title,
    converted.author,
    converted.description,
    converted.genres
  );
  
  await prisma.book.create({
    data: { ...converted, ...analysis }
  });
}
```

## ⚠️ Limites e Considerações

### Google Books API
- **Limite**: 1000 requisições/dia (gratuito)
- **Rate limit**: ~100 req/100 segundos
- **Dica**: Cache resultados no banco de dados

### Gemini AI
- **Limite**: 60 requisições/minuto
- **Dica**: Use filas para processar em lote
- **Custo**: Verifique pricing em https://ai.google.dev/pricing

## 🔒 Segurança

- ✅ API keys estão no `.env` (não commitado)
- ✅ Nunca exponha as keys no cliente
- ✅ Use API routes do Next.js para chamadas seguras
- ✅ Valide inputs antes de enviar para APIs

## 📊 Monitoramento

```typescript
// Adicione logging
console.log(`📊 Books searched: ${count}`);
console.log(`🤖 AI analyses: ${analysisCount}`);
console.log(`⚡ API calls: ${apiCalls}`);
```

## 🚀 Próximos Passos

1. **Implementar cache**: Redis ou banco para evitar requisições repetidas
2. **Fila de processamento**: Bull ou similar para processar livros em background
3. **Webhooks**: Notificar usuários quando novos livros são adicionados
4. **Dashboard admin**: Interface para gerenciar importações

---

**Dica**: Teste as APIs usando as rotas em `/api/books/search` e `/api/books/analyze` antes de implementar no frontend!
