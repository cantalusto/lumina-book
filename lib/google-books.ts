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
 * Converter GoogleBook para formato do Lúmina
 */
export function convertGoogleBookToLuminaFormat(googleBook: GoogleBook) {
  const { volumeInfo } = googleBook;

  return {
    id: googleBook.id,
    volumeInfo: {
      title: volumeInfo.title,
      authors: volumeInfo.authors || ["Autor Desconhecido"],
      description: volumeInfo.description || "Descrição não disponível",
      imageLinks: {
        thumbnail: volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ||
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
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
