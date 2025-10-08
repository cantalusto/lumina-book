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

    // Buscar histórico de swipes do usuário para melhorar recomendações
    const likedSwipes = await prisma.swipe.findMany({
      where: {
        userId: user.id,
        action: { in: ["like", "super_like"] },
      },
      include: {
        book: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Últimos 20 livros curtidos
    });

    // Extrair gêneros dos livros curtidos
    const likedGenres: string[] = [];
    const likedAuthors: string[] = [];
    
    likedSwipes.forEach(swipe => {
      if (swipe.book.genres && swipe.book.genres.length > 0) {
        likedGenres.push(...swipe.book.genres);
      }
      if (swipe.book.author) {
        likedAuthors.push(swipe.book.author);
      }
    });

    // Contar frequência de gêneros
    const genreCount: Record<string, number> = {};
    likedGenres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });

    // Pegar top 3 gêneros mais curtidos
    const topLikedGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    // Combinar gêneros do perfil com gêneros curtidos (dar prioridade aos curtidos)
    const genres = [
      ...topLikedGenres,
      ...(profile.favoriteGenres || []),
    ].slice(0, 5); // Limitar a 5 gêneros

    // Remover duplicatas
    const uniqueGenres = Array.from(new Set(genres));
    
    // Se não tiver preferências, retornar livros populares
    if (uniqueGenres.length === 0) {
      const books = await searchBooks("bestseller fiction", limit);
      return NextResponse.json({
        success: true,
        books,
        source: "popular",
        message: "Mostrando livros populares. Configure suas preferências no onboarding."
      });
    }

    // Buscar IDs dos livros já vistos (likes e dislikes)
    const seenSwipes = await prisma.swipe.findMany({
      where: { userId: user.id },
      select: { book: { select: { googleBooksId: true } } },
    });
    
    const seenBookIds = seenSwipes
      .map(s => s.book.googleBooksId)
      .filter(Boolean) as string[];

    // Buscar livros para cada gênero favorito
    const allBooks = [];
    const booksPerGenre = Math.ceil(limit / Math.min(uniqueGenres.length, 3));

    // Se tiver autores curtidos, buscar mais livros deles
    if (likedAuthors.length > 0) {
      const topAuthor = likedAuthors[0];
      try {
        const authorBooks = await searchBooks(`inauthor:"${topAuthor}"`, 5);
        allBooks.push(...authorBooks);
      } catch (error) {
        console.error(`Error fetching books from author ${topAuthor}:`, error);
      }
    }

    for (const genre of uniqueGenres.slice(0, 3)) {
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
