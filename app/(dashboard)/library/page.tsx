"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2, Heart, Eye, Check, Bookmark, Info, Search, Globe } from "lucide-react";
import { BookDetailsModal } from "@/components/features/BookDetailsModal";
import { ReadingStatusButton } from "@/components/features/ReadingStatusButton";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description?: string;
  genres?: string[];
  googleBooksId?: string;
}

interface ReadingHistory {
  id: string;
  status: string;
  progress: number;
  rating?: number;
  book: Book;
  createdAt: string;
  updatedAt: string;
}

interface Swipe {
  id: string;
  action: string;
  book: Book;
  createdAt: string;
}

type Tab = "liked" | "reading" | "completed" | "want_to_read" | "search";

const tabs = [
  { id: "liked" as Tab, label: "Curtidos", icon: Heart, color: "text-pink-500" },
  { id: "reading" as Tab, label: "Lendo", icon: Eye, color: "text-blue-500" },
  { id: "completed" as Tab, label: "Lidos", icon: Check, color: "text-green-500" },
  { id: "want_to_read" as Tab, label: "Quero Ler", icon: Bookmark, color: "text-amber-500" },
  { id: "search" as Tab, label: "Buscar", icon: Globe, color: "text-purple-500" },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("liked");
  const [books, setBooks] = useState<(Book & { status?: string })[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<(Book & { status?: string })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  useEffect(() => {
    loadBooks();
  }, [activeTab]);

  useEffect(() => {
    // Filtrar livros quando a busca muda (apenas para tabs que não são search)
    if (activeTab !== "search") {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const filtered = books.filter((book) => 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        );
        setFilteredBooks(filtered);
      } else {
        setFilteredBooks(books);
      }
    }
  }, [searchQuery, books, activeTab]);

  const loadBooks = async () => {
    if (activeTab === "search") {
      // Não carregar livros automaticamente na aba de busca
      setBooks([]);
      setFilteredBooks([]);
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === "liked") {
        const response = await fetch("/api/swipes?action=like");
        const data = await response.json();
        
        const likedBooks = data.swipes?.map((swipe: Swipe) => ({
          ...swipe.book,
          status: "liked",
        })) || [];
        
        setBooks(likedBooks);
      } else {
        const response = await fetch(`/api/reading-history?status=${activeTab}`);
        const data = await response.json();
        
        const readingBooks = data.history?.map((item: ReadingHistory) => ({
          ...item.book,
          status: item.status,
          progress: item.progress,
          rating: item.rating,
        })) || [];
        
        setBooks(readingBooks);
      }
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchAllBooks = async () => {
    if (!apiSearchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/books/search-by-title?title=${encodeURIComponent(apiSearchQuery)}`
      );
      const data = await response.json();

      if (data.books && data.books.length > 0) {
        const searchResults = data.books.map((book: any) => ({
          id: book.id,
          googleBooksId: book.id,
          title: book.volumeInfo?.title || "Sem título",
          author: book.volumeInfo?.authors?.[0] || "Autor desconhecido",
          cover: book.volumeInfo?.imageLinks?.thumbnail || "",
          description: book.volumeInfo?.description || "",
          genres: book.volumeInfo?.categories || [],
        }));
        setFilteredBooks(searchResults);
      } else {
        setFilteredBooks([]);
      }
    } catch (error) {
      console.error("Error searching books:", error);
      setFilteredBooks([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAllBooks();
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook({
      id: book.googleBooksId || book.id,
      volumeInfo: {
        title: book.title,
        authors: [book.author],
        description: book.description,
        imageLinks: {
          thumbnail: book.cover,
        },
        categories: book.genres,
      },
    });
  };

  const handleStatusChange = () => {
    loadBooks();
  };

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Minha Biblioteca</h1>
        <p className="text-muted-foreground">
          Organize e acompanhe sua jornada de leitura
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        {activeTab === "search" ? (
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar livros na Google Books API (ex: Harry Potter, 1984, etc)..."
                  value={apiSearchQuery}
                  onChange={(e) => setApiSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isSearching || !apiSearchQuery.trim()}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              🌐 Busque qualquer livro disponível na Google Books API
            </p>
          </form>
        ) : (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "outline"}
              className="gap-2 whitespace-nowrap"
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className={`h-4 w-4 ${isActive ? "" : tab.color}`} />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {(isLoading || isSearching) && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            {isSearching ? "Buscando na API..." : "Carregando livros..."}
          </p>
        </div>
      )}

      {!isLoading && !isSearching && books.length === 0 && activeTab !== "search" && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum livro aqui ainda</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {activeTab === "liked" && "Curta livros na página de Descoberta para salvá-los aqui!"}
              {activeTab === "reading" && "Marque livros como 'Lendo' para acompanhar seu progresso."}
              {activeTab === "completed" && "Livros que você já terminou aparecerão aqui."}
              {activeTab === "want_to_read" && "Salve livros que você pretende ler no futuro."}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isSearching && activeTab === "search" && filteredBooks.length === 0 && !apiSearchQuery && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Globe className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Buscar livros na API</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Digite o título ou autor de um livro acima e clique em "Buscar" para encontrar livros na Google Books API.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isSearching && books.length > 0 && filteredBooks.length === 0 && activeTab !== "search" && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Não encontramos livros com "{searchQuery}". Tente outro termo de busca.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isSearching && activeTab === "search" && filteredBooks.length === 0 && apiSearchQuery && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Não encontramos livros com "{apiSearchQuery}" na Google Books API. Tente outro termo de busca.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && filteredBooks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardContent className="p-0">
                <div
                  className="relative aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900"
                  onClick={() => handleBookClick(book)}
                >
                  {book.cover && (
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Info className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {book.author}
                    </p>
                  </div>

                  {book.genres && book.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {book.genres.slice(0, 2).map((genre, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <ReadingStatusButton
                    bookId={book.id}
                    currentStatus={book.status !== "liked" ? book.status : undefined}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
