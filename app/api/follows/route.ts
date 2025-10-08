import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - Buscar seguidores e seguindo
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "followers" ou "following"
    const targetUserId = searchParams.get("userId") || user.id;

    if (type === "followers") {
      // Buscar quem segue o usuário
      const followers = await prisma.follow.findMany({
        where: { followingId: targetUserId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
              avatar: true,
              bio: true,
            },
          },
        },
      });

      return NextResponse.json({
        followers: followers.map((f) => f.follower),
      });
    } else if (type === "following") {
      // Buscar quem o usuário segue
      const following = await prisma.follow.findMany({
        where: { followerId: targetUserId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
              avatar: true,
              bio: true,
            },
          },
        },
      });

      return NextResponse.json({
        following: following.map((f) => f.following),
      });
    } else {
      // Retornar contagem de ambos
      const followersCount = await prisma.follow.count({
        where: { followingId: targetUserId },
      });

      const followingCount = await prisma.follow.count({
        where: { followerId: targetUserId },
      });

      return NextResponse.json({
        followersCount,
        followingCount,
      });
    }
  } catch (error) {
    console.error("Erro ao buscar follows:", error);
    return NextResponse.json(
      { error: "Erro ao buscar follows" },
      { status: 500 }
    );
  }
}

// POST - Seguir usuário
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
    const { userId: targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: "Você não pode seguir a si mesmo" },
        { status: 400 }
      );
    }

    // Verificar se já segue
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: "Você já segue este usuário" },
        { status: 400 }
      );
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: targetUserId,
      },
    });

    return NextResponse.json({ follow }, { status: 201 });
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);
    return NextResponse.json(
      { error: "Erro ao seguir usuário" },
      { status: 500 }
    );
  }
}

// DELETE - Deixar de seguir usuário
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
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (!follow) {
      return NextResponse.json(
        { error: "Você não segue este usuário" },
        { status: 404 }
      );
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({ message: "Deixou de seguir com sucesso" });
  } catch (error) {
    console.error("Erro ao deixar de seguir:", error);
    return NextResponse.json(
      { error: "Erro ao deixar de seguir" },
      { status: 500 }
    );
  }
}
