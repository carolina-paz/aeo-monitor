// utils/chatgpt.js
import { questionsCreationPrompt } from "./data/prompts";

export function fillPrompt(promptTemplate, brandName, brandDescription, location) {
  return promptTemplate
    .replace(/{{brandName}}/g, brandName)
    .replace(/{{brandDescription}}/g, brandDescription)
    .replace(/{{location}}/g, location);
}

export async function generateQuestions(brandName, brandDescription, location) {
  const prompt = fillPrompt(questionsCreationPrompt, brandName, brandDescription, location);
  const questions = await askChatGPT(prompt);
  return questions;
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

