// Dados mockados de livros enquanto a API Key do Google Books não estiver configurada
export const MOCK_BOOKS = [
  {
    id: "1",
    volumeInfo: {
      title: "O Hobbit",
      authors: ["J.R.R. Tolkien"],
      description: "A fantástica aventura de Bilbo Bolseiro, um hobbit pacato que é arrastado para uma jornada épica.",
      imageLinks: {
        thumbnail: "https://books.google.com/books/publisher/content?id=hFfhrCWiLSMC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73S7ePpxXcxzXV1w1aW4mE4WheS7rXmxJYPvhm_vhwqQJw7h0Gj8A3LWLd3C3xqPTZ8vXYq8KZqP7F0xb6h9WxQj6Fh6Kx_aX2zZGp7pXxQpXx0",
      },
      categories: ["Fantasy", "Adventure", "Fiction"],
      pageCount: 310,
      publishedDate: "1937",
      averageRating: 4.7,
    },
  },
  {
    id: "2",
    volumeInfo: {
      title: "1984",
      authors: ["George Orwell"],
      description: "Um romance distópico que retrata uma sociedade totalitária do futuro.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Dystopia", "Fiction"],
      pageCount: 328,
      publishedDate: "1949",
      averageRating: 4.6,
    },
  },
  {
    id: "3",
    volumeInfo: {
      title: "O Senhor dos Anéis",
      authors: ["J.R.R. Tolkien"],
      description: "A épica jornada de Frodo para destruir o Um Anel na Terra Média.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Fantasy", "Adventure", "Fiction"],
      pageCount: 1178,
      publishedDate: "1954",
      averageRating: 4.8,
    },
  },
  {
    id: "4",
    volumeInfo: {
      title: "Harry Potter e a Pedra Filosofal",
      authors: ["J.K. Rowling"],
      description: "O início da mágica jornada de Harry Potter no mundo bruxo.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81ibfYk4qmL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Fantasy", "Adventure", "Fiction"],
      pageCount: 223,
      publishedDate: "1997",
      averageRating: 4.7,
    },
  },
  {
    id: "5",
    volumeInfo: {
      title: "O Pequeno Príncipe",
      authors: ["Antoine de Saint-Exupéry"],
      description: "Um conto filosófico e poético sobre um pequeno príncipe que viaja de planeta em planeta.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71OZY035FkL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Philosophy", "Classics", "Fiction"],
      pageCount: 96,
      publishedDate: "1943",
      averageRating: 4.9,
    },
  },
  {
    id: "6",
    volumeInfo: {
      title: "Dom Casmurro",
      authors: ["Machado de Assis"],
      description: "Clássico da literatura brasileira sobre ciúme e traição.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71nXPGovoTL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Romance", "Fiction"],
      pageCount: 256,
      publishedDate: "1899",
      averageRating: 4.3,
    },
  },
  {
    id: "7",
    volumeInfo: {
      title: "A Revolução dos Bichos",
      authors: ["George Orwell"],
      description: "Fábula política sobre animais que se rebelam contra seus donos.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91IqwW2NhwL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Fiction"],
      pageCount: 152,
      publishedDate: "1945",
      averageRating: 4.5,
    },
  },
  {
    id: "8",
    volumeInfo: {
      title: "Cem Anos de Solidão",
      authors: ["Gabriel García Márquez"],
      description: "A saga da família Buendía em Macondo.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91TvR1p3m2L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Fiction", "Classics", "Literature"],
      pageCount: 417,
      publishedDate: "1967",
      averageRating: 4.6,
    },
  },
  {
    id: "9",
    volumeInfo: {
      title: "Orgulho e Preconceito",
      authors: ["Jane Austen"],
      description: "Romance clássico sobre Elizabeth Bennet e Mr. Darcy.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Romance", "Classics", "Fiction"],
      pageCount: 432,
      publishedDate: "1813",
      averageRating: 4.7,
    },
  },
  {
    id: "10",
    volumeInfo: {
      title: "O Código Da Vinci",
      authors: ["Dan Brown"],
      description: "Thriller envolvendo mistérios religiosos e sociedades secretas.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91Q5dCjc2KL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Mystery", "Thriller", "Fiction"],
      pageCount: 454,
      publishedDate: "2003",
      averageRating: 4.4,
    },
  },
  {
    id: "11",
    volumeInfo: {
      title: "Drácula",
      authors: ["Bram Stoker"],
      description: "O clássico romance gótico sobre o vampiro Conde Drácula.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81UbCLFfpEL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Horror", "Thriller", "Classics"],
      pageCount: 418,
      publishedDate: "1897",
      averageRating: 4.5,
    },
  },
  {
    id: "12",
    volumeInfo: {
      title: "Steve Jobs",
      authors: ["Walter Isaacson"],
      description: "A biografia autorizada do fundador da Apple.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81VStYnDGrL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Biography", "History"],
      pageCount: 656,
      publishedDate: "2011",
      averageRating: 4.6,
    },
  },
  {
    id: "13",
    volumeInfo: {
      title: "Sapiens",
      authors: ["Yuval Noah Harari"],
      description: "Uma breve história da humanidade desde a Idade da Pedra até a era moderna.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71f5Yqd8ekL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["History", "Science", "Philosophy"],
      pageCount: 443,
      publishedDate: "2011",
      averageRating: 4.8,
    },
  },
  {
    id: "14",
    volumeInfo: {
      title: "O Poder do Hábito",
      authors: ["Charles Duhigg"],
      description: "Por que fazemos o que fazemos na vida e nos negócios.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Self-Help", "Psychology"],
      pageCount: 408,
      publishedDate: "2012",
      averageRating: 4.5,
    },
  },
  {
    id: "15",
    volumeInfo: {
      title: "O Iluminado",
      authors: ["Stephen King"],
      description: "Terror psicológico em um hotel isolado nas montanhas.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91AKx87HPNL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Horror", "Thriller", "Fiction"],
      pageCount: 447,
      publishedDate: "1977",
      averageRating: 4.6,
    },
  },
  {
    id: "16",
    volumeInfo: {
      title: "Fundação",
      authors: ["Isaac Asimov"],
      description: "A épica saga de ficção científica sobre o futuro da galáxia.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Adventure", "Fiction"],
      pageCount: 255,
      publishedDate: "1951",
      averageRating: 4.7,
    },
  },
  {
    id: "17",
    volumeInfo: {
      title: "O Hobbit: A Batalha dos Cinco Exércitos",
      authors: ["J.R.R. Tolkien"],
      description: "A conclusão épica da jornada de Bilbo Bolseiro.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81hbVkBlq+L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Fantasy", "Adventure", "Fiction"],
      pageCount: 310,
      publishedDate: "1937",
      averageRating: 4.7,
    },
  },
  {
    id: "18",
    volumeInfo: {
      title: "A Guerra dos Tronos",
      authors: ["George R.R. Martin"],
      description: "O primeiro livro da épica saga As Crônicas de Gelo e Fogo.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Fantasy", "Adventure", "Fiction"],
      pageCount: 694,
      publishedDate: "1996",
      averageRating: 4.8,
    },
  },
  {
    id: "19",
    volumeInfo: {
      title: "O Nome da Rosa",
      authors: ["Umberto Eco"],
      description: "Mistério medieval em uma abadia italiana.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91+NBq4bXmL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Mystery", "Historical Fiction", "Fiction"],
      pageCount: 536,
      publishedDate: "1980",
      averageRating: 4.5,
    },
  },
  {
    id: "20",
    volumeInfo: {
      title: "O Sol é Para Todos",
      authors: ["Harper Lee"],
      description: "Um clássico sobre justiça e preconceito no sul dos Estados Unidos.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Fiction"],
      pageCount: 324,
      publishedDate: "1960",
      averageRating: 4.8,
    },
  },
  {
    id: "21",
    volumeInfo: {
      title: "A Culpa é das Estrelas",
      authors: ["John Green"],
      description: "Romance emocionante sobre dois adolescentes com câncer.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71FcBhcls7L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Romance", "Fiction"],
      pageCount: 313,
      publishedDate: "2012",
      averageRating: 4.6,
    },
  },
  {
    id: "22",
    volumeInfo: {
      title: "Neuromancer",
      authors: ["William Gibson"],
      description: "O romance cyberpunk que definiu o gênero.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81L0vKM0P7L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Cyberpunk", "Fiction"],
      pageCount: 271,
      publishedDate: "1984",
      averageRating: 4.4,
    },
  },
  {
    id: "23",
    volumeInfo: {
      title: "A Menina que Roubava Livros",
      authors: ["Markus Zusak"],
      description: "História tocante sobre uma menina na Alemanha nazista.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81vRLpMEKNL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Historical Fiction", "Fiction"],
      pageCount: 552,
      publishedDate: "2005",
      averageRating: 4.7,
    },
  },
  {
    id: "24",
    volumeInfo: {
      title: "O Cortiço",
      authors: ["Aluísio Azevedo"],
      description: "Clássico naturalista brasileiro sobre um cortiço no Rio de Janeiro.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71RMuPZxq0L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Fiction"],
      pageCount: 232,
      publishedDate: "1890",
      averageRating: 4.2,
    },
  },
  {
    id: "25",
    volumeInfo: {
      title: "Os Miseráveis",
      authors: ["Victor Hugo"],
      description: "Épico romance sobre redenção na França do século XIX.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91HHxxtA1wL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Historical Fiction", "Fiction"],
      pageCount: 1463,
      publishedDate: "1862",
      averageRating: 4.8,
    },
  },
  {
    id: "26",
    volumeInfo: {
      title: "A Seleção",
      authors: ["Kiera Cass"],
      description: "Romance distópico sobre uma competição para casar com o príncipe.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81oj8rGJ2FL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Romance", "Young Adult", "Fiction"],
      pageCount: 327,
      publishedDate: "2012",
      averageRating: 4.3,
    },
  },
  {
    id: "27",
    volumeInfo: {
      title: "It: A Coisa",
      authors: ["Stephen King"],
      description: "Terror sobre uma criatura que aterroriza uma cidade.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71tFhdGVRjL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Horror", "Thriller", "Fiction"],
      pageCount: 1138,
      publishedDate: "1986",
      averageRating: 4.7,
    },
  },
  {
    id: "28",
    volumeInfo: {
      title: "O Silêncio dos Inocentes",
      authors: ["Thomas Harris"],
      description: "Thriller psicológico sobre Hannibal Lecter.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81W9678cOiL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Thriller", "Mystery", "Fiction"],
      pageCount: 338,
      publishedDate: "1988",
      averageRating: 4.6,
    },
  },
  {
    id: "29",
    volumeInfo: {
      title: "Duna",
      authors: ["Frank Herbert"],
      description: "Épico de ficção científica sobre política, religião e ecologia.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81ym2j1A75L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Adventure", "Fiction"],
      pageCount: 688,
      publishedDate: "1965",
      averageRating: 4.7,
    },
  },
  {
    id: "30",
    volumeInfo: {
      title: "O Hobbit: Uma Jornada Inesperada",
      authors: ["J.R.R. Tolkien"],
      description: "A jornada de Bilbo começa quando Gandalf aparece à sua porta.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71V5FjLKfPL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Fantasy", "Adventure", "Fiction"],
      pageCount: 310,
      publishedDate: "1937",
      averageRating: 4.7,
    },
  },
  {
    id: "31",
    volumeInfo: {
      title: "Percy Jackson e o Ladrão de Raios",
      authors: ["Rick Riordan"],
      description: "Aventura moderna sobre deuses gregos e um jovem semideus.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/91WN6a6F3mL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Fantasy", "Adventure", "Young Adult"],
      pageCount: 377,
      publishedDate: "2005",
      averageRating: 4.5,
    },
  },
  {
    id: "32",
    volumeInfo: {
      title: "Mindset: A Nova Psicologia do Sucesso",
      authors: ["Carol S. Dweck"],
      description: "Como a mentalidade de crescimento pode mudar sua vida.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71KvjXj5bBL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Self-Help", "Psychology"],
      pageCount: 312,
      publishedDate: "2006",
      averageRating: 4.6,
    },
  },
  {
    id: "33",
    volumeInfo: {
      title: "Como Fazer Amigos e Influenciar Pessoas",
      authors: ["Dale Carnegie"],
      description: "Clássico sobre relacionamentos interpessoais e influência.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71vK0WVQ4rL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Self-Help", "Business"],
      pageCount: 288,
      publishedDate: "1936",
      averageRating: 4.7,
    },
  },
  {
    id: "34",
    volumeInfo: {
      title: "Einstein: Sua Vida, Seu Universo",
      authors: ["Walter Isaacson"],
      description: "Biografia completa do gênio da física.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81MtP29IpIL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Biography", "Science", "History"],
      pageCount: 704,
      publishedDate: "2007",
      averageRating: 4.7,
    },
  },
  {
    id: "35",
    volumeInfo: {
      title: "Memórias Póstumas de Brás Cubas",
      authors: ["Machado de Assis"],
      description: "Romance narrado por um defunto autor.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71iGR2kNPqL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Fiction"],
      pageCount: 368,
      publishedDate: "1881",
      averageRating: 4.4,
    },
  },
  {
    id: "36",
    volumeInfo: {
      title: "A República",
      authors: ["Platão"],
      description: "Diálogo socrático sobre justiça e o estado ideal.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71bZuUm4-eL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Philosophy", "Classics"],
      pageCount: 416,
      publishedDate: "-380",
      averageRating: 4.5,
    },
  },
  {
    id: "37",
    volumeInfo: {
      title: "Assim Falou Zaratustra",
      authors: ["Friedrich Nietzsche"],
      description: "Obra filosófica sobre o super-homem e a morte de Deus.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71bLBlcmGfL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Philosophy", "Fiction"],
      pageCount: 352,
      publishedDate: "1883",
      averageRating: 4.6,
    },
  },
  {
    id: "38",
    volumeInfo: {
      title: "O Médico e o Monstro",
      authors: ["Robert Louis Stevenson"],
      description: "Clássico sobre a dualidade da natureza humana.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71QK5F4q3QL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Horror", "Classics", "Fiction"],
      pageCount: 144,
      publishedDate: "1886",
      averageRating: 4.4,
    },
  },
  {
    id: "39",
    volumeInfo: {
      title: "O Conde de Monte Cristo",
      authors: ["Alexandre Dumas"],
      description: "Romance de aventura sobre vingança e redenção.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81af+MCATTL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Adventure", "Classics", "Fiction"],
      pageCount: 1276,
      publishedDate: "1844",
      averageRating: 4.8,
    },
  },
  {
    id: "40",
    volumeInfo: {
      title: "O Apanhador no Campo de Centeio",
      authors: ["J.D. Salinger"],
      description: "Romance sobre adolescência e alienação.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81OthjkJBuL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Fiction"],
      pageCount: 234,
      publishedDate: "1951",
      averageRating: 4.3,
    },
  },
  {
    id: "41",
    volumeInfo: {
      title: "O Exorcista",
      authors: ["William Peter Blatty"],
      description: "Terror sobre possessão demoníaca.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81cWvKpHJzL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Horror", "Thriller", "Fiction"],
      pageCount: 385,
      publishedDate: "1971",
      averageRating: 4.5,
    },
  },
  {
    id: "42",
    volumeInfo: {
      title: "Jogos Vorazes",
      authors: ["Suzanne Collins"],
      description: "Distopia sobre sobrevivência em um reality show mortal.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71WSzFcVWcL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Young Adult", "Adventure"],
      pageCount: 374,
      publishedDate: "2008",
      averageRating: 4.6,
    },
  },
  {
    id: "43",
    volumeInfo: {
      title: "O Alienista",
      authors: ["Machado de Assis"],
      description: "Conto sobre loucura e razão em uma pequena cidade.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71-iVJWlWHL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Fiction"],
      pageCount: 96,
      publishedDate: "1882",
      averageRating: 4.5,
    },
  },
  {
    id: "44",
    volumeInfo: {
      title: "Crime e Castigo",
      authors: ["Fiódor Dostoiévski"],
      description: "Romance psicológico sobre culpa e redenção.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71O2XIytdqL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Fiction", "Philosophy"],
      pageCount: 671,
      publishedDate: "1866",
      averageRating: 4.7,
    },
  },
  {
    id: "45",
    volumeInfo: {
      title: "O Grande Gatsby",
      authors: ["F. Scott Fitzgerald"],
      description: "Romance sobre o sonho americano nos anos 1920.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81Q6WkLhX4L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Classics", "Romance", "Fiction"],
      pageCount: 180,
      publishedDate: "1925",
      averageRating: 4.5,
    },
  },
  {
    id: "46",
    volumeInfo: {
      title: "A Origem das Espécies",
      authors: ["Charles Darwin"],
      description: "Obra revolucionária sobre evolução e seleção natural.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71rtZu4F1TL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science", "History", "Biology"],
      pageCount: 502,
      publishedDate: "1859",
      averageRating: 4.6,
    },
  },
  {
    id: "47",
    volumeInfo: {
      title: "A Arte da Guerra",
      authors: ["Sun Tzu"],
      description: "Tratado militar sobre estratégia e táticas.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71xeV7eUSmL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Philosophy", "History", "Military"],
      pageCount: 273,
      publishedDate: "-500",
      averageRating: 4.5,
    },
  },
  {
    id: "48",
    volumeInfo: {
      title: "O Homem Invisível",
      authors: ["H.G. Wells"],
      description: "Ficção científica sobre um cientista que se torna invisível.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/71bMhBU3toL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Classics", "Fiction"],
      pageCount: 208,
      publishedDate: "1897",
      averageRating: 4.3,
    },
  },
  {
    id: "49",
    volumeInfo: {
      title: "Fahrenheit 451",
      authors: ["Ray Bradbury"],
      description: "Distopia sobre censura e queima de livros.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81EY0hHxP9L._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Dystopia", "Fiction"],
      pageCount: 249,
      publishedDate: "1953",
      averageRating: 4.6,
    },
  },
  {
    id: "50",
    volumeInfo: {
      title: "Admirável Mundo Novo",
      authors: ["Aldous Huxley"],
      description: "Distopia sobre uma sociedade controlada pela tecnologia.",
      imageLinks: {
        thumbnail: "https://m.media-amazon.com/images/I/81p41GtkyKL._AC_UF1000,1000_QL80_.jpg",
      },
      categories: ["Science Fiction", "Dystopia", "Fiction"],
      pageCount: 311,
      publishedDate: "1932",
      averageRating: 4.5,
    },
  },
];
