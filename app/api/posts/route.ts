import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - Buscar feed de posts (posts de quem você segue + seus próprios posts)
export async function GET(request: Request) {
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
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Buscar IDs de quem o usuário segue
    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    // Buscar posts do usuário + posts de quem ele segue
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { userId: user.id },
          { userId: { in: followingIds } },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limitar a 50 posts mais recentes
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

// POST - Criar novo post
export async function POST(request: Request) {
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
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content, bookTitle, bookAuthor, bookCover, bookId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "O conteúdo do post não pode estar vazio" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "O post não pode ter mais de 1000 caracteres" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        content,
        bookTitle,
        bookAuthor,
        bookCover,
        bookId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json(
      { error: "Erro ao criar post" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar post próprio
export async function DELETE(request: Request) {
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
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "ID do post não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se o post pertence ao usuário
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    if (post.userId !== user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para deletar este post" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return NextResponse.json(
      { error: "Erro ao deletar post" },
      { status: 500 }
    );
  }
}
