import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/swipes - Salvar ação de swipe
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { bookId, title, author, cover, description, genres, action } = body;

    // Validar dados
    if (!bookId || !title || !action) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    if (!["like", "dislike", "super_like"].includes(action)) {
      return NextResponse.json(
        { error: "Ação inválida" },
        { status: 400 }
      );
    }

    // Verificar se o livro já existe no banco
    let book = await prisma.book.findUnique({
      where: { googleBooksId: bookId },
    });

    // Se não existir, criar
    if (!book) {
      book = await prisma.book.create({
        data: {
          googleBooksId: bookId,
          title,
          author,
          cover,
          description,
          genres: genres || [],
          vibeTags: genres || [],
          mood: [],
          atmosphere: [],
          pace: "medium",
          intensity: 3,
        },
      });
    }

    // Verificar se já existe um swipe deste usuário para este livro
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: book.id,
        },
      },
    });

    if (existingSwipe) {
      // Atualizar swipe existente
      const updatedSwipe = await prisma.swipe.update({
        where: {
          userId_bookId: {
            userId: user.id,
            bookId: book.id,
          },
        },
        data: {
          action,
        },
      });

      return NextResponse.json({
        success: true,
        swipe: updatedSwipe,
        message: "Swipe atualizado com sucesso",
      });
    }

    // Criar novo swipe
    const swipe = await prisma.swipe.create({
      data: {
        userId: user.id,
        bookId: book.id,
        action,
      },
    });

    // Se for like ou super_like, atualizar perfil de leitura do usuário
    if (action === "like" || action === "super_like") {
      const readingProfile = await prisma.readingProfile.findUnique({
        where: { userId: user.id },
      });

      if (readingProfile && genres && genres.length > 0) {
        // Adicionar gêneros aos favoritos (se não existirem)
        const currentGenres = readingProfile.favoriteGenres as string[];
        const newGenres = genres.filter((g: string) => !currentGenres.includes(g));
        
        if (newGenres.length > 0) {
          await prisma.readingProfile.update({
            where: { userId: user.id },
            data: {
              favoriteGenres: [...currentGenres, ...newGenres.slice(0, 3)], // Limitar para não crescer demais
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      swipe,
      message: "Swipe salvo com sucesso",
    });

  } catch (error) {
    console.error("Erro ao salvar swipe:", error);
    return NextResponse.json(
      { error: "Erro ao salvar swipe" },
      { status: 500 }
    );
  }
}

// GET /api/swipes - Buscar histórico de swipes do usuário
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // like, dislike, super_like
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {
      userId: user.id,
    };

    if (action) {
      where.action = action;
    }

    const swipes = await prisma.swipe.findMany({
      where,
      include: {
        book: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json({
      swipes,
      total: swipes.length,
    });

  } catch (error) {
    console.error("Erro ao buscar swipes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar swipes" },
      { status: 500 }
    );
  }
}
