import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePersonalizedRecommendations } from "@/lib/gemini";
import { searchAndConvertBooks, searchBooks } from "@/lib/google-books";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/recommendations
 * Obter recomendações personalizadas baseadas no perfil do usuário logado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const useAI = searchParams.get("useAI") === "true";

    // Buscar usuário e perfil
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { readingProfile: true },
    });

    if (!user?.readingProfile) {
      return NextResponse.json(
        { error: "Perfil de leitura não encontrado. Complete o onboarding primeiro." },
        { status: 404 }
      );
    }

    const profile = user.readingProfile;

    // Se useAI=true, usar IA Gemini para recomendações mais sofisticadas
    if (useAI) {
      try {
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
          books: recommendedBooks.filter(Boolean),
          source: "ai",
          preferences: {
            genres: profile.favoriteGenres,
            moods: profile.moodTags,
          },
        });
      } catch (aiError) {
        console.error("AI recommendations failed, falling back to genre-based:", aiError);
      }
    }

    // Buscar por gêneros favoritos (método mais rápido e confiável)
    const genres = profile.favoriteGenres || [];
    
    // Se não tiver preferências, retornar livros populares
    if (genres.length === 0) {
      const books = await searchBooks("bestseller fiction", limit);
      return NextResponse.json({
        success: true,
        books,
        source: "popular",
        message: "Mostrando livros populares. Configure suas preferências no onboarding."
      });
    }

    // Buscar livros para cada gênero favorito
    const allBooks = [];
    const booksPerGenre = Math.ceil(limit / Math.min(genres.length, 3));

    for (const genre of genres.slice(0, 3)) {
      try {
        const query = `subject:${genre.toLowerCase()}`;
        const books = await searchBooks(query, booksPerGenre);
        allBooks.push(...books);
      } catch (error) {
        console.error(`Error fetching books for genre ${genre}:`, error);
      }
    }

    // Remover duplicados por ID
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.id, book])).values()
    );

    // Embaralhar e limitar
    const shuffled = uniqueBooks.sort(() => Math.random() - 0.5);
    const finalBooks = shuffled.slice(0, limit);

    return NextResponse.json({
      success: true,
      books: finalBooks,
      source: "genres",
      preferences: {
        genres: profile.favoriteGenres,
        moods: profile.moodTags,
      },
    });
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
