import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/clubs/[id]/discussions
 * Listar discussões do clube
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clubId = params.id;

    // Verificar se clube existe
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Clube não encontrado" },
        { status: 404 }
      );
    }

    // Buscar discussões com replies
    const discussions = await prisma.clubDiscussion.findMany({
      where: { 
        clubId: clubId,
        parentId: null, // Apenas discussões principais (não replies)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ discussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Erro ao buscar discussões" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clubs/[id]/discussions
 * Criar nova discussão
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
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Conteúdo é obrigatório" },
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

    // Verificar se é membro do clube
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
        { error: "Apenas membros podem criar discussões" },
        { status: 403 }
      );
    }

    // Criar discussão
    const discussion = await prisma.clubDiscussion.create({
      data: {
        content,
        userId: user.id,
        clubId: clubId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ discussion, message: "Discussão criada com sucesso!" });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Erro ao criar discussão" },
      { status: 500 }
    );
  }
}
