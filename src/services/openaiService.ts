
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
    
    // Log para depuração - não inclui a chave completa
    console.log("Iniciando chamada à API da OpenAI");
    console.log("API Key configurada:", apiKey ? "Sim (não exibida por segurança)" : "Não");
    
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
            content: "Você é um assistente especializado em análise nutricional de alimentos. Sua tarefa é identificar alimentos em imagens e fornecer detalhes nutricionais precisos. Sempre retorne os dados no formato JSON válido, sem incluir formatação adicional ou texto explicativo."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identifique o alimento nesta imagem e forneça informações nutricionais. Responda APENAS em formato JSON válido com a seguinte estrutura exata, sem texto adicional: {\"foodName\": string, \"confidence\": number, \"nutrients\": {\"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number}, \"servingSize\": string}"
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
      const errorData = await response.json();
      console.error("Erro na resposta da OpenAI:", errorData);
      throw new Error(`Erro na API da OpenAI: ${response.status} ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    // Extraindo o conteúdo JSON da resposta
    let analysisResult: OpenAIAnalysisResult;
    
    try {
      // Tentativa de extrair o JSON da resposta
      const content = data.choices[0].message.content;
      console.log("Resposta da OpenAI:", content);
      
      // Tenta encontrar um objeto JSON válido na resposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Formato JSON não encontrado na resposta");
      }
      
      // Verifica se todos os campos necessários estão presentes
      if (!analysisResult.foodName || !analysisResult.nutrients) {
        throw new Error("Resposta incompleta da OpenAI");
      }
    } catch (e) {
      console.error("Erro ao processar resposta da OpenAI:", e);
      throw new Error("Formato de resposta da OpenAI inesperado");
    }
    
    // Convertendo para o formato FoodAnalysis
    return {
      id: nanoid(),
      name: analysisResult.foodName || "Alimento desconhecido",
      confidence: analysisResult.confidence || 0.7,
      calories: analysisResult.nutrients.calories || 0,
      protein: analysisResult.nutrients.protein || 0,
      carbs: analysisResult.nutrients.carbs || 0,
      fat: analysisResult.nutrients.fat || 0,
      servingSize: analysisResult.servingSize || "1 porção (estimada)",
      image: imageBase64,
      date: new Date().toISOString()
    };
  } catch (error) {
    console.error("Erro na análise da imagem:", error);
    throw error;
  }
}
