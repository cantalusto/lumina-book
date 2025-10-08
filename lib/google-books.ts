/**
 * Google Books API Integration
 * https://developers.google.com/books/docs/v1/using
 */

import { MOCK_BOOKS } from "./mock-books";

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1";
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const USE_MOCK_DATA = !API_KEY; // Usar dados mockados se não houver API Key

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    language?: string;
    averageRating?: number;
    ratingsCount?: number;
    publisher?: string;
  };
}

/**
 * Buscar livros por query
 */
export async function searchBooks(
  query: string,
  maxResults: number = 10
): Promise<GoogleBook[]> {
  // Se não houver API Key, usar dados mockados
  if (USE_MOCK_DATA) {
    console.log("⚠️ Usando dados mockados - Configure GOOGLE_BOOKS_API_KEY no .env");
    console.log("📖 Veja GOOGLE_BOOKS_API_KEY_GUIDE.md para instruções");
    
    // Detectar se é uma busca por categoria (subject:)
    const isSubjectSearch = query.includes("subject:");
    
    if (isSubjectSearch) {
      // Extrair o termo da categoria e remover "subject:" e "+"
      const categoryTerm = query.replace(/subject:/gi, "").replace(/\+/g, " ").trim().toLowerCase();
      
      // Filtrar livros que contenham a categoria
      const filtered = MOCK_BOOKS.filter((book) => {
        const categories = book.volumeInfo.categories?.join(" ").toLowerCase() || "";
        // Verificar se alguma palavra da busca está nas categorias
        return categoryTerm.split(" ").some(term => categories.includes(term));
      });
      
      if (filtered.length > 0) {
        return filtered.slice(0, maxResults);
      }
    }
    
    // Busca normal (título, autor, categoria)
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_BOOKS.filter((book) => {
      const title = book.volumeInfo.title.toLowerCase();
      const authors = book.volumeInfo.authors?.join(" ").toLowerCase() || "";
      const categories = book.volumeInfo.categories?.join(" ").toLowerCase() || "";
      return title.includes(lowerQuery) || authors.includes(lowerQuery) || categories.includes(lowerQuery);
    });
    
    // Se não encontrou nada na busca, retornar todos
    return filtered.length > 0 ? filtered.slice(0, maxResults) : MOCK_BOOKS.slice(0, maxResults);
  }
  
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/volumes?q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${API_KEY}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://books.google.com',
      },
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!response.ok) {
      console.error(`Google Books API error: ${response.status} ${response.statusText}`);
      // Se der erro, usar dados mockados como fallback
      console.log("⚠️ API falhou, usando dados mockados como fallback");
      return MOCK_BOOKS.slice(0, maxResults);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error searching books:", error);
    // Em caso de erro, retornar dados mockados
    return MOCK_BOOKS.slice(0, maxResults);
  }
}

/**
 * Buscar livro por ISBN
 */
export async function searchBookByISBN(isbn: string): Promise<GoogleBook | null> {
  // Se não houver API Key, não podemos buscar por ISBN nos dados mockados
  if (USE_MOCK_DATA) {
    console.log("⚠️ Busca por ISBN não disponível com dados mockados");
    return null;
  }
  
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/volumes?q=isbn:${isbn}&key=${API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items?.[0] || null;
  } catch (error) {
    console.error("Error searching book by ISBN:", error);
    return null;
  }
}

/**
 * Buscar detalhes de um livro específico
 */
export async function getBookDetails(volumeId: string): Promise<GoogleBook | null> {
  // Se não houver API Key, tentar buscar nos dados mockados pelo ID
  if (USE_MOCK_DATA) {
    const book = MOCK_BOOKS.find((b) => b.id === volumeId);
    return book || null;
  }
  
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/volumes/${volumeId}?key=${API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting book details:", error);
    return null;
  }
}

/**
 * Buscar livros por categoria
 */
