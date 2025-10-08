# 📱 Guia Visual das Páginas - Lúmina

## Estrutura de Navegação

```
┌─────────────────────────────────────────────┐
│  🌟 Lúmina          [Descobrir] [Biblioteca] │ ← Header Desktop
│                     [Clubes]   [Perfil]      │
└─────────────────────────────────────────────┘
│                                               │
│              CONTEÚDO PRINCIPAL               │
│                                               │
│                                               │
└─────────────────────────────────────────────┘
│  🧭    📚    👥    👤                        │ ← Nav Mobile (Bottom)
│ Descobrir Biblioteca Clubes Perfil           │
└─────────────────────────────────────────────┘
```

---

## 🏠 Landing Page (`/`)

### Visual:
```
╔═══════════════════════════════════╗
║  🌟 Lúmina    [Entrar] [Começar] ║
╠═══════════════════════════════════╣
║                                    ║
║    Descubra seu próximo           ║
║    [livro perfeito]  ← gradient    ║
║                                    ║
║    Uma plataforma inteligente...  ║
║                                    ║
║  [✨ Começar] [Explorar Recursos] ║
║                                    ║
║  ╔══╗ ╔══╗ ╔══╗                   ║
║  ║📚║ ║📖║ ║📕║ ← Grid de capas   ║
║  ╚══╝ ╚══╝ ╚══╝    animadas       ║
║                                    ║
╠═══════════════════════════════════╣
║   FEATURES (4 cards)               ║
║  [🔍 Descoberta] [👤 Perfil 3D]   ║
║  [👥 Clubes]     [🏆 Gamificação] ║
╚═══════════════════════════════════╝
```

### Elementos:
- ✅ Hero section com gradiente no título
- ✅ 6 cards de livros com animação pulse
- ✅ 4 feature cards com ícones
- ✅ Footer simples

---

## 🎯 Onboarding (`/onboarding`)

### Fluxo:
```
Step 1/4: GÊNEROS              Step 2/4: MOODS
┌──────────────────┐          ┌──────────────────┐
│ Selecione 3+:    │          │ Selecione 2+:    │
│                  │          │                  │
│ [x] Fantasia     │          │ [x] 🤔 Reflexivo │
│ [x] Ficção Sci   │          │ [x] ✨ Esperança │
│ [ ] Romance      │          │ [ ] 🚀 Animado   │
│ [x] Mistério     │          │ [ ] 🌧️ Melancóli│
│                  │          │                  │
│ [Voltar] [Próx]→ │          │ [←Voltar] [Próx]→│
└──────────────────┘          └──────────────────┘

Step 3/4: VIBES               Step 4/4: PREFERÊNCIAS
┌──────────────────┐          ┌──────────────────┐
│ Selecione 2+:    │          │ Ritmo de leitura:│
│                  │          │ ○ Devagar        │
│ [x] 🏠 Aconcheg  │          │ ● Moderado       │
│ [x] 🌫️ Atmosféri│          │ ○ Rápido         │
│ [ ] 💭 Provocant │          │                  │
│ [ ] ⚡ Acelerado │          │ Tamanho:         │
│                  │          │ ○ Curto (<200)   │
│ [←Voltar] [Próx]→│          │ ● Médio (200-400)│
└──────────────────┘          │ [←Voltar][Concl]│
                               └──────────────────┘
```

### Características:
- ✅ Progress bar no topo (1/4, 2/4, 3/4, 4/4)
- ✅ Mínimo de seleções validado
- ✅ Botões Voltar/Próximo
- ✅ Emojis nos moods e vibes
- ✅ Radio buttons nas preferências

---

## 🧭 Descobrir (`/discover`)

