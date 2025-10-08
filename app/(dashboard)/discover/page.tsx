"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookSwiper } from "@/components/features/BookSwiper";
import { BookDetailsModal } from "@/components/features/BookDetailsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Settings, Loader2, BookOpen } from "lucide-react";
import type { Book } from "@/types";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    categories?: string[];
    pageCount?: number;
    publishedDate?: string;
  };
}

export default function DiscoverPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [preferences, setPreferences] = useState<{ genres: string[]; moods: string[] } | null>(null);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Buscar recomendações baseadas no perfil
      const response = await fetch("/api/recommendations?limit=20");
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          // Usuário não tem perfil, redirecionar para onboarding
          setHasProfile(false);
          setError("Complete suas preferências primeiro!");
          return;
        }
        throw new Error(data.error || "Erro ao carregar recomendações");
      }

      setHasProfile(true);
      setPreferences(data.preferences);

      // Converter GoogleBooks para formato Book
      const convertedBooks: Book[] = data.books.map((book: GoogleBook) => ({
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || "Autor Desconhecido",
        cover: book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "",
        description: book.volumeInfo.description || "Sem descrição disponível",
        vibeTags: book.volumeInfo.categories || [],
        mood: [],
        atmosphere: [],
        pace: "medium" as const,
        intensity: 3,
        genres: book.volumeInfo.categories || [],
        pages: book.volumeInfo.pageCount || 0,
        publishedYear: book.volumeInfo.publishedDate ? parseInt(book.volumeInfo.publishedDate) : undefined,
        createdAt: new Date(),
      }));

      setBooks(convertedBooks);
    } catch (err: any) {
      console.error("Erro ao carregar recomendações:", err);
      setError(err.message || "Erro ao carregar recomendações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (bookId: string, action: "like" | "dislike" | "super_like") => {
    // Encontrar o livro atual para pegar os dados completos
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
      console.error("Livro não encontrado");
      return;
    }

    try {
      // Salvar swipe no banco de dados
      const response = await fetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          description: book.description,
          genres: book.genres,
          action,
        }),
      });

      if (!response.ok) {
        console.error("Erro ao salvar swipe");
        return;
      }

      const data = await response.json();
      console.log("Swipe salvo:", data);

      // Se acabaram os livros, carregar mais recomendações
      const currentIndex = books.findIndex(b => b.id === bookId);
      if (currentIndex === books.length - 1) {
        loadRecommendations();
      }

    } catch (error) {
      console.error("Erro ao processar swipe:", error);
    }
  };

  const handleReconfigurePreferences = () => {
    router.push("/onboarding?reconfigure=true");
  };

  // Converter Book para formato do BookDetailsModal
  const convertBookToModal = (book: Book): GoogleBook => ({
    id: book.id,
    volumeInfo: {
      title: book.title,
      authors: [book.author],
      description: book.description,
      imageLinks: {
        thumbnail: book.cover,
      },
      categories: book.genres,
      pageCount: book.pages,
      publishedDate: book.publishedYear?.toString(),
    },
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Descobrir
            </h1>
            <p className="text-muted-foreground">
              Recomendações personalizadas baseadas no seu perfil
            </p>
          </div>
          {hasProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReconfigurePreferences}
            >
              <Settings className="h-4 w-4 mr-2" />
              Reconfigurar
            </Button>
          )}
        </div>

        {/* Mostrar preferências do usuário */}
        {preferences && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Seus interesses:</span>
            {preferences.genres.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <main>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando recomendações...</p>
          </div>
        )}

        {error && !hasProfile && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">Configure suas preferências</h3>
            <p className="text-muted-foreground mb-6">
              Complete o onboarding para receber recomendações personalizadas
            </p>
            <Button onClick={() => router.push("/onboarding")}>
              <Sparkles className="h-4 w-4 mr-2" />
              Começar Onboarding
            </Button>
          </div>
        )}

        {error && hasProfile && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadRecommendations} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        )}

        {!isLoading && !error && books.length > 0 && (
          <BookSwiper 
            books={books} 
            onSwipe={handleSwipe}
            onBookClick={(book) => setSelectedBook(convertBookToModal(book))}
          />
        )}

        {!isLoading && !error && books.length === 0 && hasProfile && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma recomendação encontrada</h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar suas preferências
            </p>
            <Button onClick={handleReconfigurePreferences} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Ajustar Preferências
            </Button>
          </div>
        )}
      </main>

      {/* Modal de Detalhes */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
