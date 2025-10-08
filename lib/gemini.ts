/**
 * Google Gemini API Integration
 * Para análise de livros e geração de vibes/moods
 */

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export interface BookAnalysis {
  vibeTags: string[];
  mood: string[];
  atmosphere: string[];
  pace: "slow" | "medium" | "fast";
  intensity: number;
  reasoning: string;
}

/**
 * Analisar um livro usando Gemini para gerar vibes e moods
 */
export async function analyzeBookWithGemini(
  title: string,
  author: string,
  description: string,
  genres: string[]
): Promise<BookAnalysis | null> {
  try {
    const prompt = `Você é um especialista em literatura que analisa livros para categorizar suas características emocionais e atmosféricas.

Analise o seguinte livro e forneça uma categorização detalhada:

**Título:** ${title}
**Autor:** ${author}
**Gêneros:** ${genres.join(", ")}
**Descrição:** ${description}

Com base nessas informações, forneça:

1. **Vibe Tags** (escolha 2-3 das opções): cozy, atmospheric, thought-provoking, fast-paced, emotional, dark, uplifting, mysterious, romantic, adventurous

2. **Mood Tags** (escolha 2-3 das opções): melancholic, hopeful, tense, peaceful, excited, reflective, joyful, anxious

3. **Atmosphere Tags** (escolha 1-2 das opções): rainy-day, winter-night, summer-beach, cozy-cafe, mountain-cabin, city-night, countryside, autumn-forest

4. **Pace** (escolha uma): slow, medium, fast

5. **Intensity** (escolha um número de 1 a 5, onde 1 é leve e 5 é intenso)

6. **Reasoning**: Uma breve explicação das suas escolhas (2-3 frases)

Forneça a resposta APENAS em formato JSON válido, sem texto adicional:
{
  "vibeTags": ["tag1", "tag2"],
  "mood": ["mood1", "mood2"],
  "atmosphere": ["atm1"],
  "pace": "medium",
  "intensity": 3,
  "reasoning": "explicação"
}`;

    const url = `${GEMINI_API_BASE}/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No response from Gemini");
    }

    // Extrair JSON da resposta (pode vir com ```json wrapper)
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Gemini");
    }

    const analysis: BookAnalysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error("Error analyzing book with Gemini:", error);
    return null;
  }
}

/**
 * Gerar recomendações personalizadas usando Gemini
 */
export async function generatePersonalizedRecommendations(
  userProfile: {
    favoriteGenres: string[];
    moodTags: string[];
    vibePreferences: Record<string, number>;
    lifeMoment?: string;
  },
  context?: string
): Promise<string[]> {
  try {
    const prompt = `Você é um especialista em recomendações literárias.

Com base no perfil do leitor:
- Gêneros favoritos: ${userProfile.favoriteGenres.join(", ")}
- Moods preferidos: ${userProfile.moodTags.join(", ")}
- Momento de vida: ${userProfile.lifeMoment || "não especificado"}
${context ? `- Contexto atual: ${context}` : ""}

Sugira 5 títulos de livros que seriam perfeitos para este leitor. Para cada livro, forneça título e autor.

Responda em formato JSON:
{
  "recommendations": [
    { "title": "Título do Livro", "author": "Autor" }
  ]
}`;

    const url = `${GEMINI_API_BASE}/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return [];
    }

    const result = JSON.parse(jsonMatch[0]);
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

/**
 * Gerar descrição melhorada de um livro
 */
export async function enhanceBookDescription(
  title: string,
  author: string,
  originalDescription: string
): Promise<string> {
  try {
    const prompt = `Reescreva a seguinte descrição de livro de forma mais envolvente e cativante, mantendo as informações essenciais mas tornando-a mais atraente para leitores:

**Título:** ${title}
**Autor:** ${author}
**Descrição original:** ${originalDescription}

Forneça apenas a descrição melhorada, sem introduções ou explicações.`;

    const url = `${GEMINI_API_BASE}/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const enhancedDescription =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return enhancedDescription || originalDescription;
  } catch (error) {
    console.error("Error enhancing description:", error);
    return originalDescription;
  }
}
