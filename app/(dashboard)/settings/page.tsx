"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useState(() => {
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Aparência</CardTitle>
          </div>
          <CardDescription>
            Personalize como o Lúmina aparece para você
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tema</Label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setTheme(option.value)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conta */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Conta</CardTitle>
          </div>
          <CardDescription>
            Informações da sua conta no Lúmina
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Nome</Label>
            <p className="text-base">{session?.user?.name || "Não informado"}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <p className="text-base">{session?.user?.email || "Não informado"}</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notificações</CardTitle>
          </div>
          <CardDescription>
            Configure como você quer receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recomendações de livros</Label>
              <p className="text-sm text-muted-foreground">
                Receba sugestões personalizadas de leitura
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ativar
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Atividade do clube</Label>
              <p className="text-sm text-muted-foreground">
                Novos posts e discussões nos seus clubes
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ativar
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Novos seguidores</Label>
              <p className="text-sm text-muted-foreground">
                Quando alguém começar a seguir você
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ativar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacidade */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Privacidade</CardTitle>
          </div>
          <CardDescription>
            Controle quem pode ver suas informações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Perfil público</Label>
              <p className="text-sm text-muted-foreground">
                Qualquer pessoa pode ver seu perfil
              </p>
            </div>
            <Button variant="outline" size="sm">
              Público
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mostrar biblioteca</Label>
              <p className="text-sm text-muted-foreground">
                Outros usuários podem ver seus livros
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ativar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
