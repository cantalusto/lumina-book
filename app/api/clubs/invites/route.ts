import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/clubs/invites
 * Listar convites pendentes do usuário
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Buscar convites pendentes
    const invites = await prisma.clubInvite.findMany({
      where: {
        invitedUser: user.id,
        status: "pending",
        expiresAt: {
          gt: new Date(), // Apenas convites não expirados
        },
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            description: true,
            vibe: true,
            coverImage: true,
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
        inviter: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json(
      { error: "Erro ao buscar convites" },
      { status: 500 }
    );
  }
}
