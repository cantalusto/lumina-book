import { NextRequest, NextResponse } from "next/server";
import { searchBooks, searchAndConvertBooks } from "@/lib/google-books";

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

    const books = await searchAndConvertBooks(query, maxResults);

    return NextResponse.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Error in books search API:", error);
    return NextResponse.json(
      { error: "Failed to search books" },
      { status: 500 }
    );
  }
}
