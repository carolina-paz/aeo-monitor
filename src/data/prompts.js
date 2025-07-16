export const questionsCreationPrompt = `Actúa como un experto en generación de preguntas útiles para analizar el rendimiento AEO (Answer Engine Optimization) de un negocio local.

Tu tarea es generar una lista de 10 preguntas naturales que podría hacer una persona en un buscador conversacional como ChatGPT, con el objetivo de descubrir un negocio con las siguientes características:

- Nombre del negocio: {{brandName}}
- Descripción: {{brandDescription}}
- Ubicación: {{location}}

Lineamientos:

- Las preguntas deben sonar como si las hiciera un usuario real que no conoce aún el negocio, pero busca algo similar.
- No incluyas el nombre del negocio en ninguna pregunta.
- Evitá hacer preguntas demasiado específicas o técnicas. Preferí un tono más conversacional y exploratorio.
- Algunas preguntas pueden incluir la ubicación, otras no (para simular diferentes tipos de usuarios).
- Varía el estilo de redacción: directas, con contexto personal, tipo "¿Cuál es el mejor...?", etc.
- Pensá en cómo alguien realmente buscaría este tipo de lugar o servicio.

Devuelve **solo un arreglo JSON con 10 strings**, como este:

[
  "¿Dónde puedo comer sushi vegano en Santiago?",
  "¿Qué restaurante saludable tiene delivery en el centro?",
  "Estoy buscando una cafetería tranquila para trabajar, ¿alguna recomendación?",
  ...
]

`

export const analysisPrompt = `Actúa como un sistema que evalúa la visibilidad de un negocio en respuestas generadas por modelos de lenguaje.

Tu objetivo es ayudar a monitorear el rendimiento AEO (Answer Engine Optimization) de una empresa usando modelos LLM.

A continuación te entregaré una pregunta que haría un usuario buscando recomendaciones reales.

{{question}}

1. Responde como si un usuario real te la hubiera hecho. Genera una respuesta completa, natural y útil, recomendando lugares o negocios relevantes y conocidos en la zona correspondiente (si es que la pregunta incluye ubicación).

2. Después de responder, extrae el "ranking": una lista ordenada de los nombres de lugares o negocios mencionados en la respuesta, exactamente en el orden en que fueron nombrados.

Devuélveme un arreglo JSON donde el primer elemento es el nombre del negocio que mencionas en la respuesta, y el resto son los nombres de lugares o negocios mencionados en la respuesta, en el orden que aparecen en la respuesta.

Si la pregunta no tiene lugares o negocios relevantes reales, devuelve []

Ejemplo de formato:

  ["Restaurante A", "Restaurante B", "Restaurante C"]

IMPORTANTE: No incluyas explicaciones, introducciones ni justificaciones. Solo el arreglo JSON.`;