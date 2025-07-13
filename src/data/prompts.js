export const questionsCreationPtompt = `Actúa como un experto en Answer Engine Optimization (AEO) y generación de contenido útil para modelos de lenguaje. 

Tu tarea es generar una lista de 10 preguntas naturales que podría hacer un usuario en una herramienta como ChatGPT o un buscador conversacional, con el objetivo de descubrir un negocio como el siguiente:

Nombre del negocio: {{nombre}}
Descripción: {{descripción}}
Ubicación: {{ubicación}}

Simula preguntas reales, variadas, que cubran intenciones de búsqueda como:
- Descubrir nuevas opciones (exploración general)
- Buscar una recomendación directa
- Comparar entre alternativas
- Consultar sobre características específicas del negocio (horarios, delivery, estilo, etc.)
- Buscar lo mejor dentro de una categoría
- Consultas locales o basadas en ubicación

Haz que las preguntas suenen como las escribiría un usuario real en lenguaje conversacional y variado.

Devuélveme **solo un arreglo JSON con las 10 preguntas**, con esta estructura:

[
  "Pregunta 1",
  "Pregunta 2",
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