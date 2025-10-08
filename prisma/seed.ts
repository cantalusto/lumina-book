import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados de exemplo de livros com vibes variadas
const booksData = [
  {
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    description: "A história de Kvothe, um jovem prodígio que se torna lenda, contada por ele mesmo em uma taverna perdida.",
    isbn: "9788580416107",
    vibeTags: ["atmospheric", "mysterious", "thought-provoking"],
    mood: ["reflective", "tense", "melancholic"],
    atmosphere: ["winter-night", "mountain-cabin", "rainy-day"],
    pace: "medium",
    intensity: 4,
    genres: ["Fantasia", "Aventura"],
    pages: 656,
    publishedYear: 2007,
  },
  {
    title: "A Menina que Roubava Livros",
    author: "Markus Zusak",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    description: "Uma história emocionante sobre amor, perda e o poder das palavras durante a Segunda Guerra Mundial.",
    vibeTags: ["emotional", "uplifting", "thought-provoking"],
    mood: ["melancholic", "hopeful", "reflective"],
    atmosphere: ["winter-night", "cozy-cafe"],
    pace: "medium",
    intensity: 5,
    genres: ["Drama", "Histórico"],
    pages: 480,
    publishedYear: 2005,
  },
  {
    title: "O Oceano no Fim do Caminho",
    author: "Neil Gaiman",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
    description: "Uma fábula sombria sobre memória, magia e os perigos que espreitam nas fronteiras da realidade.",
    vibeTags: ["mysterious", "dark", "atmospheric"],
    mood: ["tense", "anxious", "reflective"],
    atmosphere: ["countryside", "autumn-forest", "rainy-day"],
    pace: "medium",
    intensity: 4,
    genres: ["Fantasia", "Terror"],
    pages: 256,
    publishedYear: 2013,
  },
  {
    title: "Normal People",
    author: "Sally Rooney",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    description: "A complexa relação entre Marianne e Connell ao longo dos anos, explorando amor, classe e identidade.",
    vibeTags: ["emotional", "romantic", "thought-provoking"],
    mood: ["melancholic", "hopeful", "reflective"],
    atmosphere: ["city-night", "cozy-cafe"],
    pace: "slow",
    intensity: 3,
    genres: ["Romance", "Drama"],
    pages: 266,
    publishedYear: 2018,
  },
  {
    title: "Onde os Fracos Não Têm Vez",
    author: "Cormac McCarthy",
    cover: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400",
    description: "Um thriller brutal ambientado no Texas, explorando violência, destino e moralidade.",
    vibeTags: ["dark", "fast-paced", "tense"],
    mood: ["tense", "anxious"],
    atmosphere: ["countryside", "city-night"],
    pace: "fast",
    intensity: 5,
    genres: ["Thriller", "Crime"],
    pages: 320,
    publishedYear: 2005,
  },
  {
    title: "A Vida Invisível de Addie LaRue",
    author: "V.E. Schwab",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    description: "Uma mulher faz um pacto para viver para sempre, mas é esquecida por todos que conhece.",
    vibeTags: ["atmospheric", "romantic", "thought-provoking"],
    mood: ["melancholic", "hopeful", "reflective"],
    atmosphere: ["city-night", "autumn-forest", "cozy-cafe"],
    pace: "slow",
    intensity: 3,
    genres: ["Fantasia", "Romance"],
    pages: 448,
    publishedYear: 2020,
  },
  {
    title: "Projeto Hail Mary",
    author: "Andy Weir",
    cover: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
    description: "Um astronauta acorda sozinho numa missão espacial sem lembrar como chegou lá.",
    vibeTags: ["fast-paced", "adventurous", "uplifting"],
    mood: ["excited", "hopeful", "tense"],
    atmosphere: ["city-night"],
    pace: "fast",
    intensity: 4,
    genres: ["Ficção Científica", "Aventura"],
    pages: 476,
    publishedYear: 2021,
  },
  {
    title: "Circe",
    author: "Madeline Miller",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    description: "A história da feiticeira Circe, reimaginando a mitologia grega com uma perspectiva feminina poderosa.",
    vibeTags: ["atmospheric", "emotional", "thought-provoking"],
    mood: ["reflective", "hopeful", "melancholic"],
    atmosphere: ["summer-beach", "autumn-forest"],
    pace: "medium",
    intensity: 3,
    genres: ["Fantasia", "Mitologia"],
    pages: 393,
    publishedYear: 2018,
  },
  {
    title: "Piranesi",
    author: "Susanna Clarke",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    description: "Um homem vive em uma casa impossível com salas infinitas preenchidas pelo mar.",
    vibeTags: ["mysterious", "atmospheric", "thought-provoking"],
    mood: ["peaceful", "reflective", "melancholic"],
    atmosphere: ["winter-night", "mountain-cabin"],
    pace: "slow",
    intensity: 2,
    genres: ["Fantasia", "Mistério"],
    pages: 245,
    publishedYear: 2020,
  },
  {
    title: "A Guerra que Salvou Minha Vida",
    author: "Kimberly Brubaker Bradley",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
    description: "Uma menina com deficiência física encontra liberdade durante a Segunda Guerra Mundial.",
    vibeTags: ["uplifting", "emotional", "cozy"],
    mood: ["hopeful", "joyful", "melancholic"],
    atmosphere: ["countryside", "cozy-cafe"],
    pace: "medium",
    intensity: 3,
    genres: ["Drama", "Histórico", "Infantojuvenil"],
    pages: 316,
    publishedYear: 2015,
  },
];

