import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateVibeGradient(vibeTags: string[]): string {
  const vibeColors: Record<string, string> = {
    cozy: "from-orange-500 to-pink-500",
    atmospheric: "from-blue-600 to-purple-600",
    "thought-provoking": "from-indigo-500 to-purple-500",
    "fast-paced": "from-red-500 to-orange-500",
    emotional: "from-pink-500 to-rose-500",
    dark: "from-gray-700 to-black",
    uplifting: "from-yellow-400 to-orange-400",
    mysterious: "from-purple-900 to-indigo-900",
    romantic: "from-rose-400 to-pink-500",
    adventurous: "from-green-500 to-teal-500",
  };

  const primaryVibe = vibeTags[0] || "atmospheric";
  return vibeColors[primaryVibe] || vibeColors.atmospheric;
}
