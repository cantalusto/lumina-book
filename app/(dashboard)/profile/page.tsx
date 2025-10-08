"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Users, Award, TrendingUp, Loader2, Settings, Heart, Zap } from "lucide-react";

interface ReadingProfile {
  favoriteGenres: string[];
  readingPace: string;
  preferredLength: string;
  moodTags: string[];
}

interface ProfileData {
  user: {
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
  };
  profile: ReadingProfile | null;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar perfil");
      }

      setProfileData({
        user: {
          name: session?.user?.name || "Usuário",
          email: session?.user?.email || "",
          image: session?.user?.image || null,
          // @ts-ignore
          bio: session?.user?.bio || null,
        },
        profile: data.profile,
      });
    } catch (err: any) {
      console.error("Erro ao carregar perfil:", err);
      setError(err.message || "Erro ao carregar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const readingPaceLabels: Record<string, string> = {
    slow: "Devagar",
    medium: "Médio",
    fast: "Rápido",
  };

  const preferredLengthLabels: Record<string, string> = {
    short: "Curtos (< 300 páginas)",
    medium: "Médios (300-500 páginas)",
    long: "Longos (> 500 páginas)",
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadProfile} className="mt-4">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    booksRead: 12,
    currentlyReading: 3,
    clubsJoined: 2,
    achievementsUnlocked: 5,
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profileData?.user.image || ""} alt={profileData?.user.name} />
              <AvatarFallback className="text-2xl">
                {profileData?.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{profileData?.user.name}</h1>
              <p className="text-muted-foreground mb-2">{profileData?.user.email}</p>
              {profileData?.user.bio && (
                <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
                  {profileData.user.bio}
                </p>
              )}
              <Button variant="outline" asChild>
                <Link href="/profile/edit">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            label="Livros Lidos"
            value={stats.booksRead}
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Lendo Agora"
            value={stats.currentlyReading}
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            label="Clubes"
            value={stats.clubsJoined}
          />
          <StatCard
            icon={<Award className="h-6 w-6" />}
            label="Conquistas"
            value={stats.achievementsUnlocked}
          />
        </div>

        {/* Reading Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Perfil de Leitura
            </CardTitle>
            <CardDescription>Suas preferências literárias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData?.profile ? (
              <>
                {/* Favorite Genres */}
                {profileData.profile.favoriteGenres.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-primary" />
                      Gêneros Favoritos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.profile.favoriteGenres.map((genre) => (
                        <Badge key={genre} variant="default" className="px-3 py-1.5">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reading Pace */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Ritmo de Leitura
                  </h4>
                  <Badge variant="outline" className="px-3 py-1.5">
                    {readingPaceLabels[profileData.profile.readingPace] || profileData.profile.readingPace}
                  </Badge>
                </div>

                {/* Preferred Length */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Tamanho Preferido
                  </h4>
                  <Badge variant="outline" className="px-3 py-1.5">
                    {preferredLengthLabels[profileData.profile.preferredLength] || profileData.profile.preferredLength}
                  </Badge>
                </div>

                {/* Mood Tags */}
                {profileData.profile.moodTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Vibes Preferidas</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.profile.moodTags.map((mood) => (
                        <Badge key={mood} variant="secondary" className="px-3 py-1.5">
                          {mood}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Você ainda não completou seu perfil de leitura
                </p>
                <Button variant="outline" asChild>
                  <Link href="/onboarding">Completar Perfil</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Conquistas Recentes</CardTitle>
            <CardDescription>Continue desbloqueando novas conquistas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AchievementItem
                icon="🌱"
                title="Explorador Iniciante"
                description="Leia seu primeiro livro"
                unlocked={true}
              />
              <AchievementItem
                icon="📚"
                title="Leitor Voraz"
                description="Complete 10 livros"
                unlocked={true}
              />
              <AchievementItem
                icon="🎭"
                title="Viajante de Gêneros"
                description="Leia livros de 5 gêneros diferentes"
                unlocked={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementItem({
  icon,
  title,
  description,
  unlocked,
}: {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${unlocked ? "bg-card" : "opacity-50"}`}>
      <div className="text-4xl">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {unlocked && (
        <div className="text-primary font-semibold">Desbloqueada!</div>
      )}
    </div>
  );
}
