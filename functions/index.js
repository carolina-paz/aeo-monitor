/* eslint-disable no-undef */
const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.proxyClaude = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const apiKey = functions.config().anthropic.key;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.set("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching from Claude API");
  }
});
