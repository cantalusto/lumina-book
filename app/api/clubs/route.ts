import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/clubs
 * Listar todos os clubes (públicos e onde o usuário é membro)
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const myClubs = searchParams.get("myClubs") === "true";

    const whereClause: any = {
      OR: [
        { isPrivate: false },
        ...(session?.user?.email
          ? [
              {
                members: {
                  some: {
                    user: { email: session.user.email },
                  },
                },
              },
            ]
          : []),
      ],
    };

    if (search) {
      whereClause.OR.push(
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      );
    }

    if (myClubs && session?.user?.email) {
      whereClause.members = {
        some: {
          user: { email: session.user.email },
        },
      };
    }

    const clubs = await prisma.club.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { members: true },
        },
        members: session?.user?.email
          ? {
              where: { user: { email: session.user.email } },
              select: { role: true },
            }
          : false,
        books: {
          where: { isCurrent: true },
          include: {
            book: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ clubs });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clubes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clubs
 * Criar um novo clube
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, vibe, coverImage } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Nome e descrição são obrigatórios" },
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

    // Criar clube
    const club = await prisma.club.create({
      data: {
        name,
        description,
        vibe: vibe || "Geral",
        isPublic: true,
        coverImage,
        members: {
          create: {
            userId: user.id,
            role: "founder", // Criador é founder
          },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    return NextResponse.json({ club }, { status: 201 });
  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { error: "Erro ao criar clube" },
      { status: 500 }
    );
  }
}
