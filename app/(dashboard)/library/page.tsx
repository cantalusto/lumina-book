"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Loader2, BookMarked, Star, Info } from "lucide-react";
import { BookDetailsModal } from "@/components/features/BookDetailsModal";

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
    publisher?: string;
    averageRating?: number;
  };
}

const POPULAR_CATEGORIES = [
  { label: "Ficção", query: "subject:fiction" },
  { label: "Fantasia", query: "subject:fantasy" },
  { label: "Romance", query: "subject:romance" },
  { label: "Mistério", query: "subject:mystery+detective" },
  { label: "Ficção Científica", query: "subject:science+fiction" },
  { label: "Terror", query: "subject:horror+thriller" },
  { label: "História", query: "subject:history" },
  { label: "Biografia", query: "subject:biography" },
  { label: "Autoajuda", query: "subject:self-help" },
  { label: "Filosofia", query: "subject:philosophy" },
  { label: "Aventura", query: "subject:adventure" },
  { label: "Clássicos", query: "subject:classics+literature" },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);

  useEffect(() => {
    loadPopularBooks();
  }, []);

  const loadPopularBooks = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/books/search?q=bestseller+fiction&maxResults=24");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar livros");
      }
      
      setBooks(data.books || []);
    } catch (err: any) {
      console.error("Erro ao carregar livros:", err);
      setError(err.message || "Erro ao carregar livros");
    } finally {
      setIsLoading(false);
    }
  };

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      loadPopularBooks();
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/books/search?q=" + encodeURIComponent(query) + "&maxResults=24");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar livros");
      }
      
      setBooks(data.books || []);
    } catch (err: any) {
      console.error("Erro ao buscar livros:", err);
      setError(err.message || "Erro ao buscar livros");
    } finally {
      setIsLoading(false);
    }
  };

  const searchByCategory = async (categoryQuery: string) => {
    setSelectedCategory(categoryQuery);
    setSearchQuery("");
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/books/search?q=" + encodeURIComponent(categoryQuery) + "&maxResults=24");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar livros");
      }
      
      setBooks(data.books || []);
    } catch (err: any) {
      console.error("Erro ao buscar livros:", err);
      setError(err.message || "Erro ao buscar livros");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(null);
    searchBooks(searchQuery);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
    loadPopularBooks();
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookMarked className="h-8 w-8 text-primary" />
          Biblioteca de Livros
        </h1>
        <p className="text-muted-foreground">
          Explore milhares de livros da API do Google Books
        </p>
      </header>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar livros por título, autor ou ISBN..."
            className="pl-10 pr-20 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            size="sm"
          >
            Buscar
          </Button>
        </div>
      </form>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Categorias Populares</h2>
          {selectedCategory && (
            <Button variant="ghost" size="sm" onClick={clearCategory}>
              Limpar filtro
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CATEGORIES.map((category) => (
            <Badge
              key={category.query}
              variant={selectedCategory === category.query ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1.5"
              onClick={() => searchByCategory(category.query)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Buscando livros...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
          <p className="text-destructive font-semibold mb-2">Erro ao carregar livros</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadPopularBooks} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold mb-2">Nenhum livro encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Tente buscar por outro termo ou categoria
          </p>
          <Button onClick={loadPopularBooks} variant="outline">
            Ver Livros Populares
          </Button>
        </div>
      )}

      {!isLoading && !error && books.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {books.length} livro{books.length !== 1 ? "s" : ""} encontrado{books.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal de Detalhes do Livro */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}

function BookCard({ book, onClick }: { book: GoogleBook; onClick: () => void }) {
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:");
  
  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[2/3] relative overflow-hidden bg-muted">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={book.volumeInfo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs font-medium">Ver Detalhes</p>
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 leading-tight">
            {book.volumeInfo.title}
          </h3>
          {book.volumeInfo.authors && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {book.volumeInfo.authors.join(", ")}
            </p>
          )}
          
          {book.volumeInfo.averageRating && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                {book.volumeInfo.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