// Conquistas
const achievementsData = [
  {
    name: "Explorador Iniciante",
    description: "Leia seu primeiro livro",
    icon: "🌱",
    category: "exploration",
    requirement: 1,
  },
  {
    name: "Leitor Voraz",
    description: "Complete 10 livros",
    icon: "📚",
    category: "consistency",
    requirement: 10,
  },
  {
    name: "Viajante de Gêneros",
    description: "Leia livros de 5 gêneros diferentes",
    icon: "🎭",
    category: "diversity",
    requirement: 5,
  },
  {
    name: "Membro Ativo",
    description: "Participe de 3 clubes de leitura",
    icon: "👥",
    category: "social",
    requirement: 3,
  },
  {
    name: "Crítico Literário",
    description: "Escreva 20 resenhas",
    icon: "✍️",
    category: "consistency",
    requirement: 20,
  },
  {
    name: "Descobridor de Vibes",
    description: "Explore todas as categorias de atmosfera",
    icon: "🌟",
    category: "exploration",
    requirement: 8,
  },
  {
    name: "Maratonista",
    description: "Complete 50 livros",
    icon: "🏃",
    category: "consistency",
    requirement: 50,
  },
  {
    name: "Social Butterfly",
    description: "Conecte-se com 25 leitores",
    icon: "🦋",
    category: "social",
    requirement: 25,
  },
];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.bookCollectionItem.deleteMany();
  await prisma.bookCollection.deleteMany();
  await prisma.readingHistory.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.clubBook.deleteMany();
  await prisma.clubMember.deleteMany();
  await prisma.club.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.book.deleteMany();
  await prisma.readingProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('📚 Criando livros...');
  const books = await Promise.all(
    booksData.map((book) =>
      prisma.book.create({
        data: book,
      })
    )
  );
  console.log(`✅ ${books.length} livros criados!`);

  console.log('🏆 Criando conquistas...');
  const achievements = await Promise.all(
    achievementsData.map((achievement) =>
      prisma.achievement.create({
        data: achievement,
      })
    )
  );
  console.log(`✅ ${achievements.length} conquistas criadas!`);

  console.log('👤 Criando usuário de exemplo...');
  const user = await prisma.user.create({
    data: {
      name: 'Leitor Demo',
      email: 'demo@lumina.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    },
  });

  console.log('📊 Criando perfil de leitura...');
  await prisma.readingProfile.create({
    data: {
      userId: user.id,
      favoriteGenres: ['Fantasia', 'Ficção Científica', 'Drama'],
      readingPace: 'medium',
      preferredLength: 'medium',
      moodTags: ['reflective', 'hopeful', 'excited'],
      vibePreferences: {
        atmospheric: 8,
        plotDriven: 7,
        characterDriven: 9,
        philosophical: 6,
        actionPacked: 5,
      },
      lifeMoment: 'explorando novos horizontes',
    },
  });

  console.log('📖 Criando histórico de leitura...');
  await prisma.readingHistory.create({
    data: {
      userId: user.id,
      bookId: books[0].id,
      status: 'reading',
      progress: 45,
      startedAt: new Date(),
    },
  });

  console.log('👥 Criando clube de exemplo...');
  const club = await prisma.club.create({
    data: {
      name: 'Amantes de Fantasia',
      description: 'Um clube para discutir os melhores livros de fantasia épica e urbana.',
      vibe: 'atmospheric',
      isPublic: true,
      currentBookId: books[0].id,
    },
  });

  await prisma.clubMember.create({
    data: {
      userId: user.id,
      clubId: club.id,
      role: 'founder',
      progress: 45,
    },
  });

  console.log('✨ Seed completo!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
