"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Filter, Grid, List, Heart, Clock, CheckCircle } from "lucide-react";

type FilterStatus = "all" | "reading" | "completed" | "want-to-read";
type ViewMode = "grid" | "list";

// Mock data - em produção, buscar do banco de dados
const mockLibraryBooks = [
  {
    id: "1",
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    status: "reading" as const,
    progress: 45,
    vibeTags: ["atmospheric", "mysterious"],
    rating: 5,
  },
  {
    id: "2",
    title: "A Menina que Roubava Livros",
    author: "Markus Zusak",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    status: "completed" as const,
    progress: 100,
    vibeTags: ["emotional", "uplifting"],
    rating: 5,
  },
  {
    id: "3",
    title: "O Oceano no Fim do Caminho",
    author: "Neil Gaiman",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    status: "want-to-read" as const,
    progress: 0,
    vibeTags: ["magical", "nostalgic"],
    rating: 0,
  },
  {
    id: "4",
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    status: "completed" as const,
    progress: 100,
    vibeTags: ["dark", "thought-provoking"],
    rating: 4,
  },
  {
    id: "5",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    status: "reading" as const,
    progress: 67,
    vibeTags: ["adventurous", "cozy"],
    rating: 0,
  },
];

export default function LibraryPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = mockLibraryBooks.filter((book) => {
    const matchesFilter = filter === "all" || book.status === filter;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    reading: mockLibraryBooks.filter((b) => b.status === "reading").length,
    completed: mockLibraryBooks.filter((b) => b.status === "completed").length,
    wantToRead: mockLibraryBooks.filter((b) => b.status === "want-to-read").length,
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📚 Minha Biblioteca</h1>
        <p className="text-muted-foreground">
          Organize e acompanhe sua jornada literária
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.reading}</p>
            <p className="text-xs text-muted-foreground">Lendo</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.wantToRead}</p>
            <p className="text-xs text-muted-foreground">Quero Ler</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou autor..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "reading" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("reading")}
          >
            Lendo
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Concluídos
          </Button>
          <Button
            variant={filter === "want-to-read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("want-to-read")}
          >
            Quero Ler
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Books Grid/List */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold mb-2">Nenhum livro encontrado</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Tente buscar por outro título ou autor"
              : "Comece adicionando livros à sua biblioteca"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-4"
          }
        >
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookCard({
  book,
  viewMode,
}: {
  book: (typeof mockLibraryBooks)[0];
  viewMode: ViewMode;
}) {
  const statusConfig = {
    reading: { color: "bg-primary", label: "Lendo", icon: Clock },
    completed: { color: "bg-green-500", label: "Concluído", icon: CheckCircle },
    "want-to-read": { color: "bg-secondary", label: "Quero Ler", icon: Heart },
  };

  const config = statusConfig[book.status];
  const StatusIcon = config.icon;

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img
              src={book.cover}
              alt={book.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
              
              <div className="flex gap-2 mb-2">
                {book.vibeTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${config.color.replace('bg-', 'text-')}`} />
                <span className="text-xs">{config.label}</span>
                {book.progress > 0 && book.progress < 100 && (
                  <span className="text-xs text-muted-foreground">• {book.progress}%</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all hover:scale-105">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 ${config.color} text-white px-2 py-1 rounded-full flex items-center gap-1`}>
          <StatusIcon className="h-3 w-3" />
          <span className="text-xs font-medium">{config.label}</span>
        </div>

        {/* Progress Bar */}
        {book.progress > 0 && book.progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50">
            <div
              className={`h-full ${config.color} transition-all`}
              style={{ width: `${book.progress}%` }}
            />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm">
            Ver Detalhes
          </Button>
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
      </CardContent>
    </Card>
  );
}
