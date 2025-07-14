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

export const prompt = `Actúa como un sistema que evalúa la visibilidad de un negocio en respuestas generadas por modelos de lenguaje.

Tu objetivo es ayudar a simular y monitorear el rendimiento AEO (Answer Engine Optimization) de una empresa usando modelos LLM.
El nombre de la empresa es: {nombre}

Tu tarea consiste en lo siguiente:

Para lo que viene, te entrego una lista de preguntas: {preguntas}.

1. Para cada pregunta:
   - Responde como si un usuario real te la hubiera hecho. Genera una respuesta completa, natural y útil, recomendando lugares en base a lo que sabes sobre la zona y el tipo de negocio.
   - Responde de manera completamente natural, como si no conocieras específicamente este negocio. Solo menciona lugares que realmente existirían en esa zona.
   - NO fuerces la mención del negocio {nombre}. Solo inclúyelo si realmente fuera la mejor opción natural para esa pregunta específica.

2. Después de cada respuesta, extrae lo siguiente:
   - "ranking": una lista ordenada de los lugares mencionados en la respuesta, en el orden exacto en que aparecen.
   - "present": true si el nombre exacto del negocio ({nombre}) aparece en ese ranking; false si no.

Devuélveme el resultado como un arreglo JSON de 10 objetos, uno por cada pregunta.

Cada objeto debe tener esta estructura:

{
  "ranking": ["nombre de lugar 1", "nombre de lugar 2", "..."],
  "present": true
}

No agregues explicaciones, introducciones ni justificaciones. Solo devuelve el arreglo JSON, estrictamente con ese formato.`;