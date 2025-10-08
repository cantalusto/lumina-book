"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Send,
  Loader2,
  Trash2,
  BookOpen,
  User,
  UserPlus,
  UserMinus,
  Image as ImageIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookDetailsModal } from "@/components/features/BookDetailsModal";

interface User {
  id: string;
  name: string;
  image: string | null;
  avatar: string | null;
}

interface Post {
  id: string;
  content: string;
  bookTitle?: string | null;
  bookAuthor?: string | null;
  bookCover?: string | null;
  user: User;
  likes: { userId: string }[];
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

interface SuggestedUser extends User {
  bio: string | null;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
}

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  useEffect(() => {
    loadFeed();
    loadSuggestedUsers();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestedUsers = async () => {
    try {
      const response = await fetch("/api/users?limit=5");
      const data = await response.json();
      if (response.ok) {
        setSuggestedUsers(data.users);
      }
    } catch (error) {
      console.error("Erro ao carregar sugestões:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (response.ok) {
        setNewPostContent("");
        loadFeed();
      }
    } catch (error) {
      console.error("Erro ao criar post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await fetch(`/api/likes?postId=${postId}`, { method: "DELETE" });
      } else {
        await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
      }
      loadFeed();
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentContent.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: commentContent }),
      });

      if (response.ok) {
        setCommentContent("");
        setActiveCommentBox(null);
        loadFeed();
      }
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      loadSuggestedUsers();
      loadFeed();
    } catch (error) {
      console.error("Erro ao seguir:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      await fetch(`/api/posts?postId=${postId}`, { method: "DELETE" });
      loadFeed();
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };

  const getUserAvatar = (user: User) => {
    return user.image || user.avatar || "";
  };

  const getUserInitials = (user: User) => {
    return user.name?.slice(0, 2).toUpperCase() || "??";
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">O que você está lendo?</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Compartilhe suas descobertas literárias..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                maxLength={1000}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {newPostContent.length}/1000
                </p>
                <Button
                  onClick={handleCreatePost}
                  disabled={isPosting || !newPostContent.trim()}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publicar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum post ainda
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece seguindo outros leitores para ver postagens aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => {
              const isLiked = post.likes.some(
                (like) => like.userId === session?.user?.id
              );
              const isOwnPost = post.user.id === session?.user?.id;

              return (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={getUserAvatar(post.user)} />
                          <AvatarFallback>
                            {getUserInitials(post.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{post.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                      {isOwnPost && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="whitespace-pre-wrap">{post.content}</p>

                    {post.bookTitle && (
                      <div 
                        className="flex gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => setSelectedBook({
                          id: post.id,
                          volumeInfo: {
                            title: post.bookTitle,
                            authors: post.bookAuthor ? [post.bookAuthor] : [],
                            imageLinks: post.bookCover ? {
                              thumbnail: post.bookCover,
                            } : undefined,
                          },
                        })}
                      >
                        {post.bookCover && (
                          <img
                            src={post.bookCover}
                            alt={post.bookTitle}
                            className="w-16 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {post.bookTitle}
                          </p>
                          {post.bookAuthor && (
                            <p className="text-xs text-muted-foreground">
                              {post.bookAuthor}
                            </p>
                          )}
                          <p className="text-xs text-primary mt-2">
                            Clique para ver detalhes e comprar
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex-col items-stretch gap-4">
                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id, isLiked)}
                        className={isLiked ? "text-red-500" : ""}
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 ${
                            isLiked ? "fill-current" : ""
                          }`}
                        />
                        {post._count.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setActiveCommentBox(
                            activeCommentBox === post.id ? null : post.id
                          )
                        }
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post._count.comments}
                      </Button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 border-t pt-4">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={getUserAvatar(comment.user)} />
                              <AvatarFallback>
                                {getUserInitials(comment.user)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted p-3 rounded-lg">
                              <p className="text-sm font-semibold">
                                {comment.user.name}
                              </p>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Box */}
                    {activeCommentBox === post.id && (
                      <div className="flex gap-2 border-t pt-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session?.user?.image || ""} />
                          <AvatarFallback>
                            {session?.user?.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            placeholder="Escreva um comentário..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            rows={2}
                            maxLength={500}
                            className="resize-none"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleComment(post.id)}
                            disabled={!commentContent.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Users */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Sugestões para Seguir
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma sugestão disponível
                </p>
              ) : (
                suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar>
                        <AvatarImage src={getUserAvatar(user)} />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {user.name}
                        </p>
                        {user.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>{user._count.posts} posts</span>
                          <span>•</span>
                          <span>{user._count.followers} seguidores</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFollow(user.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Detalhes do Livro */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
