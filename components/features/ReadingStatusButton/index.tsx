"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookMarked, Check, Eye, Bookmark, Plus } from "lucide-react";
import { toast } from "sonner";

interface ReadingStatusButtonProps {
  bookId: string;
  currentStatus?: string;
  onStatusChange?: (status: string) => void;
}

const statusConfig = {
  reading: {
    label: "Lendo",
    icon: Eye,
    color: "text-blue-500",
  },
  completed: {
    label: "Lido",
    icon: Check,
    color: "text-green-500",
  },
  want_to_read: {
    label: "Quero Ler",
    icon: Bookmark,
    color: "text-amber-500",
  },
};

export function ReadingStatusButton({
  bookId,
  currentStatus,
  onStatusChange,
}: ReadingStatusButtonProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/reading-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      const data = await response.json();
      setStatus(newStatus);
      onStatusChange?.(newStatus);

      // @ts-ignore
      toast.success(data.message || "Status atualizado!");
    } catch (error) {
      console.error("Error updating status:", error);
      // @ts-ignore
      toast.error("Erro ao atualizar status. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = status ? statusConfig[status as keyof typeof statusConfig]?.icon : Plus;
  const statusLabel = status ? statusConfig[status as keyof typeof statusConfig]?.label : "Adicionar";
  const statusColor = status ? statusConfig[status as keyof typeof statusConfig]?.color : "text-muted-foreground";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={status ? "secondary" : "outline"}
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          {StatusIcon && <StatusIcon className={`h-4 w-4 ${statusColor}`} />}
          <span>{statusLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusChange("reading")}
          className="gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4 text-blue-500" />
          <span>Lendo</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("completed")}
          className="gap-2 cursor-pointer"
        >
          <Check className="h-4 w-4 text-green-500" />
          <span>Lido</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("want_to_read")}
          className="gap-2 cursor-pointer"
        >
          <Bookmark className="h-4 w-4 text-amber-500" />
          <span>Quero Ler</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
