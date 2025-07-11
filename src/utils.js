// utils/chatgpt.js
export async function askChatGPT(question) {
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
              content: question,
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
export async function askClaude(question) {
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
              content: question,
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
export async function askGemini(question) {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    // Verificar si la API key está configurada
    if (!apiKey) {
      throw new Error("Google API Key is not configured. Check your .env file");
    }
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: question,
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
export async function askPerplexity(question) {
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
              content: question,
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
  