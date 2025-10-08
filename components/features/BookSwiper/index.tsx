"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Star, BookOpen } from "lucide-react";
import type { Book } from "@/types";

interface BookSwiperProps {
  books: Book[];
  onSwipe: (bookId: string, action: "like" | "dislike" | "super_like") => void;
}

export function BookSwiper({ books, onSwipe }: BookSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentBook = books[currentIndex];

  const handleSwipe = (action: "like" | "dislike" | "super_like") => {
    if (!currentBook) return;

    setDirection(action === "dislike" ? "left" : "right");
    onSwipe(currentBook.id, action);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 300);
  };

  if (!currentBook || currentIndex >= books.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <BookOpen className="h-24 w-24 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">Você viu todos os livros!</h3>
        <p className="text-muted-foreground">
          Volte mais tarde para novas recomendações
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Card Container */}
      <div className="relative min-h-[580px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBook.id}
            initial={{ scale: 0.95, opacity: 0, rotateY: -10 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{
              x: direction === "left" ? -400 : direction === "right" ? 400 : 0,
              opacity: 0,
              rotateZ: direction === "left" ? -20 : direction === "right" ? 20 : 0,
              transition: { duration: 0.4 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full"
          >
            <Card className="overflow-hidden shadow-2xl">
              <div
                className="h-96 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${currentBook.cover})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold mb-1 text-white drop-shadow-lg">{currentBook.title}</h3>
                  <p className="text-sm text-white/90 drop-shadow">{currentBook.author}</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {currentBook.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentBook.vibeTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{currentBook.pages} páginas</span>
                  <span>•</span>
                  <span>{currentBook.pace === "fast" ? "Rápido" : currentBook.pace === "slow" ? "Lento" : "Moderado"}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          className="h-16 w-16 rounded-full hover:scale-110 transition-transform hover:border-red-500 hover:text-red-500"
          onClick={() => handleSwipe("dislike")}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button
          size="icon"
          variant="glow"
          className="h-20 w-20 rounded-full hover:scale-110 transition-transform"
          onClick={() => handleSwipe("super_like")}
        >
          <Star className="h-10 w-10" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-16 w-16 rounded-full hover:scale-110 transition-transform hover:border-green-500 hover:text-green-500"
          onClick={() => handleSwipe("like")}
        >
          <Heart className="h-8 w-8" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-center text-sm text-muted-foreground">
        <span className="font-semibold text-primary">{currentIndex + 1}</span> / {books.length}
      </div>
    </div>
  );
}
