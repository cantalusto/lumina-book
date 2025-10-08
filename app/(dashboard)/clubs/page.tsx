"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, BookOpen, MessageCircle, Calendar, Search, Crown, Loader2 } from "lucide-react";

interface Club {
  id: string;
  name: string;
  description: string;
  vibe: string;
  coverImage: string | null;
  isPublic: boolean;
  membersCount: number;
  currentBook?: {
    book: {
      id: string;
      title: string;
      author: string;
      cover: string | null;
    };
  };
  isMember: boolean;
}

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    vibe: "",
    isPublic: true,
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar clubes
  useEffect(() => {
    loadClubs();
  }, [searchQuery]);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      
      const response = await fetch(`/api/clubs?${params}`);
      if (!response.ok) throw new Error('Erro ao carregar clubes');
      
      const data = await response.json();
      setClubs(data.clubs);
    } catch (error) {
      console.error('Error loading clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const myClubs = clubs.filter((club) => club.isMember);
  const suggestedClubs = clubs.filter((club) => !club.isMember);

  const handleCreateClub = async () => {
    try {
      const response = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClub),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar clube');
      }

      alert('Clube criado com sucesso!');
      setIsCreateDialogOpen(false);
      setNewClub({ name: "", description: "", vibe: "", isPublic: true });
      loadClubs(); // Recarregar lista
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">👥 Clubes de Leitura</h1>
          <p className="text-muted-foreground">
            Conecte-se com leitores e compartilhe experiências
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Clube
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Clube</DialogTitle>
              <DialogDescription>
                Reúna pessoas que compartilham suas vibes literárias
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="club-name">Nome do Clube</Label>
                <Input
                  id="club-name"
                  placeholder="Ex: Leitores de Fantasia"
                  value={newClub.name}
                  onChange={(e) =>
                    setNewClub({ ...newClub, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-description">Descrição</Label>
                <Textarea
                  id="club-description"
                  placeholder="Descreva o propósito e as vibes do seu clube..."
                  value={newClub.description}
                  onChange={(e) =>
                    setNewClub({ ...newClub, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-vibe">Vibe do Clube</Label>
                <Input
                  id="club-vibe"
                  placeholder="Ex: cozy, dark, uplifting"
                  value={newClub.vibe}
                  onChange={(e) =>
                    setNewClub({ ...newClub, vibe: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="club-public"
                  checked={newClub.isPublic}
                  onChange={(e) =>
                    setNewClub({ ...newClub, isPublic: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="club-public" className="cursor-pointer">
                  Clube público (qualquer um pode entrar)
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateClub}
                disabled={!newClub.name || !newClub.description}
              >
                Criar Clube
              </Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clubes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* My Clubs */}
          {myClubs.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                Meus Clubes
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.map((club) => (
                  <ClubCard key={club.id} club={club} onUpdate={loadClubs} />
                ))}
              </div>
            </section>
          )}

          {/* Suggested Clubs */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {myClubs.length > 0 ? "Descobrir Mais Clubes" : "Clubes Disponíveis"}
            </h2>
            {suggestedClubs.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-semibold mb-2">Nenhum clube encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente buscar por outro nome ou crie seu próprio clube
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Clube
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedClubs.map((club) => (
                  <ClubCard key={club.id} club={club} onUpdate={loadClubs} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ClubCard({ club, onUpdate }: { club: Club; onUpdate: () => void }) {
  const [isJoined, setIsJoined] = useState(club.isMember);
  const [loading, setLoading] = useState(false);

  const handleJoinToggle = async () => {
    try {
      setLoading(true);
      const endpoint = isJoined 
        ? `/api/clubs/${club.id}/leave`
        : `/api/clubs/${club.id}/join`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar solicitação');
      }

      setIsJoined(!isJoined);
      onUpdate(); // Recarregar lista para atualizar contadores
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentBookTitle = club.currentBook?.book.title || "Nenhum livro selecionado";
  const bookCover = club.currentBook?.book.cover || club.coverImage;

  return (
    <Card className="group hover:shadow-xl transition-all overflow-hidden">
      <div className="relative">
        {/* Current Book Cover */}
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          {bookCover ? (
            <img
              src={bookCover}
              alt={currentBookTitle}
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-white mx-auto mb-2" />
              <p className="text-white font-semibold text-sm px-4">
                {currentBookTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Private Badge */}
        {!club.isPublic && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-black/50 text-white border-none"
          >
            Privado
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span className="line-clamp-2">{club.name}</span>
          {isJoined && <Crown className="h-5 w-5 text-primary flex-shrink-0" />}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {club.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vibe Tag */}
        {club.vibe && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {club.vibe}
            </Badge>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{club.membersCount} membros</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isJoined ? (
            <>
              <Button className="flex-1 gap-2" variant="default">
                <MessageCircle className="h-4 w-4" />
                Ver Clube
              </Button>
              <Button
                variant="outline"
                onClick={handleJoinToggle}
                disabled={loading}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sair"}
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              variant={!club.isPublic ? "outline" : "default"}
              onClick={handleJoinToggle}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                !club.isPublic ? "Solicitar Convite" : "Entrar no Clube"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