export async function searchBooksByCategory(
  category: string,
  maxResults: number = 20
): Promise<GoogleBook[]> {
  return searchBooks(`subject:${category}`, maxResults);
}

/**
 * Buscar livros por autor
 */
export async function searchBooksByAuthor(
  author: string,
  maxResults: number = 10
): Promise<GoogleBook[]> {
  return searchBooks(`inauthor:${author}`, maxResults);
}

/**
 * Buscar livros recomendados com base em gêneros
 */
export async function getRecommendedBooksByGenres(
  genres: string[],
  maxResults: number = 20
): Promise<GoogleBook[]> {
  const genreQuery = genres.map((g) => `subject:${g}`).join(" OR ");
  return searchBooks(genreQuery, maxResults);
}

/**
 * Melhorar qualidade da imagem de capa do Google Books
 * O Google Books API retorna thumbnails pequenas por padrão,
 * mas podemos manipular a URL para obter versões maiores
 */
export function getHighQualityBookCover(imageUrl?: string): string {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&fit=crop";
  }

  // Substituir HTTP por HTTPS
  let url = imageUrl.replace("http://", "https://");

  // Substituir zoom=1 por zoom=2 ou zoom=3 para maior qualidade
  url = url.replace("zoom=1", "zoom=3");
  
  // Remover edge=curl (efeito de página virada) para imagem mais limpa
  url = url.replace("&edge=curl", "");
  
  // Aumentar o tamanho se houver parâmetros de dimensão
  url = url.replace(/&w=\d+/, "&w=800");
  url = url.replace(/&h=\d+/, "&h=1200");

  return url;
}

/**
 * Obter imagem de fallback baseada no gênero do livro
 */
export function getGenreFallbackImage(genres?: string[]): string {
  const genre = genres?.[0]?.toLowerCase() || "general";
  
  const genreImages: Record<string, string> = {
    "fiction": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&fit=crop",
    "romance": "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&h=1200&fit=crop",
    "mystery": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1200&fit=crop",
    "science fiction": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop",
    "fantasy": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=1200&fit=crop",
    "thriller": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop",
    "horror": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&h=1200&fit=crop",
    "biography": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=1200&fit=crop",
    "history": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=1200&fit=crop",
    "self-help": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1200&fit=crop",
    "business": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1200&fit=crop",
  };

  // Buscar por gênero específico
  for (const [key, value] of Object.entries(genreImages)) {
    if (genre.includes(key)) {
      return value;
    }
  }

  // Fallback geral
  return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&fit=crop";
}

/**
 * Converter GoogleBook para formato do Lúmina
 */
export function convertGoogleBookToLuminaFormat(googleBook: GoogleBook) {
  const { volumeInfo } = googleBook;

  // Obter imagem em alta qualidade
  const highQualityThumbnail = getHighQualityBookCover(volumeInfo.imageLinks?.thumbnail);
  const fallbackImage = getGenreFallbackImage(volumeInfo.categories);

  return {
    id: googleBook.id,
    volumeInfo: {
      title: volumeInfo.title,
      authors: volumeInfo.authors || ["Autor Desconhecido"],
      description: volumeInfo.description || "Descrição não disponível",
      imageLinks: {
        thumbnail: volumeInfo.imageLinks?.thumbnail ? highQualityThumbnail : fallbackImage,
        smallThumbnail: volumeInfo.imageLinks?.smallThumbnail?.replace("http://", "https://"),
      },
      categories: volumeInfo.categories || [],
      pageCount: volumeInfo.pageCount,
      publishedDate: volumeInfo.publishedDate,
      publisher: volumeInfo.publisher,
      averageRating: volumeInfo.averageRating,
    },
  };
}

/**
 * Buscar e converter múltiplos livros
 */
export async function searchAndConvertBooks(
  query: string,
  maxResults: number = 10
) {
  const googleBooks = await searchBooks(query, maxResults);
  return googleBooks.map(convertGoogleBookToLuminaFormat);
}
