"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const GENRES = [
  "Fantasia", "Ficção Científica", "Romance", "Mistério", "Thriller",
  "Drama", "Histórico", "Terror", "Aventura", "Biografia",
  "Autoajuda", "Filosofia", "Poesia", "Distopia"
];

const MOODS = [
  { id: "reflective", label: "Reflexivo", emoji: "🤔" },
  { id: "hopeful", label: "Esperançoso", emoji: "✨" },
  { id: "excited", label: "Animado", emoji: "🚀" },
  { id: "melancholic", label: "Melancólico", emoji: "🌧️" },
  { id: "peaceful", label: "Tranquilo", emoji: "🌿" },
  { id: "anxious", label: "Tenso", emoji: "⚡" },
];

const VIBES = [
  { id: "cozy", label: "Aconchegante", emoji: "🏠" },
  { id: "atmospheric", label: "Atmosférico", emoji: "🌫️" },
  { id: "thought-provoking", label: "Provocante", emoji: "💭" },
  { id: "fast-paced", label: "Ritmo Acelerado", emoji: "⚡" },
  { id: "emotional", label: "Emocional", emoji: "💙" },
  { id: "mysterious", label: "Misterioso", emoji: "🔮" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [readingPace, setReadingPace] = useState("medium");
  const [preferredLength, setPreferredLength] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isReconfiguring, setIsReconfiguring] = useState(false);
  const [error, setError] = useState("");

  // Verificar se usuário já tem perfil ao carregar a página
  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (response.ok && data.profile) {
        // Usuário já tem perfil
        // Verificar se está vindo da página de descobrir (reconfigurando)
        const urlParams = new URLSearchParams(window.location.search);
        const reconfigure = urlParams.get("reconfigure");

        if (reconfigure === "true") {
          // Modo reconfiguração - carregar dados existentes
          setIsReconfiguring(true);
          setSelectedGenres(data.profile.favoriteGenres || []);
          setSelectedMoods(data.profile.moodTags || []);
          setReadingPace(data.profile.readingPace || "medium");
          setPreferredLength(data.profile.preferredLength || "medium");
          setIsCheckingProfile(false);
        } else {
          // Já tem perfil e não está reconfigurando - redirecionar para descobrir
          router.push("/discover");
        }
      } else {
        // Não tem perfil - mostrar onboarding
        setIsCheckingProfile(false);
      }
    } catch (error) {
      console.error("Erro ao verificar perfil:", error);
      setIsCheckingProfile(false);
    }
  };

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Salvar perfil no banco de dados
      const profileData = {
        favoriteGenres: selectedGenres,
        moodTags: selectedMoods,
        vibePreferences: {
          atmospheric: selectedVibes.includes("atmospheric") ? 8 : 5,
          plotDriven: selectedVibes.includes("fast-paced") ? 8 : 5,
          characterDriven: selectedVibes.includes("emotional") ? 8 : 5,
          philosophical: selectedVibes.includes("thought-provoking") ? 8 : 5,
          actionPacked: selectedVibes.includes("fast-paced") ? 8 : 5,
        },
        readingPace,
        preferredLength,
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar perfil");
      }

      console.log("Perfil salvo com sucesso:", data);

      // Redirecionar para a página de descoberta
      router.push("/discover");
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      setError(err.message || "Erro ao salvar preferências. Tente novamente.");
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return selectedGenres.length >= 3;
      case 2:
        return selectedMoods.length >= 2;
      case 3:
        return selectedVibes.length >= 2;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Mostrar loading enquanto verifica perfil
  if (isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-3xl font-bold text-gradient">Lúmina</span>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Mensagem de reconfiguração */}
            {isReconfiguring && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  ✨ Reconfigurando suas preferências
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Suas configurações atuais estão pré-selecionadas. Faça as alterações desejadas.
                </p>
              </div>
            )}
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 mx-1 rounded-full transition-all ${
                      i <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Etapa {step} de 4
              </p>
            </div>

            {/* Step 1: Genres */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Quais gêneros você gosta?</h2>
                  <p className="text-muted-foreground">Selecione pelo menos 3 gêneros</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedGenres.includes(genre)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Moods */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Como você se sente hoje?</h2>
                  <p className="text-muted-foreground">Selecione pelo menos 2 moods</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => toggleSelection(mood.id, selectedMoods, setSelectedMoods)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedMoods.includes(mood.id)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-4xl mb-2">{mood.emoji}</div>
                      <div className="font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Vibes */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Qual é sua vibe de leitura?</h2>
                  <p className="text-muted-foreground">Selecione pelo menos 2 vibes</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {VIBES.map((vibe) => (
                    <button
                      key={vibe.id}
                      onClick={() => toggleSelection(vibe.id, selectedVibes, setSelectedVibes)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedVibes.includes(vibe.id)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-4xl mb-2">{vibe.emoji}</div>
                      <div className="font-medium">{vibe.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Reading Preferences */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Preferências de leitura</h2>
                  <p className="text-muted-foreground">Ajude-nos a personalizar suas recomendações</p>
                </div>

                <div className="space-y-4">
                  <Label>Ritmo de leitura</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["slow", "medium", "fast"].map((pace) => (
                      <button
                        key={pace}
                        onClick={() => setReadingPace(pace)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          readingPace === pace
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {pace === "slow" && "Devagar"}
                        {pace === "medium" && "Moderado"}
                        {pace === "fast" && "Rápido"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Tamanho preferido</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["short", "medium", "long"].map((length) => (
                      <button
                        key={length}
                        onClick={() => setPreferredLength(length)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          preferredLength === length
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {length === "short" && "Curto"}
                        {length === "medium" && "Médio"}
                        {length === "long" && "Longo"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={step === 1 || isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                variant="glow"
                disabled={!isStepValid() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : step === 4 ? (
                  <>
                    Finalizar
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
