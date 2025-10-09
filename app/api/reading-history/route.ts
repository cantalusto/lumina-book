import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/reading-history
 * Obter histórico de leitura do usuário
 * Query params:
 * - status: "reading" | "completed" | "want_to_read" | "abandoned"
 */
export async function GET(request: NextRequest) {
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

    // Pegar filtro de status da query
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");

    // Buscar histórico
    const history = await prisma.readingHistory.findMany({
      where: {
        userId: user.id,
        ...(statusFilter && { status: statusFilter }),
      },
      include: {
        book: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("❌ Error fetching reading history:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de leitura" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reading-history
 * Adicionar ou atualizar status de leitura de um livro
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookId, status, progress, rating, review } = body;

    // Validar status
    const validStatuses = ["reading", "completed", "want_to_read", "abandoned"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
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

    // Dados para atualizar
    const updateData: any = {
      status,
      ...(typeof progress === "number" && { progress }),
      ...(typeof rating === "number" && { rating }),
      ...(review && { review }),
    };

    // Se começou a ler, registrar data de início
    if (status === "reading" && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }

    // Se completou, registrar data de conclusão
    if (status === "completed") {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    // Criar ou atualizar registro
    const readingHistory = await prisma.readingHistory.upsert({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: bookId,
        },
      },
      update: updateData,
      create: {
        userId: user.id,
        bookId: bookId,
        ...updateData,
      },
      include: {
        book: true,
      },
    });

    return NextResponse.json({ 
      readingHistory,
      message: "Status atualizado com sucesso!" 
    });
  } catch (error) {
    console.error("❌ Error updating reading status:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status de leitura" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reading-history
 * Remover livro do histórico de leitura
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

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

    // Deletar registro
    await prisma.readingHistory.delete({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: bookId,
        },
      },
    });

    return NextResponse.json({ 
      message: "Removido do histórico com sucesso!" 
    });
  } catch (error) {
    console.error("❌ Error deleting reading history:", error);
    return NextResponse.json(
      { error: "Erro ao remover do histórico" },
      { status: 500 }
    );
  }
}
