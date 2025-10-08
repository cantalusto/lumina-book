"use client";

import { BookSwiper } from "@/components/features/BookSwiper";
import { Sparkles } from "lucide-react";

// Mock data - em produção, buscar do banco de dados
const mockBooks = [
  {
    id: "1",
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    description: "A história de Kvothe, um jovem prodígio que se torna lenda.",
    vibeTags: ["atmospheric", "mysterious"],
    mood: ["reflective"],
    atmosphere: ["winter-night"],
    pace: "medium" as const,
    intensity: 4,
    genres: ["Fantasia"],
    pages: 656,
    publishedYear: 2007,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "A Menina que Roubava Livros",
    author: "Markus Zusak",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    description: "Uma história emocionante sobre amor e o poder das palavras.",
    vibeTags: ["emotional", "uplifting"],
    mood: ["melancholic", "hopeful"],
    atmosphere: ["winter-night"],
    pace: "medium" as const,
    intensity: 5,
    genres: ["Drama"],
    pages: 480,
    publishedYear: 2005,
    createdAt: new Date(),
  },
];

export default function DiscoverPage() {
  const handleSwipe = (bookId: string, action: "like" | "dislike" | "super_like") => {
    console.log("Swiped:", bookId, action);
    // Implementar lógica para salvar swipe no banco de dados
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">✨ Descobrir</h1>
        <p className="text-muted-foreground">
          Deslize para a direita nos livros que você gostaria de ler
        </p>
      </header>

      <main>
        <BookSwiper books={mockBooks} onSwipe={handleSwipe} />
      </main>
    </div>
  );
}
