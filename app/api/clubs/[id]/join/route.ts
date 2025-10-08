import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/clubs/[id]/join
 * Entrar em um clube
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const clubId = params.id;

    // Verificar se clube existe
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Clube não encontrado" },
        { status: 404 }
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

    // Verificar se já é membro
    const existingMember = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: clubId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Você já é membro deste clube" },
        { status: 400 }
      );
    }

    // Adicionar como membro
    const member = await prisma.clubMember.create({
      data: {
        userId: user.id,
        clubId: clubId,
        role: "member",
      },
    });

    return NextResponse.json({ member, message: "Entrou no clube com sucesso!" });
  } catch (error) {
    console.error("Error joining club:", error);
    return NextResponse.json(
      { error: "Erro ao entrar no clube" },
      { status: 500 }
    );
  }
}
