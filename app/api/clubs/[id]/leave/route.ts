import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/clubs/[id]/leave
 * Sair de um clube
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

    // Verificar se é membro
    const member = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: clubId,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Você não é membro deste clube" },
        { status: 400 }
      );
    }

    // Impedir que o fundador saia
    if (member.role === "founder") {
      return NextResponse.json(
        { error: "O fundador não pode sair do clube. Transfira a liderança ou exclua o clube." },
        { status: 403 }
      );
    }

    // Remover membro
    await prisma.clubMember.delete({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: clubId,
        },
      },
    });

    return NextResponse.json({ message: "Você saiu do clube com sucesso!" });
  } catch (error) {
    console.error("Error leaving club:", error);
    return NextResponse.json(
      { error: "Erro ao sair do clube" },
      { status: 500 }
    );
  }
}
