"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Sparkles, Send, BookOpen, Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { BookDetailsModal } from "@/components/features/BookDetailsModal";
import { searchBooks } from "@/lib/google-books";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    pageCount?: number;
    publishedDate?: string;
    averageRating?: number;
    previewLink?: string;
    infoLink?: string;
  };
}

const STARTER_QUESTIONS = [
  "Que livro você recomenda para um dia chuvoso? ☔",
  "Estou procurando algo emocionante e cheio de suspense 🔥",
  "Quero um romance leve e divertido 💕",
  "Me sugira um clássico que vale a pena ler 📚",
];

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Olá${session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}! ✨ 

Sou a Lumina, sua assistente literária inteligente! 📚 Estou aqui para te ajudar a descobrir seu próximo livro favorito.

Pode me contar que tipo de leitura você está buscando? Posso sugerir livros baseados no seu mood, momento de vida, gêneros favoritos, ou simplesmente conversar sobre livros que você já leu!

Como posso te ajudar hoje? 💫`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar mensagem");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Desculpe, tive um problema ao processar sua mensagem. 😔 Pode tentar novamente?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleStarterQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleBookClick = async (bookTitle: string, author?: string) => {
    try {
      // Buscar com intitle: para busca mais precisa pelo título
      const query = `intitle:${bookTitle}${author ? ` inauthor:${author}` : ''}`;
      const books = await searchBooks(query, 5);
      
      if (books.length > 0) {
        // Encontrar o livro que melhor corresponde ao título
        const normalizeTitle = (title: string) => 
          title.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/[^\w\s]/g, "") // Remove pontuação
            .trim();
        
        const searchTitle = normalizeTitle(bookTitle);
        
        // Procurar correspondência exata primeiro
        let bestMatch = books.find(book => 
          normalizeTitle(book.volumeInfo.title).includes(searchTitle) ||
          searchTitle.includes(normalizeTitle(book.volumeInfo.title))
        );
        
        // Se não encontrar, usar o primeiro resultado
        if (!bestMatch) {
          bestMatch = books[0];
        }
        
        setSelectedBook(bestMatch);
      }
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
    }
  };

  // Função para renderizar mensagem com livros clicáveis
  const renderMessageContent = (content: string) => {
    // Regex para detectar padrões de títulos de livros:
    // - Entre aspas: "Título do Livro" - Autor
    // - Entre asteriscos: **Título do Livro** - Autor
    // - Formato padrão: 'Título' - Autor
    const bookPattern = /(\*\*([^*]+)\*\*|"([^"]+)"|'([^']+)')(\s*[-–—]\s*([^.!?\n]+))?/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = bookPattern.exec(content)) !== null) {
      // Adicionar texto antes do match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Extrair o título do livro (pode estar em diferentes grupos)
      const bookTitle = match[2] || match[3] || match[4];
      
      // Extrair o autor se disponível (grupo 6)
      const author = match[6]?.trim();
      
      // Adicionar botão clicável para o livro
      parts.push(
        <button
          key={`book-${match.index}`}
          onClick={() => handleBookClick(bookTitle, author)}
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline decoration-dotted underline-offset-2 font-medium transition-colors"
          title={author ? `${bookTitle} - ${author}` : bookTitle}
        >
          <BookOpen className="h-3 w-3 inline" />
          {bookTitle}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>
      );
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Image 
              src="/lumina.png" 
              alt="Lumina" 
              width={24} 
              height={24} 
              className="h-6 w-6 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Chat com Lumina</h1>
            <p className="text-sm text-muted-foreground">
              Sua assistente literária inteligente
            </p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center p-1.5 border border-primary/20">
                    <Image 
                      src="/lumina.png" 
                      alt="Lumina" 
                      width={24} 
                      height={24} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.role === "assistant" 
                      ? renderMessageContent(message.content)
                      : message.content
                    }
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center p-1.5 border border-primary/20">
                <Image 
                  src="/lumina.png" 
                  alt="Lumina" 
                  width={24} 
                  height={24} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-muted p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Lumina está pensando...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Starter Questions */}
        {messages.length === 1 && !isLoading && (
          <div className="p-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Sugestões de perguntas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => handleStarterQuestion(question)}
                >
                  <span className="text-xs line-clamp-2">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="icon"
              className="flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
