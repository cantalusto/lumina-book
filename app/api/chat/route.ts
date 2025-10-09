import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";
import { searchBooks } from "@/lib/google-books";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

const API_KEY = process.env.GEMINI_API_KEY;

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Valida se um livro existe na Google Books API
 */
async function validateBookExists(title: string, author: string): Promise<boolean> {
  try {
    const query = `intitle:${title} inauthor:${author}`;
    const books = await searchBooks(query, 5);
    
    if (books.length === 0) return false;
    
    // Normalizar strings para comparação
    const normalizeString = (str: string) => 
      str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^\w\s]/g, "") // Remove pontuação
        .trim();
    
    const normalizedSearchTitle = normalizeString(title);
    const normalizedSearchAuthor = normalizeString(author);
    
    // Verificar se algum livro retornado corresponde
    return books.some(book => {
      const bookTitle = normalizeString(book.volumeInfo.title);
      const bookAuthors = book.volumeInfo.authors?.map(a => normalizeString(a)) || [];
      
      const titleMatch = bookTitle.includes(normalizedSearchTitle) || 
                        normalizedSearchTitle.includes(bookTitle);
      const authorMatch = bookAuthors.some(a => 
        a.includes(normalizedSearchAuthor) || normalizedSearchAuthor.includes(a)
      );
      
      return titleMatch && authorMatch;
    });
  } catch (error) {
    console.error("Error validating book:", error);
    return false;
  }
}

/**
 * Extrai livros mencionados no formato "Título" - Autor
 */
function extractBooksFromText(text: string): Array<{ title: string; author: string }> {
  const bookPattern = /"([^"]+)"\s*-\s*([^\n]+)/g;
  const books: Array<{ title: string; author: string }> = [];
  
  let match;
  while ((match = bookPattern.exec(text)) !== null) {
    books.push({
      title: match[1].trim(),
      author: match[2].trim().replace(/^por\s+/i, ''),
    });
  }
  
  return books;
}

