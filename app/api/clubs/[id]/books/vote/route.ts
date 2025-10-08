import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/clubs/[id]/books/vote
 * Votar em um livro para se tornar a próxima leitura
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
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        { error: "ID do livro é obrigatório" },
        { status: 400 }
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
        { error: "Apenas membros podem votar" },
        { status: 403 }
      );
    }

    // Verificar se livro está no clube
    const clubBook = await prisma.clubBook.findUnique({
      where: {
        clubId_bookId: {
          clubId: clubId,
          bookId: bookId,
        },
      },
    });

    if (!clubBook) {
      return NextResponse.json(
        { error: "Livro não está no clube" },
        { status: 404 }
      );
    }

    if (clubBook.isCurrent) {
      return NextResponse.json(
        { error: "Este livro já é a leitura atual" },
        { status: 400 }
      );
    }

    // Incrementar voto
    const updatedClubBook = await prisma.clubBook.update({
      where: {
        clubId_bookId: {
          clubId: clubId,
          bookId: bookId,
        },
      },
      data: {
        votes: {
          increment: 1,
        },
      },
      include: {
        book: true,
      },
    });

    return NextResponse.json({ 
      clubBook: updatedClubBook, 
      message: "Voto registrado!" 
    });
  } catch (error) {
    console.error("Error voting for book:", error);
    return NextResponse.json(
      { error: "Erro ao votar" },
      { status: 500 }
    );
  }
}
