"use client";

import { useState } from "react";
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
import { Users, Plus, BookOpen, MessageCircle, Calendar, Search, Crown } from "lucide-react";

// Mock data - em produção, buscar do banco de dados
const mockClubs = [
  {
    id: "1",
    name: "Leitores de Fantasia",
    description: "Para amantes de mundos mágicos e aventuras épicas",
    memberCount: 247,
    currentBook: "O Nome do Vento",
    bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    nextMeeting: "2024-02-15",
    vibeTags: ["atmospheric", "adventurous"],
    isPrivate: false,
    isMember: true,
  },
  {
    id: "2",
    name: "Clássicos Modernos",
    description: "Explorando a literatura contemporânea que se tornou atemporal",
    memberCount: 189,
    currentBook: "1984",
    bookCover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    nextMeeting: "2024-02-20",
    vibeTags: ["thought-provoking", "dark"],
    isPrivate: false,
    isMember: false,
  },
  {
    id: "3",
    name: "Histórias Emocionantes",
    description: "Livros que tocam o coração e transformam perspectivas",
    memberCount: 312,
    currentBook: "A Menina que Roubava Livros",
    bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    nextMeeting: "2024-02-18",
    vibeTags: ["emotional", "uplifting"],
    isPrivate: false,
    isMember: true,
  },
  {
    id: "4",
    name: "Mistérios e Suspense",
    description: "Para quem ama uma boa trama de mistério",
    memberCount: 156,
    currentBook: "O Oceano no Fim do Caminho",
    bookCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    nextMeeting: "2024-02-22",
    vibeTags: ["mysterious", "magical"],
    isPrivate: true,
    isMember: false,
  },
];

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  const filteredClubs = mockClubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myClubs = filteredClubs.filter((club) => club.isMember);
  const suggestedClubs = filteredClubs.filter((club) => !club.isMember);

  const handleCreateClub = () => {
    // Em produção, enviar para API
    console.log("Criar clube:", newClub);
    setIsCreateDialogOpen(false);
    setNewClub({ name: "", description: "", isPrivate: false });
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="club-private"
                  checked={newClub.isPrivate}
                  onChange={(e) =>
                    setNewClub({ ...newClub, isPrivate: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="club-private" className="cursor-pointer">
                  Clube privado (apenas por convite)
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

      {/* My Clubs */}
      {myClubs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            Meus Clubes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      )}

      {/* Suggested Clubs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {myClubs.length > 0 ? "Descobrir Mais Clubes" : "Clubes Disponíveis"}
        </h2>
        {suggestedClubs.length === 0 ? (
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
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ClubCard({ club }: { club: (typeof mockClubs)[0] }) {
  const [isJoined, setIsJoined] = useState(club.isMember);

  const handleJoinToggle = () => {
    // Em produção, enviar para API
    setIsJoined(!isJoined);
  };

  const meetingDate = new Date(club.nextMeeting);
  const formattedDate = meetingDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Card className="group hover:shadow-xl transition-all overflow-hidden">
      <div className="relative">
        {/* Current Book Cover */}
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          <img
            src={club.bookCover}
            alt={club.currentBook}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-white mx-auto mb-2" />
              <p className="text-white font-semibold text-sm px-4">
                Lendo: {club.currentBook}
              </p>
            </div>
          </div>
        </div>

        {/* Private Badge */}
        {club.isPrivate && (
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
        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-2">
          {club.vibeTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{club.memberCount} membros</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isJoined ? (
            <>
              <Button className="flex-1 gap-2" variant="default">
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
              <Button
                variant="outline"
                onClick={handleJoinToggle}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              variant={club.isPrivate ? "outline" : "default"}
              onClick={handleJoinToggle}
            >
              {club.isPrivate ? "Solicitar Convite" : "Entrar no Clube"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
