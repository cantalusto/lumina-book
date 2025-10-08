import { Book, RecommendationContext, MatchScore, ReadingProfile } from "@/types";

/**
 * Algoritmo de matching baseado em vibes e preferências do usuário
 */
export function calculateBookMatch(
  book: Book,
  userProfile: ReadingProfile,
  context?: RecommendationContext
): MatchScore {
  let score = 0;
  const reasons: string[] = [];

  // Match de gêneros favoritos (peso: 25%)
  const genreMatch = book.genres.filter((genre) =>
    userProfile.favoriteGenres.includes(genre)
  ).length;
  if (genreMatch > 0) {
    score += (genreMatch / userProfile.favoriteGenres.length) * 25;
    reasons.push(`${genreMatch} gênero(s) em comum`);
  }

  // Match de pace (peso: 15%)
  if (book.pace === userProfile.readingPace) {
    score += 15;
    reasons.push("Ritmo ideal para você");
  }

  // Match de mood (peso: 20%)
  const moodMatch = book.mood.filter((mood) =>
    userProfile.moodTags.includes(mood)
  ).length;
  if (moodMatch > 0) {
    score += (moodMatch / userProfile.moodTags.length) * 20;
    reasons.push("Mood compatível");
  }

  // Match de vibes baseado em preferências (peso: 30%)
  const vibeScore = calculateVibeScore(book.vibeTags, userProfile.vibePreferences);
  score += vibeScore * 30;
  if (vibeScore > 0.5) {
    reasons.push("Vibe perfeita");
  }

  // Contexto adicional (peso: 10%)
  if (context) {
    const contextScore = calculateContextScore(book, context);
    score += contextScore * 10;
    if (contextScore > 0.7) {
      reasons.push(`Perfeito para ${context.purpose || "este momento"}`);
    }
  }

  return {
    bookId: book.id,
    score: Math.min(score, 100),
    reasons,
  };
}

function calculateVibeScore(
  bookVibes: string[],
  userPreferences: ReadingProfile["vibePreferences"]
): number {
  const vibeMap: Record<string, keyof ReadingProfile["vibePreferences"]> = {
    atmospheric: "atmospheric",
    "thought-provoking": "philosophical",
    "fast-paced": "actionPacked",
    emotional: "characterDriven",
  };

  let totalScore = 0;
  let count = 0;

  bookVibes.forEach((vibe) => {
    const prefKey = vibeMap[vibe];
    if (prefKey && userPreferences[prefKey]) {
      totalScore += userPreferences[prefKey]! / 10;
      count++;
    }
  });

  return count > 0 ? totalScore / count : 0;
}

function calculateContextScore(book: Book, context: RecommendationContext): number {
  let score = 0;

  // Match de atmosfera baseado no contexto
  if (context.atmosphere && book.atmosphere.includes(context.atmosphere)) {
    score += 0.4;
  }

  // Match de mood do contexto
  if (context.mood) {
    const moodMatch = book.mood.filter((m) => context.mood!.includes(m)).length;
    score += (moodMatch / (context.mood?.length || 1)) * 0.3;
  }

  // Match de propósito
  if (context.purpose) {
    const purposeMap: Record<string, string[]> = {
      travel: ["adventurous", "fast-paced"],
      relax: ["cozy", "peaceful"],
      learn: ["thought-provoking", "philosophical"],
      escape: ["mysterious", "romantic"],
    };

    const purposeVibes = purposeMap[context.purpose] || [];
    const vibeMatch = book.vibeTags.filter((v) => purposeVibes.includes(v)).length;
    score += (vibeMatch / purposeVibes.length) * 0.3;
  }

  return score;
}

/**
 * Obtém recomendações personalizadas para o usuário
 */
export async function getPersonalizedRecommendations(
  books: Book[],
  userProfile: ReadingProfile,
  context?: RecommendationContext,
  limit: number = 10
): Promise<MatchScore[]> {
  const scores = books.map((book) => calculateBookMatch(book, userProfile, context));

  // Ordenar por score e retornar top N
  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Filtra livros por tags de vibe
 */
export function filterBooksByVibes(books: Book[], vibeTags: string[]): Book[] {
  return books.filter((book) =>
    vibeTags.some((tag) => book.vibeTags.includes(tag))
  );
}

/**
 * Encontra livros similares baseado em um livro específico
 */
export function findSimilarBooks(targetBook: Book, allBooks: Book[], limit: number = 5): Book[] {
  const scores = allBooks
    .filter((book) => book.id !== targetBook.id)
    .map((book) => {
      let similarity = 0;

      // Similaridade de gêneros
      const genreOverlap = book.genres.filter((g) =>
        targetBook.genres.includes(g)
      ).length;
      similarity += (genreOverlap / targetBook.genres.length) * 30;

      // Similaridade de vibes
      const vibeOverlap = book.vibeTags.filter((v) =>
        targetBook.vibeTags.includes(v)
      ).length;
      similarity += (vibeOverlap / targetBook.vibeTags.length) * 40;

      // Similaridade de mood
      const moodOverlap = book.mood.filter((m) => targetBook.mood.includes(m)).length;
      similarity += (moodOverlap / targetBook.mood.length) * 20;

      // Mesmo ritmo
      if (book.pace === targetBook.pace) {
        similarity += 10;
      }

      return { book, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return scores.map((s) => s.book);
}
