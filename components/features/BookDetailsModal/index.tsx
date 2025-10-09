"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, BookOpen, Calendar, ShoppingCart } from "lucide-react";
import { ReadingStatusButton } from "@/components/features/ReadingStatusButton";

export interface BookDetails {
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
    ratingsCount?: number;
    publisher?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

interface BookDetailsModalProps {
  book: BookDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
  if (!book) return null;

  const { volumeInfo } = book;
  const coverUrl = volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || 
                   volumeInfo.imageLinks?.smallThumbnail?.replace("http://", "https://");
  
  // Gerar link de busca para Amazon (busca por título + autor)
  const amazonSearchQuery = `${volumeInfo.title} ${volumeInfo.authors?.[0] || ""}`.trim();
  const amazonLink = `https://www.amazon.com.br/s?k=${encodeURIComponent(amazonSearchQuery)}&i=stripbooks`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detalhes do Livro</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Capa do Livro */}
          <div className="md:col-span-1">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={volumeInfo.title}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-purple-300" />
              </div>
            )}

            {/* Informações Rápidas */}
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {volumeInfo.averageRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{volumeInfo.averageRating.toFixed(1)}</span>
                  {volumeInfo.ratingsCount && (
                    <span>({volumeInfo.ratingsCount} avaliações)</span>
                  )}
                </div>
              )}

              {volumeInfo.pageCount && (
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{volumeInfo.pageCount} páginas</span>
                </div>
              )}

              {volumeInfo.publishedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(volumeInfo.publishedDate).getFullYear()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes do Livro */}
          <div className="md:col-span-2 space-y-4">
            {/* Título e Autor */}
            <div>
              <h2 className="text-2xl font-bold">{volumeInfo.title}</h2>
              {volumeInfo.authors && volumeInfo.authors.length > 0 && (
                <p className="text-lg text-muted-foreground mt-1">
                  por {volumeInfo.authors.join(", ")}
                </p>
              )}
              {volumeInfo.publisher && (
                <p className="text-sm text-muted-foreground mt-1">
                  Editora: {volumeInfo.publisher}
                </p>
              )}
            </div>

            {/* Categorias */}
            {volumeInfo.categories && volumeInfo.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {volumeInfo.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            {/* Descrição */}
            {volumeInfo.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Sobre o Livro</h3>
                <div 
                  className="text-muted-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: volumeInfo.description.replace(/<\/?[^>]+(>|$)/g, "") 
                  }}
                />
              </div>
            )}

            {/* Status de Leitura */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-lg mb-3">Sua Leitura</h3>
              <ReadingStatusButton bookId={book.id} />
            </div>

            {/* Botões de Compra */}
            <div className="pt-4 border-t space-y-3">
              <h3 className="font-semibold text-lg mb-3">Onde Comprar</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Google Books */}
                {volumeInfo.infoLink && (
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => window.open(volumeInfo.infoLink, "_blank")}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar no Google Books
                  </Button>
                )}

                {/* Amazon */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(amazonLink, "_blank")}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buscar na Amazon
                </Button>
              </div>

              {/* Preview Link */}
              {volumeInfo.previewLink && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => window.open(volumeInfo.previewLink, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visualizar Preview
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
