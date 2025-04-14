
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
    
    // Log detalhado para depuração
    console.log("Iniciando chamada à API da OpenAI");
    console.log("API Key configurada:", apiKey ? "Sim (primeiros 5 caracteres: " + apiKey.substring(0, 5) + "...)" : "Não");
    
    // Log do tamanho da imagem em bytes
    const imageSizeInBytes = base64Image.length * 0.75; // Aproximação do tamanho em bytes
    const imageSizeInMB = imageSizeInBytes / (1024 * 1024);
    console.log(`Tamanho da imagem: aproximadamente ${imageSizeInMB.toFixed(2)} MB`);
    
    // Verificar se a imagem não é muito grande (limite ajustado para 20MB)
    const maxSizeInMB = 20;
    if (imageSizeInMB > maxSizeInMB) {
      throw new Error(`A imagem é muito grande (${imageSizeInMB.toFixed(2)} MB). O tamanho máximo permitido é ${maxSizeInMB} MB.`);
    }
    
    console.log("Enviando requisição para a API da OpenAI...");
    
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
      const errorText = await response.text();
      console.error("Resposta de erro da OpenAI:", errorText);
      
      let errorMessage = "";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || `Erro na API da OpenAI: Status ${response.status}`;
        console.error("Detalhes do erro:", errorData);
      } catch (e) {
        errorMessage = `Erro na API da OpenAI: Status ${response.status}. Resposta: ${errorText.substring(0, 100)}...`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Resposta recebida da OpenAI:", JSON.stringify(data, null, 2).substring(0, 500) + '...');
    
    // Extraindo o conteúdo JSON da resposta
    let analysisResult: OpenAIAnalysisResult;
    
    try {
      // Tentativa de extrair o JSON da resposta
      const content = data.choices[0].message.content;
      console.log("Conteúdo da resposta:", content);
      
      // Tenta encontrar um objeto JSON válido na resposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Formato JSON não encontrado na resposta");
      }
      
      // Verifica se todos os campos necessários estão presentes
      if (!analysisResult.foodName || !analysisResult.nutrients) {
        throw new Error("Resposta incompleta da OpenAI: Alguns campos obrigatórios estão faltando");
      }
    } catch (e) {
      console.error("Erro ao processar resposta da OpenAI:", e);
      throw new Error(`Erro ao processar resposta da OpenAI: ${e.message}`);
    }
    
    console.log("Análise concluída com sucesso:", analysisResult);
    
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
