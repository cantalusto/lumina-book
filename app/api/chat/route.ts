import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

const API_KEY = process.env.GEMINI_API_KEY;

interface Message {
  role: "user" | "assistant";
  content: string;
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

⚠️ **Importante:**
- Seja concisa mas completa (máximo 3-4 parágrafos por resposta)
- Se não souber algo, seja honesta
- Evite spoilers sem avisar
- Pergunte se o usuário quer mais detalhes sobre algo

📖 **Formatação de Títulos de Livros:**
MUITO IMPORTANTE: Quando mencionar títulos de livros, SEMPRE siga este formato EXATO:
"Título Completo do Livro" - Nome do Autor

Exemplos CORRETOS:
✅ "O Pequeno Príncipe" - Antoine de Saint-Exupéry
✅ "1984" - George Orwell
✅ "Harry Potter e a Pedra Filosofal" - J.K. Rowling
✅ "O Senhor dos Anéis" - J.R.R. Tolkien
✅ "Dom Casmurro" - Machado de Assis

NUNCA faça assim:
❌ O Pequeno Príncipe (sem aspas)
❌ "O Pequeno Príncipe" de Antoine... (use hífen -)
❌ O livro "1984" (mencione autor)

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

    const aiResponse = response.text || "Desculpe, não consegui gerar uma resposta. Pode tentar novamente?";

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
