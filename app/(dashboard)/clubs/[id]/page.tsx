"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  BookOpen,
  MessageCircle,
  Calendar,
  Crown,
  Settings,
  ArrowLeft,
  Send,
  Loader2,
  Plus,
  ThumbsUp,
  MoreVertical,
} from "lucide-react";
import { BookDetailsModal } from "@/components/features/BookDetailsModal";
import Image from "next/image";

interface Member {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string | null;
}

interface ClubBook {
  id: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  book: Book;
  votes?: number;
}

interface Discussion {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  replies: Discussion[];
}

interface ClubDetails {
  id: string;
  name: string;
  description: string;
  vibe: string;
  coverImage: string | null;
  isPublic: boolean;
  currentBookId: string | null;
  createdAt: string;
  members: Member[];
  books: ClubBook[];
  currentBook: ClubBook | null;
  isMember: boolean;
  userRole: string | null;
  membersCount: number;
}

export default function ClubDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.id as string;

  const [club, setClub] = useState<ClubDetails | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<"discussions" | "members" | "books">("discussions");
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadClubDetails();
    loadDiscussions();
  }, [clubId]);

  const loadClubDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clubs/${clubId}`);
      if (!response.ok) throw new Error("Erro ao carregar clube");

      const data = await response.json();
      setClub(data);
    } catch (error) {
      console.error("Error loading club:", error);
      alert("Erro ao carregar detalhes do clube");
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussions = async () => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/discussions`);
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data.discussions || []);
      }
    } catch (error) {
      console.error("Error loading discussions:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      const response = await fetch(`/api/clubs/${clubId}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error("Erro ao enviar mensagem");

      setNewMessage("");
      loadDiscussions();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!club) return;

    try {
      const endpoint = club.isMember
        ? `/api/clubs/${clubId}/leave`
        : `/api/clubs/${clubId}/join`;

      const response = await fetch(endpoint, { method: "POST" });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      loadClubDetails();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Clube não encontrado</h2>
        <Button onClick={() => router.push("/clubs")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Clubes
        </Button>
      </div>
    );
  }

  const founder = club.members.find((m) => m.role === "founder");
  const canEdit = club.userRole === "founder" || club.userRole === "moderator";

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/clubs")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Cover Image */}
        <div className="relative h-48 rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary/20 to-secondary/20">
          {club.currentBook?.book.cover ? (
            <img
              src={club.currentBook.book.cover}
              alt={club.name}
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">{club.name}</h1>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-none">
                  {club.vibe}
                </Badge>
                {!club.isPublic && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-none">
                    Privado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-lg text-muted-foreground mb-2">{club.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{club.membersCount} membros</span>
              </div>
              {founder && (
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-primary" />
                  <span>Fundado por {founder.user.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {club.isMember ? (
              <>
                {canEdit && (
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleJoinLeave}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  Sair do Clube
                </Button>
              </>
            ) : (
              <Button onClick={handleJoinLeave}>
                {club.isPublic ? "Entrar no Clube" : "Solicitar Convite"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("discussions")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "discussions"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle className="h-4 w-4 inline mr-2" />
          Discussões
        </button>
        <button
          onClick={() => setActiveTab("books")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "books"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          Livros
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "members"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Membros
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === "discussions" && (
            <div className="space-y-4">
              {/* Send Message */}
              {club.isMember && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Compartilhe suas ideias..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="mt-2 w-full"
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Enviar
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Discussions */}
              {discussions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma discussão ainda</h3>
                    <p className="text-muted-foreground">
                      Seja o primeiro a compartilhar suas ideias!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                discussions.map((discussion) => (
                  <Card key={discussion.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10 bg-primary/10">
                          {discussion.user.image ? (
                            <img src={discussion.user.image} alt={discussion.user.name} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-primary font-semibold">
                              {discussion.user.name[0].toUpperCase()}
                            </div>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{discussion.user.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(discussion.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <p className="text-sm mb-3 whitespace-pre-wrap">{discussion.content}</p>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Curtir
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Responder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "books" && (
            <div className="space-y-4">
              {canEdit && (
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Livro
                </Button>
              )}

              {/* Current Book */}
              {club.currentBook && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Leitura Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {club.currentBook.book.cover && (
                        <img
                          src={club.currentBook.book.cover}
                          alt={club.currentBook.book.title}
                          className="w-24 h-36 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedBook(club.currentBook!.book)}
                        />
                      )}
                      <div className="flex-1">
                        <h3
                          className="font-bold text-lg mb-1 cursor-pointer hover:text-primary"
                          onClick={() => setSelectedBook(club.currentBook!.book)}
                        >
                          {club.currentBook.book.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {club.currentBook.book.author}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Início: {new Date(club.currentBook.startDate).toLocaleDateString("pt-BR")}
                          </p>
                          {club.currentBook.endDate && (
                            <p>
                              Término: {new Date(club.currentBook.endDate).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Book History */}
              {club.books.filter((b) => !b.isCurrent).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Leituras</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {club.books
                        .filter((b) => !b.isCurrent)
                        .map((clubBook) => (
                          <div
                            key={clubBook.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => setSelectedBook(clubBook.book)}
                          >
                            {clubBook.book.cover && (
                              <img
                                src={clubBook.book.cover}
                                alt={clubBook.book.title}
                                className="w-12 h-18 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">
                                {clubBook.book.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {clubBook.book.author}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {club.books.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum livro ainda</h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione o primeiro livro para o clube começar a ler!
                    </p>
                    {canEdit && (
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Livro
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <Card>
              <CardHeader>
                <CardTitle>Membros ({club.membersCount})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {club.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary/10">
                          {member.user.image ? (
                            <img src={member.user.image} alt={member.user.name} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-primary font-semibold">
                              {member.user.name[0].toUpperCase()}
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{member.user.name}</span>
                            {member.role === "founder" && (
                              <Crown className="h-4 w-4 text-primary" />
                            )}
                            {member.role === "moderator" && (
                              <Badge variant="secondary" className="text-xs">
                                Moderador
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Membro desde {new Date(member.joinedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      {canEdit && member.role === "member" && (
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Current Book Card */}
          {club.currentBook && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📖 Lendo Agora</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedBook(club.currentBook!.book)}
                >
                  {club.currentBook.book.cover && (
                    <img
                      src={club.currentBook.book.cover}
                      alt={club.currentBook.book.title}
                      className="w-full rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-bold mb-1">{club.currentBook.book.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {club.currentBook.book.author}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">📊 Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Membros</span>
                <span className="font-semibold">{club.membersCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Livros lidos</span>
                <span className="font-semibold">
                  {club.books.filter((b) => !b.isCurrent).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discussões</span>
                <span className="font-semibold">{discussions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsModal
          book={{
            id: selectedBook.id,
            volumeInfo: {
              title: selectedBook.title,
              authors: [selectedBook.author],
              imageLinks: {
                thumbnail: selectedBook.cover || "",
              },
            },
          } as any}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
