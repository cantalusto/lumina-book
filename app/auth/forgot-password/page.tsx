"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao enviar email");
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError("Erro ao enviar email. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold text-gradient">Lúmina</span>
            </div>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">Email Enviado!</CardTitle>
            <CardDescription>
              Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-sm">
              <p className="mb-2">📧 Enviamos um link de redefinição de senha para:</p>
              <p className="font-semibold text-primary">{email}</p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✨ <strong>Próximos passos:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Abra seu email</li>
                <li>Clique no link de redefinição</li>
                <li>Crie sua nova senha</li>
                <li>Faça login normalmente</li>
              </ol>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
              <p className="text-yellow-700 dark:text-yellow-500">
                <strong>⏰ Atenção:</strong> O link expira em 1 hora
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Não recebeu o email?</p>
              <ul className="list-disc list-inside ml-2">
                <li>Verifique sua pasta de spam</li>
                <li>Aguarde alguns minutos</li>
                <li>Tente novamente se necessário</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/auth/signin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Login
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
              >
                Tentar Outro Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold text-gradient">Lúmina</span>
          </div>
          <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Sem problemas! Vamos te ajudar a recuperar o acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
              <p>📧 <strong>Como funciona:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
                <li>Digite seu email cadastrado</li>
                <li>Enviaremos um link seguro</li>
                <li>Clique no link e crie uma nova senha</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email cadastrado</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            <Button type="submit" className="w-full" variant="glow" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
            </Button>

            <div className="text-center text-sm">
              <Link
                href="/auth/signin"
                className="text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-3 w-3" />
                Voltar para o login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
