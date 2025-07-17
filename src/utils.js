// utils/chatgpt.js
import { questionsCreationPrompt} from "./data/prompts";

export function fillQuestionsPrompt(promptTemplate, brandName, brandDescription, location) {
  return promptTemplate
    .replace(/{{brandName}}/g, brandName)
    .replace(/{{brandDescription}}/g, brandDescription)
    .replace(/{{location}}/g, location);
}

export function fillAnalysisPrompt(promptTemplate, question) {
  return promptTemplate
    .replace(/{{question}}/g, question);
}

export async function generateQuestions(brandName, brandDescription, location) {
  const prompt = fillQuestionsPrompt(questionsCreationPrompt, brandName, brandDescription, location);
  const questions = await askChatGPT(prompt);
  
  // Intentar parsear como JSON primero
  try {
    const cleanedResponse = cleanAIResponse(questions);
    const parsedQuestions = JSON.parse(cleanedResponse);
    
    // Verificar que sea un array
    if (Array.isArray(parsedQuestions)) {
      console.log("Preguntas parseadas correctamente:", parsedQuestions);
      return parsedQuestions;
    }
  } catch (error) {
    console.warn("No se pudo parsear como JSON, intentando split por líneas:", error);
  }
  
  // Fallback: intentar split por líneas (para compatibilidad)
  const fallbackQuestions = questions.split('\n')
    .map(question => question.trim())
    .filter(question => question.length > 0);
  
  console.log("Preguntas usando fallback:", fallbackQuestions);
  return fallbackQuestions;
}   


export async function askChatGPT(prompt) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // Verificar si la API key está configurada
    if (!apiKey) {
      throw new Error("OpenAI API Key is not configured. Check your .env file");
    }
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });
  
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }
  
      const data = await response.json();
  
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error("The API response does not contain the expected options");
      }
    } catch (error) {
      console.error("Error en askChatGPT:", error);
      throw new Error(`There was an error getting the answer from ChatGPT: ${error.message}`);
    }
  }

// utils/claude.js
export async function askClaude(prompt) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    
    // Verificar si la API key está configurada
    if (!apiKey) {
      throw new Error("Anthropic API Key is not configured. Check your .env file");
    }
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });
  
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }
  
      const data = await response.json();
  
      if (data.content && data.content.length > 0) {
        return data.content[0].text;
      } else {
        throw new Error("The API response does not contain the expected content");
      }
    } catch (error) {
      console.error("Error en askClaude:", error);
      throw new Error(`There was an error getting the answer from Claude: ${error.message}`);
    }
  }

// utils/gemini.js
export async function askGemini(prompt) {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    // Verificar si la API key está configurada
    if (!apiKey) {
      throw new Error("Google API Key is not configured. Check your .env file");
    }
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            maxOutputTokens: 1024,
          },
        }),
      });
  
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }
  
      const data = await response.json();
  
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("The API response does not contain the expected content");
      }
    } catch (error) {
      console.error("Error en askGemini:", error);
      throw new Error(`There was an error getting the answer from Gemini: ${error.message}`);
    }
  }

// utils/perplexity.js
export async function askPerplexity(prompt) {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    
    // Verificar si la API key está configurada
    if (!apiKey) {
      throw new Error("Perplexity API Key is not configured. Check your .env file");
    }
  
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
            content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
  
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }
  
      const data = await response.json();
  
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error("The API response does not contain the expected options");
      }
    } catch (error) {
      console.error("Error en askPerplexity:", error);
      throw new Error(`There was an error getting the answer from Perplexity: ${error.message}`);
    }
  }
  

  export const findPosition = (ranking, name) => {
    const foundIndex = ranking.findIndex(item => {
      const itemLower = item.toLowerCase().trim();
      const nameLower = name.toLowerCase().trim();
      return itemLower === nameLower;
    });
    
    return foundIndex;
  }

  export const extractRanking = (answer) => {
    const ranking = answer.match(/ranking:\s*(\[.*?\])/);
    return ranking ? JSON.parse(ranking[1]) : [];
  }

// Function to clean AI responses that may contain markdown formatting
export const cleanAIResponse = (response) => {
  if (!response || typeof response !== 'string') {
    return response;
  }
  
  // Remove markdown code blocks
  let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // If the response starts with [ and ends with ], it's likely JSON
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    return cleaned;
  }
  
  // If the response starts with { and ends with }, it's likely JSON
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    return cleaned;
  }
  
  // Try to extract JSON from the response
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  return cleaned;
}

// Function to ask ChatGPT with Google Search context
export async function askChatGPTWithContext(question, googleSearchResults) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // Verificar si la API key está configurada
  if (!apiKey) {
    throw new Error("OpenAI API Key is not configured. Check your .env file");
  }

  // Preparar el contexto de Google Search
  let contextMessage = "";
if (googleSearchResults && googleSearchResults.length > 0) {
  const formattedSearchResults = googleSearchResults.map((result, index) => {
    return `${index + 1}. ${result.title}\n   URL: ${result.link}\n   Descripción: ${result.snippet}`;
  }).join('\n\n');

  contextMessage =
`
Actúa como un sistema de análisis AEO (Answer Engine Optimization) que evalúa qué negocios reales aparecen como recomendación en una respuesta generada por un modelo conversacional.

Recibirás:
- Una pregunta hecha por un usuario.
- Resultados de búsqueda de Google relevantes.

Tu tarea es identificar todos los negocios o lugares reales que podrían aparecer en una respuesta útil y natural a la pregunta, **basándote solo en los resultados de búsqueda**.

---

Pregunta:
${question}

---

Resultados de búsqueda de Google:
${formattedSearchResults}

---

Instrucciones importantes:

- Usa exclusivamente la información contenida en los resultados.
- No inventes negocios que no estén mencionados directamente.
- Ignora resultados que sean solo blogs, artículos, recetas o contenido informativo.
- Incluye todos los negocios, locales o servicios **mencionados explícitamente o claramente identificables como tales** que existan en CHILE.
- Ordena los negocios en el arreglo según el orden en que los usarías en una respuesta útil.
- No excluyas negocios por ser poco conocidos o nuevos: si es un lugar real, inclúyelo.
- No incluyas ninguna explicación, saludo o texto adicional.  
- Incluye al menos 5 negocios o lugares reales.
- Devuelve solo el arreglo JSON, como este:

["Negocio 1", "Negocio 2", "Negocio 3", "Negocio 4", "Negocio 5"]

Si no hay negocios relevantes, devuelve: []
`;
;
    
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: contextMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500, // Aumentado para respuestas más detalladas con contexto
      }),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const rawResponse = data.choices[0].message.content;
      
      // Intentar parsear como JSON primero
      try {
        const cleanedResponse = cleanAIResponse(rawResponse);
        const parsedArray = JSON.parse(cleanedResponse);
        
        // Verificar que sea un array
        if (Array.isArray(parsedArray)) {
          console.log("Array parseado correctamente:", parsedArray);
          return parsedArray;
        } else {
          console.warn("La respuesta no es un array válido, retornando array vacío");
          return [];
        }
      } catch (error) {
        console.warn("No se pudo parsear como JSON, retornando array vacío:", error);
        return [];
      }
    } else {
      throw new Error("The API response does not contain the expected options");
    }
  } catch (error) {
    console.error("Error en askChatGPTWithContext:", error);
    throw new Error(`There was an error getting the answer from ChatGPT with context: ${error.message}`);
  }
}

