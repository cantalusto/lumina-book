import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/clubs/[id]
 * Buscar detalhes de um clube específico
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const clubId = params.id;

    // Buscar clube com todos os detalhes
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: [
            { role: 'asc' }, // founder, moderator, member
            { joinedAt: 'asc' },
          ],
        },
        books: {
          include: {
            book: true,
          },
          orderBy: {
            startDate: 'desc',
          },
        },
      },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Clube não encontrado" },
        { status: 404 }
      );
    }

    // Buscar livro atual separadamente (se houver)
    let currentBookData = null;
    if (club.currentBookId) {
      currentBookData = await prisma.clubBook.findFirst({
        where: {
          clubId: clubId,
          bookId: club.currentBookId,
          isCurrent: true,
        },
        include: {
          book: true,
        },
      });
    }

    // Verificar se o usuário é membro (se autenticado)
    let isMember = false;
    let userRole = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        const membership = club.members.find((m: any) => m.userId === user.id);
        isMember = !!membership;
        userRole = membership?.role || null;
      }
    }

    return NextResponse.json({
      ...club,
      currentBook: currentBookData,
      isMember,
      userRole,
      membersCount: club.members.length,
    });
  } catch (error) {
    console.error("Error fetching club:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clube" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clubs/[id]
 * Atualizar informações do clube (apenas fundador/moderador)
 */
export async function PUT(
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
    const { name, description, vibe, coverImage, isPublic } = body;

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
        { error: "Apenas fundadores e moderadores podem editar o clube" },
        { status: 403 }
      );
    }

    // Atualizar clube
    const club = await prisma.club.update({
      where: { id: clubId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(vibe && { vibe }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isPublic !== undefined && { isPublic }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        books: {
          where: { isCurrent: true },
          include: {
            book: true,
          },
        },
      },
    });

    return NextResponse.json({ club, message: "Clube atualizado com sucesso!" });
  } catch (error) {
    console.error("Error updating club:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar clube" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clubs/[id]
 * Excluir clube (apenas fundador)
 */
export async function DELETE(
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

    // Verificar se é fundador
    const member = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: clubId,
        },
      },
    });

    if (!member || member.role !== "founder") {
      return NextResponse.json(
        { error: "Apenas o fundador pode excluir o clube" },
        { status: 403 }
      );
    }

    // Excluir clube (cascade irá remover membros e livros)
    await prisma.club.delete({
      where: { id: clubId },
    });

    return NextResponse.json({ message: "Clube excluído com sucesso!" });
  } catch (error) {
    console.error("Error deleting club:", error);
    return NextResponse.json(
      { error: "Erro ao excluir clube" },
      { status: 500 }
    );
  }
}
