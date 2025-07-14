export const questionsCreationPrompt = `Actúa como un experto en generación de preguntas útiles para analizar el rendimiento AEO (Answer Engine Optimization) de un negocio local.

Tu tarea es generar una lista de 10 preguntas naturales que podría hacer un usuario en un buscador conversacional como ChatGPT, con el objetivo de descubrir un negocio con las siguientes características:

Nombre del negocio: {{brandName}}
Descripción: {{brandDescription}}
Ubicación: {{location}}

Instrucciones clave:
- Las preguntas deben sonar naturales, como si las hiciera un usuario real explorando o pidiendo recomendaciones.
- No incluyas el nombre del negocio en ninguna pregunta.
- Simula a una persona que aún no conoce el negocio, pero que busca algo como eso.
- Las preguntas deben estar enfocadas en descubrir restaurantes o lugares gastronómicos con características como las del negocio.
- No incluyas preguntas que no estén relacionadas con comida, restaurantes o delivery.
- Varía el estilo de las preguntas (algunas directas, otras más conversacionales).
- Deben incluir términos o ideas como: vegano, sushi, postres, comida fresca, delivery, restaurantes con estilo, comida saludable, Santiago, etc.

Devuelve **solo un arreglo JSON con 10 strings**, como este:

[
  "¿Dónde puedo comer sushi vegano en Santiago?",
  "¿Qué restaurante vegano tiene delivery en Santiago centro?",
  ...
]

`

export const analysisPrompt = `Actúa como un sistema que evalúa la visibilidad de un negocio en respuestas generadas por modelos de lenguaje.

Tu objetivo es ayudar a simular y monitorear el rendimiento AEO (Answer Engine Optimization) de una empresa usando modelos LLM.

A continuación te entregaré una lista de preguntas que haría un usuario buscando recomendaciones reales.

{{questions}}

Para cada pregunta:

1. Responde como si un usuario real te la hubiera hecho. Genera una respuesta completa, natural y útil, recomendando lugares que el modelo recuerde como reales, relevantes y conocidos en la zona correspondiente.

2. Solo incluye nombres de lugares reales que ya conozcas como modelo. No inventes nombres. Si no puedes recordar lugares reales relevantes para una pregunta, responde con lo que sepas sin inventar.

3. Después de cada respuesta, extrae el "ranking": una lista ordenada de los nombres de lugares mencionados en la respuesta, exactamente en el orden en que fueron nombrados.

Devuélveme un arreglo JSON donde cada elemento sea un arreglo con los nombres de lugares mencionados para cada pregunta, en el orden que aparecen en la respuesta.

Si una pregunta no tiene lugares relevantes reales, incluye un arreglo vacío para esa pregunta.

Ejemplo de formato para 3 preguntas:

[
  ["Restaurante A", "Restaurante B", "Restaurante C"],
  ["Café X", "Restaurante Y"],
  []
]

IMPORTANTE: No incluyas explicaciones, introducciones ni justificaciones. Solo el arreglo JSON.`;