import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  // Mock data - em produção, buscar do banco de dados
  const user = {
    name: "Leitor Demo",
    email: "demo@lumina.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
  };

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
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              <Button variant="outline" asChild>
                <Link href="/profile/edit">Editar Perfil</Link>
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
            <CardTitle>Perfil de Leitura</CardTitle>
            <CardDescription>Suas preferências e vibes favoritas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Gêneros Favoritos</h4>
              <div className="flex flex-wrap gap-2">
                {["Fantasia", "Ficção Científica", "Drama"].map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Vibes Preferidas</h4>
              <div className="flex flex-wrap gap-2">
                {["Atmosférico", "Reflexivo", "Aventuroso"].map((vibe) => (
                  <span
                    key={vibe}
                    className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            </div>
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
