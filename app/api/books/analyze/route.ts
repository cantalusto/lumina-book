import { NextRequest, NextResponse } from "next/server";
import { analyzeBookWithGemini } from "@/lib/gemini";

/**
 * POST /api/books/analyze
 * Analisar um livro usando Gemini AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, description, genres } = body;

    if (!title || !author || !description) {
      return NextResponse.json(
        { error: "title, author, and description are required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeBookWithGemini(
      title,
      author,
      description,
      genres || []
    );

    if (!analysis) {
      return NextResponse.json(
        { error: "Failed to analyze book" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error in book analysis API:", error);
    return NextResponse.json(
      { error: "Failed to analyze book" },
      { status: 500 }
    );
  }
}
