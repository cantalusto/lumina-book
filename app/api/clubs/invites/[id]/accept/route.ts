import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/clubs/invites/[id]/accept
 * Aceitar convite
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

    // Verificar se expirou
    if (new Date() > invite.expiresAt) {
      return NextResponse.json(
        { error: "Este convite expirou" },
        { status: 400 }
      );
    }

    // Verificar se já é membro
    const existingMember = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: invite.clubId,
        },
      },
    });

    if (existingMember) {
      // Atualizar status do convite
      await prisma.clubInvite.update({
        where: { id: inviteId },
        data: { status: "accepted" },
      });

      return NextResponse.json({ message: "Você já é membro deste clube!" });
    }

    // Adicionar como membro
    await prisma.clubMember.create({
      data: {
        userId: user.id,
        clubId: invite.clubId,
        role: "member",
      },
    });

    // Atualizar status do convite
    await prisma.clubInvite.update({
      where: { id: inviteId },
      data: { status: "accepted" },
    });

    return NextResponse.json({ message: "Convite aceito! Você agora é membro do clube." });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return NextResponse.json(
      { error: "Erro ao aceitar convite" },
      { status: 500 }
    );
  }
}
