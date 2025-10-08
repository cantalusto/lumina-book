import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/clubs/invites/[id]/reject
 * Rejeitar convite
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

    const inviteId = params.id;

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

    // Buscar convite
    const invite = await prisma.clubInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o convite é para este usuário
    if (invite.invitedUser !== user.id) {
      return NextResponse.json(
        { error: "Este convite não é para você" },
        { status: 403 }
      );
    }

    // Verificar se já foi aceito/rejeitado
    if (invite.status !== "pending") {
      return NextResponse.json(
        { error: "Este convite já foi processado" },
        { status: 400 }
      );
    }

    // Atualizar status do convite
    await prisma.clubInvite.update({
      where: { id: inviteId },
      data: { status: "rejected" },
    });

    return NextResponse.json({ message: "Convite rejeitado." });
  } catch (error) {
    console.error("Error rejecting invite:", error);
    return NextResponse.json(
      { error: "Erro ao rejeitar convite" },
      { status: 500 }
    );
  }
}
