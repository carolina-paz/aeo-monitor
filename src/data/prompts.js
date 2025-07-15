export const questionsCreationPrompt = `Actúa como un experto en generación de preguntas útiles para analizar el rendimiento AEO (Answer Engine Optimization) de un negocio local.

Tu tarea es generar una lista de 2 preguntas naturales que podría hacer un usuario en un buscador conversacional como ChatGPT, con el objetivo de descubrir un negocio con las siguientes características:

Nombre del negocio: {{brandName}}
Descripción: {{brandDescription}}
Ubicación: {{location}}

Instrucciones clave:
- Las preguntas deben sonar naturales, como si las hiciera un usuario real explorando o pidiendo recomendaciones.
- No incluyas el nombre del negocio en ninguna pregunta.
- Simula a una persona que aún no conoce el negocio, pero que busca algo como eso.
- Las preguntas deben estar enfocadas en descubrir lugares con características como las del negocio.
- Varía el estilo de las preguntas (algunas directas, otras más conversacionales).

Devuelve **solo un arreglo JSON con 10 strings**, como este:

[
  "¿Dónde puedo comer sushi vegano en Santiago?",
  "¿Qué restaurante vegano tiene delivery en Santiago centro?",
  ...
]

`

export const analysisPrompt = `Actúa como un sistema que evalúa la visibilidad de un negocio en respuestas generadas por modelos de lenguaje.

Tu objetivo es ayudar a monitorear el rendimiento AEO (Answer Engine Optimization) de una empresa usando modelos LLM.

A continuación te entregaré una pregunta que haría un usuario buscando recomendaciones reales.

{{question}}

1. Responde como si un usuario real te la hubiera hecho. Genera una respuesta completa, natural y útil, recomendando lugares que el modelo recuerde como reales, relevantes y conocidos en la zona correspondiente.

2. Solo incluye nombres reales obtenidos de Google Search segun el contexto que te entrego.

3. Después de cada respuesta, extrae el "ranking": una lista ordenada de los nombres de lugares mencionados en la respuesta, exactamente en el orden en que fueron nombrados.

Devuélveme un arreglo JSON donde con los nombres de lugares mencionados para cada pregunta, en el orden que aparecen en la respuesta.

Si la pregunta no tiene lugares relevantes reales, incluye un arreglo vacío para esa pregunta.

Ejemplo de formato:

  ["Restaurante A", "Restaurante B", "Restaurante C"],

IMPORTANTE: No incluyas explicaciones, introducciones ni justificaciones. Solo el arreglo JSON.`;