### Layout:
```
╔═══════════════════════════════════════╗
║ 🌟 Lúmina  [Descobrir] [Biblioteca]   ║
║            [Clubes]    [Perfil]       ║
╠═══════════════════════════════════════╣
║                                        ║
║  ✨ Descobrir                          ║
║  Deslize para a direita nos livros... ║
║                                        ║
║       ┌────────────────┐               ║
║       │ ┌────────────┐ │               ║
║       │ │   CAPA     │ │               ║
║       │ │   LIVRO    │ │               ║
║       │ └────────────┘ │               ║
║       │                │               ║
║       │ O Nome do Vento│               ║
║       │ Patrick Rothfu │               ║
║       │                │               ║
║       │ "A história... │               ║
║       │                │               ║
║       │ [atmospheric]  │               ║
║       │ [mysterious]   │               ║
║       │                │               ║
║       │ 656 pág • Mod  │               ║
║       └────────────────┘               ║
║                                        ║
║       (X)   (★)   (❤️)                 ║
║     Dislike  Super  Like               ║
║                                        ║
║            2 / 10                      ║
║                                        ║
╠═══════════════════════════════════════╣
║  🧭   📚   👥   👤                     ║
║ Descob Bibli Clubes Perfil            ║
╚═══════════════════════════════════════╝
```

### Elementos:
- ✅ Card de livro centralizado com capa
- ✅ Título + autor sobre a capa
- ✅ Descrição
- ✅ Tags de vibes
- ✅ Info (páginas + pace)
- ✅ 3 botões: X (dislike), ⭐ (super like), ❤️ (like)
- ✅ Contador (atual / total)
- ✅ Navegação mobile na base

---

## 👤 Perfil (`/profile`)

### Layout:
```
╔═══════════════════════════════════════╗
║ 🌟 Lúmina  [Descobrir] [Biblioteca]   ║
║            [Clubes]    [Perfil]       ║
╠═══════════════════════════════════════╣
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │  👤        Leitor Demo           │ ║
║  │ Avatar   demo@lumina.com         │ ║
║  │          [Editar Perfil]         │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║  ┌────┐ ┌────┐ ┌────┐ ┌────┐         ║
║  │📚  │ │📈  │ │👥  │ │🏆  │         ║
║  │ 12 │ │ 3  │ │ 2  │ │ 5  │         ║
║  │Lidos│ │Lendo│ │Club│ │Conq│         ║
║  └────┘ └────┘ └────┘ └────┘         ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ Perfil de Leitura                │ ║
║  │                                   │ ║
║  │ Gêneros Favoritos:                │ ║
║  │ [Fantasia] [Ficção] [Drama]       │ ║
║  │                                   │ ║
║  │ Vibes Preferidas:                 │ ║
║  │ [Atmosférico] [Reflexivo]         │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ Conquistas Recentes              │ ║
║  │                                   │ ║
║  │ 🌱 Explorador Iniciante ✅       │ ║
║  │ 📚 Leitor Voraz ✅               │ ║
║  │ 🎭 Viajante de Gêneros 🔒        │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
╠═══════════════════════════════════════╣
║  🧭   📚   👥   👤                     ║
║ Descob Bibli Clubes Perfil            ║
╚═══════════════════════════════════════╝
```

### Elementos:
- ✅ Card de perfil com avatar grande
- ✅ 4 stat cards em grid
- ✅ Card de perfil de leitura com tags
- ✅ Card de conquistas com emoji + status
- ✅ Navegação mobile na base

---

## 🎨 Sistema de Cores

```css
Primary:   #6366f1 (Índigo)  → Botões, links ativos
Secondary: #8b5cf6 (Violeta) → Badges secundários  
Accent:    #06b6d4 (Ciano)   → Destaques especiais
Background: #0f172a (Dark)   → Fundo geral
Muted:     #475569 (Gray)    → Texto secundário
```

### Gradiente de Texto:
```css
.text-gradient {
  background: linear-gradient(to right, primary, secondary, accent);
  -webkit-background-clip: text;
  color: transparent;
}
```

---

## 📐 Breakpoints

```
Mobile:   < 768px  → Navegação bottom, stack vertical
Tablet:   768px+   → 2 colunas, nav top
Desktop:  1024px+  → 4 colunas, layout completo
```

---

## ✨ Animações

### Framer Motion (BookSwiper):
```tsx
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ x: direction === "left" ? -300 : 300 }}
/>
```

### CSS (Landing):
```css
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

---

## 📱 Responsividade

### Container:
```tsx
<div className="container max-w-4xl mx-auto px-4 py-8">
```

### Grid:
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### Avatar:
```tsx
<Avatar className="h-24 w-24 md:h-32 md:w-32">
```

### Navegação:
```tsx
<nav className="hidden md:flex"> {/* Desktop */}
<nav className="md:hidden fixed bottom-0"> {/* Mobile */}
```

---

**✅ Todas as páginas seguem este padrão de design consistente!**
