
import { FoodAnalysis } from "@/components/analysis/NutritionCard";
import { nanoid } from "nanoid";

// Interface para os resultados da análise da OpenAI
interface OpenAIAnalysisResult {
  foodName: string;
  confidence: number;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  servingSize: string;
}

// Função para analisar imagem usando a API da OpenAI
export async function analyzeImageWithOpenAI(imageBase64: string): Promise<FoodAnalysis> {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("API key da OpenAI não encontrada");
      throw new Error("API key da OpenAI não configurada. Por favor, adicione a chave no arquivo .env");
    }
    
    // Removendo o prefixo da string base64 se existir (ex: data:image/jpeg;base64,)
    const base64Image = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em análise nutricional de alimentos. Sua tarefa é identificar alimentos em imagens e fornecer detalhes nutricionais precisos. Retorne os dados no formato JSON."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Diga os nomes dos alimentos que contém na imagem e a quantidade de nutrientes de cada alimento e depois um total de forma organizada. Responda apenas em formato JSON com a seguinte estrutura: {foodName: string, confidence: number, nutrients: {calories: number, protein: number, carbs: number, fat: number}, servingSize: string}"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API da OpenAI: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    // Extraindo o conteúdo JSON da resposta
    let analysisResult: OpenAIAnalysisResult;
    
    try {
      // Tentativa de extrair o JSON da resposta
      const content = data.choices[0].message.content;
      analysisResult = JSON.parse(content);
    } catch (e) {
      console.error("Erro ao processar resposta da OpenAI:", e);
      throw new Error("Formato de resposta da OpenAI inesperado");
    }
    
    // Convertendo para o formato FoodAnalysis
    return {
      id: nanoid(),
      name: analysisResult.foodName,
      confidence: analysisResult.confidence || 0.9,
      calories: analysisResult.nutrients.calories,
      protein: analysisResult.nutrients.protein,
      carbs: analysisResult.nutrients.carbs,
      fat: analysisResult.nutrients.fat,
      servingSize: analysisResult.servingSize || "1 porção (estimada)",
      image: imageBase64,
      date: new Date().toISOString()
    };
  } catch (error) {
    console.error("Erro na análise da imagem:", error);
    throw error;
  }
}
