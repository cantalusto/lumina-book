import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/google-books";

/**
 * API endpoint to search books by title and author
 * This runs on the server where GOOGLE_BOOKS_API_KEY is available
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title");
    const author = searchParams.get("author");

    if (!title) {
      return NextResponse.json(
        { error: "Title parameter is required" },
        { status: 400 }
      );
    }

    // Build search query
    let query = `intitle:${title}`;
    if (author) {
      query += ` inauthor:${author}`;
    }

    console.log("🔍 Searching books with query:", query);
    
    // Search using Google Books API (with API Key from server)
    const books = await searchBooks(query, 10);

    console.log(`✅ Found ${books.length} books`);

    return NextResponse.json({ books });
  } catch (error) {
    console.error("❌ Error searching books:", error);
    return NextResponse.json(
      { error: "Failed to search books" },
      { status: 500 }
    );
  }
}
