export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }
  
    // Permitir CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    // eslint-disable-next-line no-undef
    const apiKey = process.env.VITE_PERPLEXITY_API_KEY;
  
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }
  
    try {
      const { prompt, model, max_tokens, temperature, messages } = req.body;
  
      // Si se envía un prompt directo, usarlo. Si no, usar los mensajes
      const requestBody = {
        model: model || "sonar",
        max_tokens: max_tokens || 1500,
        temperature: temperature || 0.1,
        messages: messages || [
          {
            role: "user",
            content: prompt,
          },
        ],
      };
  
      console.log("Sending request to Perplexity API:", {
        url: "https://api.perplexity.ai/chat/completions",
        model: requestBody.model,
        hasApiKey: !!apiKey
      });
  
      // Función para hacer la petición con reintentos
      const makeRequestWithRetry = async (retries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const perplexityRes = await fetch("https://api.perplexity.ai/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
              },
              body: JSON.stringify(requestBody),
            });
  
            console.log(`Perplexity API response status (attempt ${attempt}):`, perplexityRes.status);
  
            // Si es un error de sobrecarga, reintentar
            if (perplexityRes.status === 529) {
              if (attempt < retries) {
                console.log(`Overloaded error, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Backoff exponencial
                continue;
              }
            }
  
            if (!perplexityRes.ok) {
              const errorText = await perplexityRes.text();
              console.error("Perplexity API error:", errorText);
              return res.status(perplexityRes.status).json({ error: "Perplexity API error", details: errorText });
            }
  
            const data = await perplexityRes.json();
            console.log("Perplexity API response data:", JSON.stringify(data, null, 2));
            return res.status(200).json({ response: data });
  
          } catch (err) {
            if (attempt === retries) {
              throw err;
            }
            console.log(`Request failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
          }
        }
      };
  
      await makeRequestWithRetry();
  
    } catch (err) {
      console.error("Perplexity error:", err);
      return res.status(500).json({ error: "Error fetching from Perplexity", details: err.message });
    }
  }
  
  