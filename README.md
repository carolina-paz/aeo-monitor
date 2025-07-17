# AEOMonitor - Interfaz de Chat con IA

Este proyecto ofrece una interfaz basada en React para interactuar con múltiples modelos de inteligencia artificial, incluyendo ChatGPT, Claude, Gemini y Perplexity.

## Funcionalidades

- **Integración con ChatGPT**: Utiliza el modelo GPT-3.5-turbo de OpenAI
- **Integración con Claude**: Utiliza el modelo Claude-3-Sonnet de Anthropic
- **Integración con Gemini**: Utiliza el modelo Gemini Pro de Google
- **Integración con Perplexity**: Utiliza el modelo Llama-3.1-Sonar de Perplexity

## Configuración

### 1. Clona el repositorio

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con tus claves de API:

```env
VITE_OPENAI_API_KEY=tu_clave_de_openai_aquí
VITE_ANTHROPIC_API_KEY=tu_clave_de_anthropic_aquí
VITE_GOOGLE_API_KEY=tu_clave_de_google_aquí
VITE_PERPLEXITY_API_KEY=tu_clave_de_perplexity_aquí
VITE_GOOGLE_CX_API_KEY=tu_id_de_búsqueda_de_google_aquí
```

### 4. Ejecuta el servidor de desarrollo

```bash
npm run dev
```

## Uso

1. Completa el formulario con la información de tu marca
2. Haz clic en "Analizar mi marca"
3. El sistema generará una lista de preguntas aleatorias que un posible usuario podría hacer para encontrar un negocio como el que describiste
4. Verás una tabla con la posición de tu negocio en las recomendaciones dadas por el modelo
5. Incluye la opción de ver el ranking completo


*Este modelo está optimizado para el uso en Chile. 

