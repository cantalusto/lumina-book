"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, BookOpen, Heart, Loader2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

const GENRES = [
  "Fantasia", "Ficção Científica", "Romance", "Mistério", "Thriller",
  "Drama", "Histórico", "Terror", "Aventura", "Biografia",
  "Autoajuda", "Filosofia", "Poesia", "Distopia", "Clássico"
];

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // User data
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  // Reading preferences
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [readingPace, setReadingPace] = useState("medium");
  const [preferredLength, setPreferredLength] = useState("medium");

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

      // Set user data
      if (session?.user) {
        setName(session.user.name || "");
        // @ts-ignore - bio não está no tipo padrão do session
        setBio(session.user.bio || "");
        setAvatar(session.user.image || "");
      }

      // Set reading preferences
      if (data.profile) {
        setFavoriteGenres(data.profile.favoriteGenres || []);
        setReadingPace(data.profile.readingPace || "medium");
        setPreferredLength(data.profile.preferredLength || "medium");
      }
    } catch (err: any) {
      console.error("Erro ao carregar perfil:", err);
      setError(err.message || "Erro ao carregar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGenre = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Update user data
      const userResponse = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          bio,
          avatar,
        }),
      });

      if (!userResponse.ok) {
        const data = await userResponse.json();
        throw new Error(data.error || "Erro ao atualizar perfil");
      }

      // Update reading preferences
      if (favoriteGenres.length > 0) {
        const preferencesResponse = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            favoriteGenres,
            readingPace,
            preferredLength,
            moodTags: [],
            vibePreferences: {},
          }),
        });

        if (!preferencesResponse.ok) {
          const data = await preferencesResponse.json();
          throw new Error(data.error || "Erro ao atualizar preferências");
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setError(err.message || "Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Perfil
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Editar Perfil</h1>
        <p className="text-muted-foreground">
          Atualize suas informações e preferências de leitura
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <p className="text-green-500 font-medium">Perfil atualizado com sucesso!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Seus dados básicos visíveis para outros usuários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre você e seus gostos literários..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/500 caracteres
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reading Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Preferências de Leitura
            </CardTitle>
            <CardDescription>
              Ajude-nos a recomendar livros perfeitos para você
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Favorite Genres */}
            <div className="space-y-3">
              <Label>Gêneros Favoritos (selecione pelo menos 3)</Label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <Badge
                    key={genre}
                    variant={favoriteGenres.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1.5"
                    onClick={() => toggleGenre(genre)}
                  >
                    {favoriteGenres.includes(genre) && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {favoriteGenres.length} gênero{favoriteGenres.length !== 1 ? "s" : ""} selecionado{favoriteGenres.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Reading Pace */}
            <div className="space-y-3">
              <Label>Ritmo de Leitura</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "slow", label: "Devagar", desc: "Leio com calma" },
                  { value: "medium", label: "Médio", desc: "Ritmo normal" },
                  { value: "fast", label: "Rápido", desc: "Leio muito" },
                ].map((pace) => (
                  <button
                    key={pace.value}
                    onClick={() => setReadingPace(pace.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      readingPace === pace.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold">{pace.label}</p>
                    <p className="text-xs text-muted-foreground">{pace.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Length */}
            <div className="space-y-3">
              <Label>Tamanho Preferido</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "short", label: "Curto", desc: "< 300 páginas" },
                  { value: "medium", label: "Médio", desc: "300-500 páginas" },
                  { value: "long", label: "Longo", desc: "> 500 páginas" },
                ].map((length) => (
                  <button
                    key={length.value}
                    onClick={() => setPreferredLength(length.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      preferredLength === length.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold">{length.label}</p>
                    <p className="text-xs text-muted-foreground">{length.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Link href="/profile">
            <Button variant="outline" disabled={isSaving}>
              Cancelar
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={isSaving || favoriteGenres.length < 3}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
