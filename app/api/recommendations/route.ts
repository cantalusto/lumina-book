import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePersonalizedRecommendations } from "@/lib/gemini";
import { searchAndConvertBooks } from "@/lib/google-books";

/**
 * GET /api/recommendations?userId=xxx
 * Obter recomendações personalizadas usando IA
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Buscar perfil do usuário
    const profile = await prisma.readingProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Gerar recomendações com IA
    const aiRecommendations = await generatePersonalizedRecommendations({
      favoriteGenres: profile.favoriteGenres,
      moodTags: profile.moodTags,
      vibePreferences: profile.vibePreferences as Record<string, number>,
      lifeMoment: profile.lifeMoment || undefined,
    });

    // Buscar livros recomendados na Google Books
    const recommendedBooks = await Promise.all(
      aiRecommendations.slice(0, 5).map(async (rec: any) => {
        const books = await searchAndConvertBooks(`${rec.title} ${rec.author}`, 1);
        return books[0];
      })
    );

    return NextResponse.json({
      success: true,
      recommendations: recommendedBooks.filter(Boolean),
    });
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