/**
 * POST /api/chat
 * Chat com Lumina sobre livros e recomendações
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensagem é obrigatória" },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API Key do Gemini não configurada" },
        { status: 500 }
      );
    }

    // Construir o contexto do chat
    const systemPrompt = `Você é Lumina, uma assistente virtual especializada em literatura e livros. Suas características:

🌟 **Personalidade:**
- Amigável, entusiasmada e apaixonada por livros
- Usa emojis relevantes (📚, ✨, 💫, 🎭, 🌙, etc)
- Escreve de forma conversacional e acessível
- Faz perguntas para entender melhor o gosto do usuário

📚 **Especialidades:**
- Recomendações personalizadas de livros
- Discussões sobre enredos, personagens e temas
- Sugestões baseadas em mood/vibe
- Informações sobre autores e gêneros literários
- Ajuda a encontrar o próximo livro perfeito

💡 **Como você funciona:**
- Pergunta sobre preferências, mood, momento de vida
- Sugere livros com base em características emocionais
- Explica porque um livro pode agradar o usuário
- Compara livros e autores quando relevante
- Mantém o foco em literatura e leitura

🚨 **REGRA CRÍTICA - APENAS LIVROS REAIS:**
- SOMENTE recomende livros que EXISTEM e estão disponíveis na Google Books API
- NUNCA invente títulos, autores ou obras fictícias
- SEMPRE use títulos EXATOS dos livros (não aproximações)
- Se não tiver certeza se um livro existe, NÃO o recomende
- Priorize livros populares, clássicos e best-sellers conhecidos
- Se o usuário pedir algo muito específico que você não conhece, peça para reformular a pergunta ou sugira alternativas próximas que você SABE que existem

📚 **Exemplos de Livros VERIFICADOS que existem na API:**
Fantasia: "Harry Potter e a Pedra Filosofal" - J.K. Rowling, "O Senhor dos Anéis" - J.R.R. Tolkien, "As Crônicas de Nárnia" - C.S. Lewis
Ficção Científica: "1984" - George Orwell, "Fahrenheit 451" - Ray Bradbury, "Fundação" - Isaac Asimov
Romance: "Orgulho e Preconceito" - Jane Austen, "O Morro dos Ventos Uivantes" - Emily Brontë
Clássicos: "Dom Casmurro" - Machado de Assis, "O Pequeno Príncipe" - Antoine de Saint-Exupéry, "Cem Anos de Solidão" - Gabriel García Márquez
Literatura Brasileira: "Capitães da Areia" - Jorge Amado, "Grande Sertão: Veredas" - Guimarães Rosa
YA/Teen: "A Culpa é das Estrelas" - John Green, "Crepúsculo" - Stephenie Meyer
Suspense: "O Código Da Vinci" - Dan Brown, "Gone Girl" - Gillian Flynn
SEMPRE prefira livros dessa lista ou similares quando possível!

⚠️ **Importante:**
- Seja concisa mas completa (máximo 3-4 parágrafos por resposta)
- Se não souber algo, seja honesta e não invente
- Evite spoilers sem avisar
- Pergunte se o usuário quer mais detalhes sobre algo

📖 **Formatação de Títulos de Livros:**
MUITO IMPORTANTE: Quando mencionar títulos de livros, SEMPRE siga este formato EXATO:
"Título Completo do Livro" - Nome do Autor

Exemplos CORRETOS:
✅ "O Pequeno Príncipe" - Antoine de Saint-Exupéry
✅ "1984" - George Orwell
✅ "Harry Potter e a Pedra Filosofal" - J.K. Rowling
✅ "O Senhor dos Anéis: A Sociedade do Anel" - J.R.R. Tolkien
✅ "Dom Casmurro" - Machado de Assis
✅ "A Menina que Roubava Livros" - Markus Zusak
✅ "O Nome do Vento" - Patrick Rothfuss

NUNCA faça assim:
❌ O Pequeno Príncipe (sem aspas)
❌ "O Pequeno Príncipe" de Antoine... (use hífen -)
❌ O livro "1984" (mencione autor)
❌ Livros inventados ou com títulos aproximados

Isso permite que os usuários cliquem nos títulos para ver detalhes exatos!

Responda em português brasileiro de forma natural e envolvente.`;

    // Inicializar Gemini AI (conforme documentação oficial)
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Construir o conteúdo completo para enviar
    let fullPrompt = "";
    
    // Adicionar system prompt como contexto
    if (history.length === 0) {
      fullPrompt = systemPrompt + "\n\n";
    }
    
    // Adicionar histórico de mensagens
    history.forEach((msg: Message) => {
      if (msg.role === "user") {
        fullPrompt += `Usuário: ${msg.content}\n`;
      } else {
        fullPrompt += `Lumina: ${msg.content}\n`;
      }
    });

    // Adicionar mensagem atual
    fullPrompt += `Usuário: ${message}\nLumina:`;

    // Fazer request para Gemini usando o padrão oficial
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: fullPrompt }],
    });

    let aiResponse = response.text || "Desculpe, não consegui gerar uma resposta. Pode tentar novamente?";

    // Validar livros mencionados na resposta
    const mentionedBooks = extractBooksFromText(aiResponse);
    
    if (mentionedBooks.length > 0) {
      console.log(`🔍 Validando ${mentionedBooks.length} livros mencionados...`);
      
      // Validar cada livro em paralelo
      const validationResults = await Promise.all(
        mentionedBooks.map(async (book) => {
          const exists = await validateBookExists(book.title, book.author);
          return { ...book, exists };
        })
      );
      
      // Filtrar livros que não existem
      const invalidBooks = validationResults.filter(b => !b.exists);
      
      if (invalidBooks.length > 0) {
        console.log(`❌ ${invalidBooks.length} livros não encontrados na API:`, invalidBooks);
        
        // Remover livros inválidos da resposta
        invalidBooks.forEach(book => {
          const bookPattern = new RegExp(`"${book.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*-\\s*${book.author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
          aiResponse = aiResponse.replace(bookPattern, '[Livro não disponível]');
        });
        
        // Adicionar nota explicativa se muitos livros foram removidos
        if (invalidBooks.length >= mentionedBooks.length / 2) {
          aiResponse += "\n\n⚠️ _Alguns livros mencionados não estão disponíveis na nossa base de dados. Posso sugerir alternativas se você quiser!_";
        }
      } else {
        console.log(`✅ Todos os ${mentionedBooks.length} livros foram validados!`);
      }
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Erro ao processar mensagem" },
      { status: 500 }
    );
  }
}
