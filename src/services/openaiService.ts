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
  console.log("[openaiService] Iniciando análise da imagem..."); // Log inicial

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log("[openaiService] Tentando ler a VITE_OPENAI_API_KEY..."); // Log antes de verificar a chave
    
    if (!apiKey) {
      console.error("[openaiService] ERRO: API key da OpenAI não encontrada nas variáveis de ambiente (VITE_OPENAI_API_KEY).");
      throw new Error("API key da OpenAI não configurada. Por favor, adicione a chave no arquivo .env");
    }

    // Log para verificar a chave lida (sem expor a chave inteira)
    const apiKeyPreview = `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`;
    console.log(`[openaiService] Chave API lida (prévia): ${apiKeyPreview}`);
    
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
      console.error(`[openaiService] ERRO: Imagem muito grande (${imageSizeInMB.toFixed(2)} MB). Limite: ${maxSizeInMB} MB.`);
      throw new Error(`A imagem é muito grande (${imageSizeInMB.toFixed(2)} MB). O tamanho máximo permitido é ${maxSizeInMB} MB.`);
    }
    
    const apiURL = "https://api.openai.com/v1/chat/completions";
    console.log(`[openaiService] URL da API: ${apiURL}`);
    
    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analise esta imagem de um alimento ou prato. Forneça uma estimativa dos valores nutricionais TOTAIS (calorias, proteínas, carboidratos, gorduras) em formato JSON. O JSON deve ter as chaves: 'name' (nome do alimento/prato em português, seja o mais específico possível, listando os componentes principais se for um prato composto), 'calories' (número total), 'protein' (número total em gramas), 'carbs' (número total em gramas), 'fat' (número total em gramas). Retorne APENAS o JSON, sem nenhum texto adicional ou formatação como ```json."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 300
    };

    console.log("[openaiService] Enviando requisição para a API da OpenAI com o payload...");
    // Não logar o payload inteiro pois contém a imagem em base64

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log(`[openaiService] Resposta recebida da API. Status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text(); // Ler o corpo como texto para ver a mensagem de erro exata
      console.error(`[openaiService] ERRO na resposta da API: Status ${response.status}`);
      console.error(`[openaiService] Corpo do Erro da API: ${errorBody}`); 
      // Tentar extrair uma mensagem mais específica se possível
      let specificError = `Erro na API OpenAI: ${response.status} ${response.statusText}`; 
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error && errorJson.error.message) {
          specificError = `Erro API OpenAI: ${errorJson.error.message}`;
        }
      } catch (e) { /* Ignorar erro de parse JSON */ }
      throw new Error(specificError); // Lançar o erro com mais detalhes
    }

    const data = await response.json();
    console.log("[openaiService] Resposta JSON da API recebida com sucesso.");

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("[openaiService] ERRO: Resposta da API em formato inesperado.", data);
      throw new Error("Resposta da API da OpenAI em formato inesperado");
    }

    const jsonResponse = data.choices[0].message.content;
    console.log("[openaiService] Conteúdo da resposta (JSON esperado):", jsonResponse);

    try {
      // Limpar a string JSON de possíveis acentos graves e espaços extras
      const cleanedJson = jsonResponse.replace(/```json\n|```|\n/g, '').trim();
      console.log("[openaiService] JSON limpo antes do parse:", cleanedJson);
      const parsedData: FoodAnalysis = JSON.parse(cleanedJson);
      console.log("[openaiService] JSON parseado com sucesso:", parsedData);
      return parsedData;
    } catch (e) {
      console.error("[openaiService] ERRO ao parsear JSON da resposta da API:", e);
      console.error("[openaiService] String JSON que falhou no parse:", jsonResponse);
      throw new Error("Erro ao processar a resposta da análise nutricional. Formato inválido.");
    }

  } catch (error) {
    console.error("[openaiService] ERRO GERAL na função analyzeImageWithOpenAI:", error);
    // Re-lançar o erro para que a página Camera possa tratá-lo
    throw error; 
  }
}

// Nova função para obter análise textual detalhada
export async function getDetailedAnalysisText(foodName: string): Promise<string> {
  console.log(`[openaiService] Iniciando análise textual para: ${foodName}`);

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[openaiService] ERRO (análise textual): Chave API não encontrada.");
      throw new Error("API key da OpenAI não configurada.");
    }
    const apiKeyPreview = `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`;
    console.log(`[openaiService] Chave API (prévia) para análise textual: ${apiKeyPreview}`);

    const apiURL = "https://api.openai.com/v1/chat/completions";
    const payload = {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
          content: "Você é um assistente nutricional prestativo e informativo. Gere respostas claras, bem estruturadas e fáceis de ler para o usuário final."
          },
          {
            role: "user",
          content: `Gere uma análise detalhada para o prato "${foodName}". Siga **exatamente** esta estrutura e use Markdown para formatação (negrito com **):\n\n**Análise Visual do Prato:**\nListe os alimentos que você acredita estarem presentes no prato de forma numerada.\n\n**Estimativa Nutricional Geral:**\n*   **Equilíbrio:** Descreva brevemente o equilíbrio de macronutrientes (proteínas, carboidratos, gorduras) e fibras.\n*   **Ideal para:** Sugira para quem ou qual objetivo este prato seria mais adequado (ex: ganho de massa, refeição leve, pós-treino).\n*   **Sugestão:** Dê uma dica rápida para tornar o prato ainda melhor ou uma sugestão de consumo.\n\nSeja informativo, mas conciso.`
        }
      ],
      max_tokens: 350,
      temperature: 0.6
    };

    console.log("[openaiService] Enviando requisição de análise textual (prompt aprimorado)...");
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    console.log(`[openaiService] Resposta da análise textual recebida. Status: ${response.status}`);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[openaiService] ERRO na resposta da análise textual: Status ${response.status}`);
      console.error(`[openaiService] Corpo do Erro da API (textual): ${errorBody}`);
      let specificError = `Erro na análise textual: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error && errorJson.error.message) {
          specificError = `Erro API OpenAI (textual): ${errorJson.error.message}`;
        }
      } catch (e) { /* Ignorar erro de parse */ }
      throw new Error(specificError);
    }
    
    const data = await response.json();
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("[openaiService] ERRO: Resposta da análise textual em formato inesperado.", data);
      throw new Error("Resposta da análise textual em formato inesperado");
    }

    const analysisText = data.choices[0].message.content.trim();
    console.log("[openaiService] Análise textual formatada recebida:", analysisText);
    return analysisText;

  } catch (error) {
    console.error("[openaiService] ERRO GERAL na função getDetailedAnalysisText:", error);
    throw error;
  }
}
