import { NextRequest, NextResponse } from "next/server";
import { searchBooks, searchAndConvertBooks } from "@/lib/google-books";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/books/search?q=query&maxResults=10
 * Buscar livros na Google Books API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const maxResults = parseInt(searchParams.get("maxResults") || "10");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    console.log(`[Google Books] Buscando: "${query}" (max: ${maxResults})`);
    
    const books = await searchAndConvertBooks(query, maxResults);

    console.log(`[Google Books] Encontrados: ${books.length} livros`);

    return NextResponse.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Error in books search API:", error);
    return NextResponse.json(
      { 
        error: "Failed to search books",
        details: error instanceof Error ? error.message : "Unknown error",
        books: [], // Retornar array vazio para não quebrar o frontend
      },
      { status: 200 } // Retornar 200 com array vazio ao invés de 500
    );
  }
}
