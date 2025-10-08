/**
 * Google Books API Integration
 * https://developers.google.com/books/docs/v1/using
 */

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1";
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

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
  };
}

/**
 * Buscar livros por query
 */
export async function searchBooks(
  query: string,
  maxResults: number = 10
): Promise<GoogleBook[]> {
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/volumes?q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

/**
 * Buscar livro por ISBN
 */
export async function searchBookByISBN(isbn: string): Promise<GoogleBook | null> {
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/volumes?q=isbn:${isbn}&key=${API_KEY}`;

    const response = await fetch(url);

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
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/volumes/${volumeId}?key=${API_KEY}`;

    const response = await fetch(url);

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
    title: volumeInfo.title,
    author: volumeInfo.authors?.join(", ") || "Autor Desconhecido",
    cover:
      volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ||
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    description:
      volumeInfo.description || "Descrição não disponível",
    isbn: googleBook.id,
    pages: volumeInfo.pageCount || null,
    publishedYear: volumeInfo.publishedDate
      ? parseInt(volumeInfo.publishedDate.split("-")[0])
      : null,
    genres: volumeInfo.categories || [],
    // Vibes e moods precisam ser definidos manualmente ou por IA
    vibeTags: [],
    mood: [],
    atmosphere: [],
    pace: "medium",
    intensity: 3,
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
