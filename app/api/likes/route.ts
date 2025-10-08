import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST - Curtir post
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
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "ID do post não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se já curtiu
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Você já curtiu este post" },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId: user.id,
        postId,
      },
    });

    return NextResponse.json({ like }, { status: 201 });
  } catch (error) {
    console.error("Erro ao curtir post:", error);
    return NextResponse.json(
      { error: "Erro ao curtir post" },
      { status: 500 }
    );
  }
}

// DELETE - Descurtir post
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

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (!like) {
      return NextResponse.json(
        { error: "Você não curtiu este post" },
        { status: 404 }
      );
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    return NextResponse.json({ message: "Like removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover like:", error);
    return NextResponse.json(
      { error: "Erro ao remover like" },
      { status: 500 }
    );
  }
}
