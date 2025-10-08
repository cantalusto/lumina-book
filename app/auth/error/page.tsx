"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertCircle } from "lucide-react";

const errorMessages: Record<string, string> = {
  Configuration: "Erro de configuração no servidor. Entre em contato com o suporte.",
  AccessDenied: "Acesso negado. Você não tem permissão para acessar este recurso.",
  Verification: "Erro ao verificar o token. O link pode ter expirado.",
  OAuthSignin: "Erro ao iniciar login com provedor externo.",
  OAuthCallback: "Erro ao processar resposta do provedor externo.",
  OAuthCreateAccount: "Erro ao criar conta com provedor externo.",
  EmailCreateAccount: "Erro ao criar conta com email.",
  Callback: "Erro no processo de autenticação.",
  OAuthAccountNotLinked: "Esta conta já está vinculada a outro método de login.",
  EmailSignin: "Erro ao enviar email de login.",
  CredentialsSignin: "Email ou senha inválidos. Verifique suas credenciais.",
  SessionRequired: "Por favor, faça login para acessar esta página.",
  default: "Erro ao fazer login. Tente novamente.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-destructive/5">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Erro de Autenticação</CardTitle>
          <CardDescription>
            Ocorreu um problema durante o processo de login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-center text-destructive">{errorMessage}</p>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full" variant="default">
              <Link href="/auth/signin">Tentar Novamente</Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/">Voltar para Início</Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Precisa de ajuda?{" "}
              <Link href="/support" className="text-primary hover:underline">
                Entre em contato
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
