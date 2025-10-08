export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  readingProfile?: ReadingProfile;
}

export interface ReadingProfile {
  id: string;
  userId: string;
  favoriteGenres: string[];
  readingPace: "slow" | "medium" | "fast";
  preferredLength: "short" | "medium" | "long";
  moodTags: string[];
  vibePreferences: {
    atmospheric?: number;
    plotDriven?: number;
    characterDriven?: number;
    philosophical?: number;
    actionPacked?: number;
  };
  lifeMoment?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  isbn?: string;
  vibeTags: string[];
  mood: string[];
  atmosphere: string[];
  pace: "slow" | "medium" | "fast";
  intensity: number;
  genres: string[];
  pages?: number;
  publishedYear?: number;
  createdAt: Date;
}

export interface Swipe {
  id: string;
  userId: string;
  bookId: string;
  action: "like" | "dislike" | "super_like";
  context?: string;
  createdAt: Date;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  vibe: string;
  coverImage?: string;
  isPublic: boolean;
  currentBookId?: string;
  createdAt: Date;
}

export interface ClubMember {
  id: string;
  userId: string;
  clubId: string;
  role: "member" | "moderator" | "founder";
  joinedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "diversity" | "consistency" | "social" | "exploration";
  requirement: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

// Tipos para o sistema de recomendação
export interface RecommendationContext {
  mood?: string[];
  atmosphere?: string;
  purpose?: "travel" | "relax" | "learn" | "escape";
  timeAvailable?: "short" | "medium" | "long";
}

export interface MatchScore {
  bookId: string;
  score: number;
  reasons: string[];
}

// Tipos para vibes
export type VibeTag =
  | "cozy"
  | "atmospheric"
  | "thought-provoking"
  | "fast-paced"
  | "emotional"
  | "dark"
  | "uplifting"
  | "mysterious"
  | "romantic"
  | "adventurous";

export type MoodTag =
  | "melancholic"
  | "hopeful"
  | "tense"
  | "peaceful"
  | "excited"
  | "reflective"
  | "joyful"
  | "anxious";

export type AtmosphereTag =
  | "rainy-day"
  | "winter-night"
  | "summer-beach"
  | "cozy-cafe"
  | "mountain-cabin"
  | "city-night"
  | "countryside"
  | "autumn-forest";
