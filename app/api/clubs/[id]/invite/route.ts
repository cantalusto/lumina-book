import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/clubs/[id]/invite
 * Enviar convite para usuário
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
    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email do usuário é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar usuário que está enviando o convite
    const inviter = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!inviter) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se é membro do clube
    const member = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: inviter.id,
          clubId: clubId,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Apenas membros podem enviar convites" },
        { status: 403 }
      );
    }

    // Buscar usuário convidado
    const invitedUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: "Usuário convidado não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já é membro
    const existingMember = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: invitedUser.id,
          clubId: clubId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Usuário já é membro do clube" },
        { status: 400 }
      );
    }

    // Verificar se já tem convite pendente
    const existingInvite = await prisma.clubInvite.findUnique({
      where: {
        clubId_invitedUser: {
          clubId: clubId,
          invitedUser: invitedUser.id,
        },
      },
    });

    if (existingInvite && existingInvite.status === "pending") {
      return NextResponse.json(
        { error: "Já existe um convite pendente para este usuário" },
        { status: 400 }
      );
    }

    // Criar convite (expira em 7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.clubInvite.create({
      data: {
        clubId: clubId,
        invitedBy: inviter.id,
        invitedUser: invitedUser.id,
        expiresAt: expiresAt,
      },
    });

    return NextResponse.json({ 
      invite, 
      message: "Convite enviado com sucesso!" 
    });
  } catch (error) {
    console.error("Error sending invite:", error);
    return NextResponse.json(
      { error: "Erro ao enviar convite" },
      { status: 500 }
    );
  }
}
