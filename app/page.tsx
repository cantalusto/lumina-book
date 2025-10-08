import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Users, Trophy, Heart } from "lucide-react";

// Lista de ISBNs de livros populares para buscar capas reais da Open Library
const FEATURED_BOOKS = [
  { isbn: "0756404746", title: "O Nome do Vento", author: "Patrick Rothfuss" },
  { isbn: "0375842209", title: "A Menina que Roubava Livros", author: "Markus Zusak" },
  { isbn: "0062255657", title: "O Oceano no Fim do Caminho", author: "Neil Gaiman" },
  { isbn: "0451524934", title: "1984", author: "George Orwell" },
  { isbn: "0547928227", title: "O Hobbit", author: "J.R.R. Tolkien" },
  { isbn: "0060883286", title: "Cem Anos de Solidão", author: "Gabriel García Márquez" },
];

async function getFeaturedBooks() {
  try {
    const booksWithCovers = await Promise.all(
      FEATURED_BOOKS.map(async (book) => {
        try {
          // Open Library Cover API - totalmente gratuita, sem auth
          const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
          
          // Verifica se a capa existe
          const response = await fetch(coverUrl, { method: 'HEAD' });
          
          if (response.ok) {
            return {
              img: coverUrl,
              title: book.title,
              author: book.author,
            };
          }
          
          // Fallback para imagem genérica se não encontrar
          return null;
        } catch (error) {
          return null;
        }
      })
    );

    return booksWithCovers.filter((book): book is NonNullable<typeof book> => book !== null);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();
  
  // Fallback para imagens caso a API falhe
  const fallbackBooks = [
    {
      img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      title: "O Nome do Vento",
      author: "Patrick Rothfuss"
    },
    {
      img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      title: "A Menina que Roubava Livros",
      author: "Markus Zusak"
    },
    {
      img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      title: "O Oceano no Fim do Caminho",
      author: "Neil Gaiman"
    },
    {
      img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      title: "A Sombra do Vento",
      author: "Carlos Ruiz Zafón"
    },
    {
      img: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
      title: "Norwegian Wood",
      author: "Haruki Murakami"
    },
    {
      img: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=600&fit=crop",
      title: "O Hobbit",
      author: "J.R.R. Tolkien"
    },
  ];
  
  // Usa livros da API ou fallback
  const displayBooks = featuredBooks.length > 0 ? featuredBooks : fallbackBooks;
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-gradient">Lúmina</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/auth/signin" className="text-sm font-medium hover:text-primary transition-colors">
              Entrar
            </Link>
            <Button variant="glow" asChild>
              <Link href="/auth/signup">Criar Conta</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-8 pt-20 pb-32 text-center">
        <div className="flex flex-col gap-4 animate-float">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Descubra seu próximo
            <br />
            <span className="text-gradient">livro perfeito</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma inteligente que combina IA, comunidade e vibes para
            conectar você aos livros que vão iluminar sua jornada literária.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="glow" asChild>
            <Link href="/auth/signup">
              <Sparkles className="mr-2 h-5 w-5" />
              Começar Gratuitamente
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Explorar Recursos</Link>
          </Button>
        </div>

        {/* Hero Image/Animation - Book Gallery */}
        <div className="relative mt-12 w-full max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-3xl animate-glow" />
          <div className="relative bg-muted/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-border/50">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {displayBooks.map((book, i) => (
                <div
                  key={i}
                  className="group aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 relative"
                  style={{ 
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="text-xs font-semibold line-clamp-2">{book.title}</p>
                      {book.author && (
                        <p className="text-[10px] text-white/80 mt-1">{book.author}</p>
                      )}
                    </div>
                  </div>
                  {/* Efeito de brilho */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
            
            {/* Texto decorativo */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ✨ Descubra entre <span className="text-primary font-semibold">milhares</span> de livros
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Recursos que <span className="text-gradient">iluminam</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra como Lúmina transforma sua experiência de leitura
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-primary" />}
            title="Descoberta por Vibes"
            description="Encontre livros baseados em atmosfera, humor e momento de vida"
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-secondary" />}
            title="Perfil 3D de Leitor"
            description="Recomendações personalizadas que evoluem com você"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-accent" />}
            title="Clubes Dinâmicos"
            description="Conecte-se com leitores que compartilham seus interesses"
          />
          <FeatureCard
            icon={<Trophy className="h-8 w-8 text-primary" />}
            title="Gamificação"
            description="Conquistas, rotas de leitura e desafios colaborativos"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-24 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <StepCard
            number="1"
            title="Configure seu Perfil"
            description="Responda algumas perguntas sobre seus gostos e preferências literárias"
          />
          <StepCard
            number="2"
            title="Descubra & Swipe"
            description="Explore livros com nossa interface intuitiva de swipe por vibes"
          />
          <StepCard
            number="3"
            title="Conecte & Leia"
            description="Junte-se a clubes, acompanhe seu progresso e desfrute da leitura"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <Heart className="h-16 w-16 mx-auto text-primary animate-pulse" />
          <h2 className="text-4xl font-bold">
            Pronto para <span className="text-gradient">iluminar</span> sua jornada literária?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a milhares de leitores descobrindo livros incríveis todos os dias
          </p>
          <Button size="lg" variant="glow" asChild>
            <Link href="/auth/signup">
              <Sparkles className="mr-2 h-5 w-5" />
              Começar Agora
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-gradient">Lúmina</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Lúmina. Iluminando sua jornada literária.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all hover:scale-105">
      <div className="p-3 rounded-full bg-primary/10">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
        {number}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
