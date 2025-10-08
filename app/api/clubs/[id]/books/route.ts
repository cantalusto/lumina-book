import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/clubs/[id]/books
 * Adicionar livro ao clube
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
    const { bookId, setCurrent } = body;

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
        { error: "Apenas fundadores e moderadores podem adicionar livros" },
        { status: 403 }
      );
    }

    // Verificar se livro existe
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Livro não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se livro já está no clube
    const existingClubBook = await prisma.clubBook.findUnique({
      where: {
        clubId_bookId: {
          clubId: clubId,
          bookId: bookId,
        },
      },
    });

    if (existingClubBook) {
      return NextResponse.json(
        { error: "Livro já está no clube" },
        { status: 400 }
      );
    }

    // Se setCurrent for true, remover isCurrent de outros livros
    if (setCurrent) {
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
    }

    // Adicionar livro ao clube
    const clubBook = await prisma.clubBook.create({
      data: {
        clubId: clubId,
        bookId: bookId,
        isCurrent: setCurrent || false,
      },
      include: {
        book: true,
      },
    });

    // Atualizar currentBookId do clube se necessário
    if (setCurrent) {
      await prisma.club.update({
        where: { id: clubId },
        data: { currentBookId: bookId },
      });
    }

    return NextResponse.json({ 
      clubBook, 
      message: "Livro adicionado com sucesso!" 
    });
  } catch (error) {
    console.error("Error adding book to club:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar livro" },
      { status: 500 }
    );
  }
}
