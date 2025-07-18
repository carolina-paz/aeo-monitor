export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // eslint-disable-next-line no-undef
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { prompt, model, max_tokens, temperature, messages } = req.body;

    // Si se envía un prompt directo, usarlo. Si no, usar los mensajes
    const requestBody = {
      model: model || "claude-3-5-sonnet-20241022",
      max_tokens: max_tokens || 1500,
      temperature: temperature || 0.1,
      messages: messages || [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    console.log("Sending request to Claude API:", {
      url: "https://api.anthropic.com/v1/messages",
      model: requestBody.model,
      hasApiKey: !!apiKey
    });

    // Función para hacer la petición con reintentos
    const makeRequestWithRetry = async (retries = 3, delay = 1000) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(requestBody),
          });

          console.log(`Claude API response status (attempt ${attempt}):`, claudeRes.status);

          // Si es un error de sobrecarga, reintentar
          if (claudeRes.status === 529) {
            if (attempt < retries) {
              console.log(`Overloaded error, retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2; // Backoff exponencial
              continue;
            }
          }

          if (!claudeRes.ok) {
            const errorText = await claudeRes.text();
            console.error("Claude API error:", errorText);
            return res.status(claudeRes.status).json({ error: "Claude API error", details: errorText });
          }

          const data = await claudeRes.json();
          console.log("Claude API response data:", JSON.stringify(data, null, 2));
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
    console.error("Claude error:", err);
    return res.status(500).json({ error: "Error fetching from Claude", details: err.message });
  }
}

