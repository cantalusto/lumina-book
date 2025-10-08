"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Star, BookOpen, Info, Sparkles } from "lucide-react";
import type { Book } from "@/types";

interface BookSwiperProps {
  books: Book[];
  onSwipe: (bookId: string, action: "like" | "dislike" | "super_like") => void;
  onBookClick?: (book: Book) => void;
}

export function BookSwiper({ books, onSwipe, onBookClick }: BookSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | "super" | null>(null);
  const [showOverlay, setShowOverlay] = useState<"like" | "dislike" | "super_like" | null>(null);

  const currentBook = books[currentIndex];

  const handleSwipe = (action: "like" | "dislike" | "super_like") => {
    if (!currentBook) return;

    // Mostrar overlay de feedback
    setShowOverlay(action);
    
    // Definir direção da animação
    if (action === "dislike") {
      setDirection("left");
    } else if (action === "super_like") {
      setDirection("super");
    } else {
      setDirection("right");
    }

    onSwipe(currentBook.id, action);

    // Avançar para o próximo livro após animação
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
      setShowOverlay(null);
    }, 400);
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
              x: direction === "left" ? -500 : direction === "right" ? 500 : 0,
              y: direction === "super" ? -600 : 0,
              opacity: 0,
              rotateZ: direction === "left" ? -25 : direction === "right" ? 25 : 0,
              scale: direction === "super" ? 1.2 : 0.8,
              transition: { 
                duration: 0.4,
                ease: "easeOut",
              },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full"
          >
            <Card className="overflow-hidden shadow-2xl relative">
              <div
                className="h-96 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${currentBook.cover})` }}
              >
                {/* Overlay de Feedback */}
                <AnimatePresence>
                  {showOverlay === "like" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-green-500/80 flex items-center justify-center z-10"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        transition={{ type: "spring", damping: 10 }}
                        className="text-white"
                      >
                        <Heart className="h-32 w-32 fill-white" />
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {showOverlay === "dislike" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-red-500/80 flex items-center justify-center z-10"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: 20 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        transition={{ type: "spring", damping: 10 }}
                        className="text-white"
                      >
                        <X className="h-32 w-32 stroke-[3]" />
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {showOverlay === "super_like" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400/90 via-amber-500/90 to-orange-500/90 flex items-center justify-center z-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: [0, 1.3, 1.2],
                          rotate: [0, 360],
                        }}
                        transition={{ 
                          duration: 0.6,
                          times: [0, 0.6, 1],
                        }}
                        className="text-white relative"
                      >
                        <Star className="h-32 w-32 fill-white" />
                        <Sparkles className="h-16 w-16 absolute -top-4 -right-4 fill-white animate-pulse" />
                        <Sparkles className="h-12 w-12 absolute -bottom-2 -left-2 fill-white animate-pulse delay-100" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

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

                {/* Botão Ver Detalhes */}
                {onBookClick && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onBookClick(currentBook)}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Ver Detalhes e Comprar
                  </Button>
                )}
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
