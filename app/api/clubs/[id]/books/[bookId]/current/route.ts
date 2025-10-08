import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * PUT /api/clubs/[id]/books/[bookId]/current
 * Definir livro como leitura atual do clube
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string; bookId: string } }
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
    const bookId = params.bookId;

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

    // Verificar se é fundador ou moderador
    const member = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: clubId,
        },
      },
    });

    if (!member || (member.role !== "founder" && member.role !== "moderator")) {
      return NextResponse.json(
        { error: "Apenas fundadores e moderadores podem definir o livro atual" },
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

    // Remover isCurrent de outros livros e marcar como concluídos
    await prisma.clubBook.updateMany({
      where: {
        clubId: clubId,
        isCurrent: true,
      },
      data: {
        isCurrent: false,
        endDate: new Date(),
      },
    });

    // Definir novo livro atual
    const updatedClubBook = await prisma.clubBook.update({
      where: {
        clubId_bookId: {
          clubId: clubId,
          bookId: bookId,
        },
      },
      data: {
        isCurrent: true,
        startDate: new Date(),
        endDate: null,
      },
      include: {
        book: true,
      },
    });

    // Atualizar currentBookId do clube
    await prisma.club.update({
      where: { id: clubId },
      data: { currentBookId: bookId },
    });

    return NextResponse.json({ 
      clubBook: updatedClubBook, 
      message: "Livro definido como leitura atual!" 
    });
  } catch (error) {
    console.error("Error setting current book:", error);
    return NextResponse.json(
      { error: "Erro ao definir livro atual" },
      { status: 500 }
    );
  }
}
