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
// Function to ask Claude with Google Search context
export async function askClaudeWithContext(question, googleSearchResults) {
  // const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  // // Verificar si la API key está configurada
  // if (!apiKey) {
  //   throw new Error("Anthropic API Key is not configured. Check your .env file");
  // }

  // Preparar el contexto de Google Search
  let contextMessage = "";
if (googleSearchResults && googleSearchResults.length > 0) {
  const formattedSearchResults = googleSearchResults.map((result, index) => {
    return `${index + 1}. ${result.title}\n   URL: ${result.link}\n   Descripción: ${result.snippet}`;
  }).join('\n\n');

  contextMessage =
`
Actúa como un sistema de análisis AEO (Answer Engine Optimization) que evalúa qué negocios reales serían mencionados en una respuesta generada por un modelo conversacional al recomendar opciones útiles al usuario.

Recibirás:
- Una pregunta hecha por un usuario.
- Resultados de búsqueda de Google relevantes.

Tu tarea es identificar todos los negocios o lugares reales **con nombre propio** que podrían aparecer como recomendación en una respuesta útil y natural a la pregunta, **basándote exclusivamente en la información de los resultados de búsqueda**.

---

Pregunta:
${question}

---

Resultados de búsqueda de Google:
${formattedSearchResults}

---

Instrucciones importantes:

- Usa **solo** la información contenida en los resultados de búsqueda.
- Incluye únicamente **negocios, marcas, locales, servicios o empresas reales con nombre propio**, ubicados en Chile.
- Excluye cualquier negocio que no esté claramente ubicado en Chile. Si no se menciona explícitamente "Chile" o una ciudad chilena (como Santiago, Valparaíso, etc.), descártalo.
- No incluyas ejemplos internacionales aunque mencionen ciudades chilenas.
- Ignora blogs personales, artículos informativos, foros, recetas, opiniones generales u otro contenido que no mencione un negocio real.
- No inventes nombres. Solo incluye los que aparecen directamente.
- Ordena los negocios según el orden en que los usarías en una respuesta útil y conversacional para un usuario chileno.
- No excluyas negocios por ser poco conocidos. Si es real y relevante, inclúyelo.
- Devuelve de 1 a 10 negocios reales en un arreglo JSON, según lo que consideres más recomendable para responder la pregunta.
- Si no hay negocios relevantes, devuelve: []

**Formato de respuesta:**

- Solo responde con el arreglo JSON, sin ningún texto adicional.
- Ejemplo correcto: 

["Negocio 1", "Negocio 2", "Negocio 3"]
`;
    
  }

  try {
    const response = await fetch("/api/proxyClaude", {

      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500, // Aumentado para respuestas más detalladas con contexto
        messages: [
          {
            role: 'user',
            content: contextMessage,
          },
        ],
        temperature: 0.1,
      }),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    console.log("Proxy response data:", JSON.stringify(data, null, 2));

    // Claude API devuelve la respuesta en data.response.content[0].text
    if (data.response && data.response.content && data.response.content.length > 0) {
      const rawResponse = data.response.content[0].text;
      
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
      throw new Error("The API response does not contain the expected content");
    }
  } catch (error) {
    console.error("Error en askClaudeWithContext:", error);
    throw new Error(`There was an error getting the answer from Claude with context: ${error.message}`);
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
  
  // Try to extract JSON array from the response (for Claude responses with explanatory text)
  const jsonArrayMatch = cleaned.match(/\[[\s\S]*?\]/);
  if (jsonArrayMatch) {
    return jsonArrayMatch[0];
  }
  
  // Try to extract JSON object from the response
  const jsonObjectMatch = cleaned.match(/\{[\s\S]*?\}/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[0];
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
Actúa como un sistema de análisis AEO (Answer Engine Optimization) que evalúa qué negocios reales serían mencionados en una respuesta generada por un modelo conversacional al recomendar opciones útiles al usuario.

Recibirás:
- Una pregunta hecha por un usuario.
- Resultados de búsqueda de Google relevantes.

Tu tarea es identificar todos los negocios o lugares reales **con nombre propio** que podrían aparecer como recomendación en una respuesta útil y natural a la pregunta, **basándote exclusivamente en la información de los resultados de búsqueda**.

---

Pregunta:
${question}

---

Resultados de búsqueda de Google:
${formattedSearchResults}

---

Instrucciones importantes:

- Usa **solo** la información contenida en los resultados de búsqueda.
- Incluye únicamente **negocios, marcas, locales, servicios o empresas reales con nombre propio**, ubicados en Chile.
- Excluye cualquier negocio que no esté claramente ubicado en Chile. Si no se menciona explícitamente "Chile" o una ciudad chilena (como Santiago, Valparaíso, etc.), descártalo.
- No incluyas ejemplos internacionales aunque mencionen ciudades chilenas.
- Ignora blogs personales, artículos informativos, foros, recetas, opiniones generales u otro contenido que no mencione un negocio real.
- No inventes nombres. Solo incluye los que aparecen directamente.
- Ordena los negocios según el orden en que los usarías en una respuesta útil y conversacional para un usuario chileno.
- No excluyas negocios por ser poco conocidos. Si es real y relevante, inclúyelo.
- Devuelve de 1 a 10 negocios reales en un arreglo JSON, según lo que consideres más recomendable para responder la pregunta.
- Si no hay negocios relevantes, devuelve: []

Formato de salida:

["Negocio 1", "Negocio 2", "Negocio 3"]

`;
    
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
        console.log("Raw response:", rawResponse);
        console.log("Cleaned response:", cleanedResponse);
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
        console.warn("Raw response was:", rawResponse);
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

// Function to ask Gemini with Google Search context
export async function askGeminiWithContext(question, googleSearchResults) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  // Verificar si la API key está configurada
  if (!apiKey) {
    throw new Error("Google API Key is not configured. Check your .env file");
  }

  // Preparar el contexto de Google Search
  let contextMessage = "";
if (googleSearchResults && googleSearchResults.length > 0) {
  const formattedSearchResults = googleSearchResults.map((result, index) => {
    return `${index + 1}. ${result.title}\n   URL: ${result.link}\n   Descripción: ${result.snippet}`;
  }).join('\n\n');

  contextMessage =
`
Actúa como un sistema de análisis AEO (Answer Engine Optimization) que evalúa qué negocios reales serían mencionados en una respuesta generada por un modelo conversacional al recomendar opciones útiles al usuario.

Recibirás:
- Una pregunta hecha por un usuario.
- Resultados de búsqueda de Google relevantes.

Tu tarea es identificar todos los negocios o lugares reales **con nombre propio** que podrían aparecer como recomendación en una respuesta útil y natural a la pregunta, **basándote exclusivamente en la información de los resultados de búsqueda**.

---

Pregunta:
${question}

---

Resultados de búsqueda de Google:
${formattedSearchResults}

---

Instrucciones importantes:

- Usa **solo** la información contenida en los resultados de búsqueda.
- Incluye únicamente **negocios, marcas, locales, servicios o empresas reales con nombre propio**, ubicados en Chile.
- Excluye cualquier negocio que no esté claramente ubicado en Chile. Si no se menciona explícitamente "Chile" o una ciudad chilena (como Santiago, Valparaíso, etc.), descártalo.
- No incluyas ejemplos internacionales aunque mencionen ciudades chilenas.
- Ignora blogs personales, artículos informativos, foros, recetas, opiniones generales u otro contenido que no mencione un negocio real.
- No inventes nombres. Solo incluye los que aparecen directamente.
- Ordena los negocios según el orden en que los usarías en una respuesta útil y conversacional para un usuario chileno.
- No excluyas negocios por ser poco conocidos. Si es real y relevante, inclúyelo.
- Devuelve de 1 a 10 negocios reales en un arreglo JSON, según lo que consideres más recomendable para responder la pregunta.
- Si no hay negocios relevantes, devuelve: []

Formato de salida:

["Negocio 1", "Negocio 2", "Negocio 3"]

`;
    
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
                text: contextMessage,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500, // Aumentado para respuestas más detalladas con contexto
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
      const rawResponse = data.candidates[0].content.parts[0].text;
      
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
      throw new Error("The API response does not contain the expected content");
    }
  } catch (error) {
    console.error("Error en askGeminiWithContext:", error);
    throw new Error(`There was an error getting the answer from Gemini with context: ${error.message}`);
  }
}

// Function to ask Perplexity with Google Search context
export async function askPerplexityWithContext(question, googleSearchResults) {
  // Preparar el contexto de Google Search
  let contextMessage = "";
if (googleSearchResults && googleSearchResults.length > 0) {
  const formattedSearchResults = googleSearchResults.map((result, index) => {
    return `${index + 1}. ${result.title}\n   URL: ${result.link}\n   Descripción: ${result.snippet}`;
  }).join('\n\n');

  contextMessage =
`
Actúa como un sistema de análisis AEO (Answer Engine Optimization) que evalúa qué negocios reales serían mencionados en una respuesta generada por un modelo conversacional al recomendar opciones útiles al usuario.

Recibirás:
- Una pregunta hecha por un usuario.
- Resultados de búsqueda de Google relevantes.

Tu tarea es identificar todos los negocios o lugares reales **con nombre propio** que podrían aparecer como recomendación en una respuesta útil y natural a la pregunta, **basándote exclusivamente en la información de los resultados de búsqueda**.

---

Pregunta:
${question}

---

Resultados de búsqueda de Google:
${formattedSearchResults}

---

Instrucciones importantes:

- Usa **solo** la información contenida en los resultados de búsqueda.
- Incluye únicamente **negocios, marcas, locales, servicios o empresas reales con nombre propio**, ubicados en Chile.
- Excluye cualquier negocio que no esté claramente ubicado en Chile. Si no se menciona explícitamente "Chile" o una ciudad chilena (como Santiago, Valparaíso, etc.), descártalo.
- No incluyas ejemplos internacionales aunque mencionen ciudades chilenas.
- Ignora blogs personales, artículos informativos, foros, recetas, opiniones generales u otro contenido que no mencione un negocio real.
- No inventes nombres. Solo incluye los que aparecen directamente.
- Ordena los negocios según el orden en que los usarías en una respuesta útil y conversacional para un usuario chileno.
- No excluyas negocios por ser poco conocidos. Si es real y relevante, inclúyelo.
- Devuelve de 1 a 10 negocios reales en un arreglo JSON, según lo que consideres más recomendable para responder la pregunta.
- Si no hay negocios relevantes, devuelve: []

**Formato de respuesta:**

- Solo responde con el arreglo JSON, sin ningún texto adicional.
- Ejemplo correcto: 

["Negocio 1", "Negocio 2", "Negocio 3"]
`;
    
  }

  try {
    const response = await fetch("/api/proxyPerplexity", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 1500, // Aumentado para respuestas más detalladas con contexto
        messages: [
          {
            role: 'user',
            content: contextMessage,
          },
        ],
        temperature: 0.1,
      }),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    console.log("Proxy response data:", JSON.stringify(data, null, 2));

    // Perplexity API devuelve la respuesta en data.response.choices[0].message.content
    if (data.response && data.response.choices && data.response.choices.length > 0) {
      const rawResponse = data.response.choices[0].message.content;
      
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
      throw new Error("The API response does not contain the expected content");
    }
  } catch (error) {
    console.error("Error en askPerplexityWithContext:", error);
    throw new Error(`There was an error getting the answer from Perplexity with context: ${error.message}`);
  }
}

