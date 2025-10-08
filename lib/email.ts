import nodemailer from "nodemailer";

// Configurar transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@lumina.com",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback: remove HTML tags
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Lúmina</h1>
            <p>Redefinição de Senha</p>
          </div>
          <div class="content">
            <h2>Olá!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta Lúmina.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <center>
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </center>
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link expira em <strong>1 hora</strong></li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 Lúmina - Iluminando sua jornada literária</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "🔐 Redefinição de Senha - Lúmina",
    html,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .welcome { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Bem-vindo ao Lúmina!</h1>
            <p>Confirme seu email</p>
          </div>
          <div class="content">
            <h2>Olá!</h2>
            <div class="welcome">
              <strong>🎉 Parabéns!</strong>
              <p>Sua conta foi criada com sucesso. Agora precisamos confirmar seu endereço de email.</p>
            </div>
            <p>Clique no botão abaixo para verificar seu email e começar sua jornada literária:</p>
            <center>
              <a href="${verifyUrl}" class="button">Verificar Email</a>
            </center>
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px;">${verifyUrl}</p>
            <p style="margin-top: 30px;">
              <strong>O que você pode fazer no Lúmina:</strong>
            </p>
            <ul>
              <li>📚 Descobrir livros por vibes e mood</li>
              <li>❤️ Sistema de swipe inteligente</li>
              <li>👥 Clubes de leitura com chat</li>
              <li>🏆 Gamificação e conquistas</li>
              <li>📊 Acompanhamento de progresso</li>
            </ul>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 Lúmina - Iluminando sua jornada literária</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "✨ Verifique seu email - Lúmina",
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .feature { display: flex; align-items: center; margin: 15px 0; }
          .feature-icon { font-size: 24px; margin-right: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Bem-vindo ao Lúmina, ${name}!</h1>
            <p>Sua jornada literária começa agora</p>
          </div>
          <div class="content">
            <h2>Olá, ${name}! 👋</h2>
            <p>Estamos muito felizes em ter você conosco! O Lúmina é mais do que uma plataforma de livros - é uma comunidade de leitores apaixonados descobrindo histórias incríveis juntos.</p>
            
            <h3>🚀 Próximos Passos:</h3>
            <ol>
              <li><strong>Complete seu perfil de leitura</strong> - Nos conte sobre seus gostos</li>
              <li><strong>Descubra seus primeiros livros</strong> - Use nosso sistema de swipe</li>
              <li><strong>Junte-se a um clube</strong> - Conecte-se com outros leitores</li>
              <li><strong>Desbloqueie conquistas</strong> - Acompanhe seu progresso</li>
            </ol>

            <center>
              <a href="${process.env.NEXTAUTH_URL}/onboarding" class="button">Começar Agora</a>
            </center>

            <h3>💡 Dicas para aproveitar ao máximo:</h3>
            <ul>
              <li>📱 Adicione o Lúmina à sua tela inicial</li>
              <li>🔔 Ative notificações para não perder novidades</li>
              <li>🎯 Seja honesto nas suas preferências - quanto mais preciso, melhores as recomendações</li>
              <li>💬 Participe das discussões nos clubes</li>
            </ul>

            <p>Se tiver qualquer dúvida, estamos aqui para ajudar!</p>
          </div>
          <div class="footer">
            <p>Boa leitura! 📚✨</p>
            <p>© 2025 Lúmina - Iluminando sua jornada literária</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "✨ Bem-vindo ao Lúmina!",
    html,
  });
}
