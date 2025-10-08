import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/profile
 * Obter perfil de leitura do usuário
 */
export async function GET() {
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
      include: { readingProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: user.readingProfile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile
 * Criar ou atualizar perfil de leitura
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
    const {
      favoriteGenres,
      readingPace,
      preferredLength,
      moodTags,
      vibePreferences,
      lifeMoment,
    } = body;

    // Validações
    if (!favoriteGenres || !Array.isArray(favoriteGenres) || favoriteGenres.length === 0) {
      return NextResponse.json(
        { error: "Selecione pelo menos um gênero favorito" },
        { status: 400 }
      );
    }

    // Verificar se já existe um perfil
    const existingProfile = await prisma.readingProfile.findUnique({
      where: { userId: user.id },
    });

    let profile;

    if (existingProfile) {
      // Atualizar perfil existente
      profile = await prisma.readingProfile.update({
        where: { userId: user.id },
        data: {
          favoriteGenres,
          readingPace: readingPace || "medium",
          preferredLength: preferredLength || "medium",
          moodTags: moodTags || [],
          vibePreferences: vibePreferences || {},
          lifeMoment: lifeMoment || null,
        },
      });
    } else {
      // Criar novo perfil
      profile = await prisma.readingProfile.create({
        data: {
          userId: user.id,
          favoriteGenres,
          readingPace: readingPace || "medium",
          preferredLength: preferredLength || "medium",
          moodTags: moodTags || [],
          vibePreferences: vibePreferences || {},
          lifeMoment: lifeMoment || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: existingProfile ? "Perfil atualizado com sucesso" : "Perfil criado com sucesso",
      profile,
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Erro ao salvar perfil" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Atualizar dados do usuário (nome, bio, avatar)
 */
export async function PATCH(request: Request) {
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
      include: { readingProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, bio, avatar } = body;

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        bio: bio !== undefined ? bio : user.bio,
        avatar: avatar !== undefined ? avatar : user.avatar,
      },
      include: { readingProfile: true },
    });

    return NextResponse.json({
      success: true,
      message: "Perfil atualizado com sucesso",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        image: updatedUser.image,
        readingProfile: updatedUser.readingProfile,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
