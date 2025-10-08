import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar senha
    if (password.length < 8) {
      return NextResponse.json(
        { message: "A senha deve ter no mínimo 8 caracteres" },
        { status: 400 }
      );
    }

    // Buscar usuário pelo token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token inválido" },
        { status: 400 }
      );
    }

    // Verificar se o token expirou
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { message: "Token expirado. Solicite um novo link de redefinição." },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const hashedPassword = await hash(password, 12);

    // Atualizar senha e limpar tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        loginAttempts: 0, // Reset login attempts
        lockedUntil: null, // Unlock account if locked
      },
    });

    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "password_reset",
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(
      { message: "Senha redefinida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}
