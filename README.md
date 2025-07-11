# AEOMonitor - AI Chat Interface

This project provides a React-based interface to interact with multiple AI models including ChatGPT, Claude, Gemini, and Perplexity.

## Features

- **ChatGPT Integration**: Uses OpenAI's GPT-3.5-turbo model
- **Claude Integration**: Uses Anthropic's Claude-3-Sonnet model
- **Gemini Integration**: Uses Google's Gemini Pro model
- **Perplexity Integration**: Uses Perplexity's Llama-3.1-Sonar model

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Keys Required

- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic API Key**: Get from [Anthropic Console](https://console.anthropic.com/)
- **Google API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Perplexity API Key**: Get from [Perplexity API](https://www.perplexity.ai/settings/api)

## Usage

Click on any of the AI model buttons to test the integration. Each button will send a test question ("Cuentame un chiste") to the respective AI model and display the response in the console.

## Functions

- `askChatGPT(question)`: Sends a question to OpenAI's ChatGPT
- `askClaude(question)`: Sends a question to Anthropic's Claude
- `askGemini(question)`: Sends a question to Google's Gemini
- `askPerplexity(question)`: Sends a question to Perplexity's AI

## Firebase Integration

The project includes Firebase configuration for future database integration. Currently commented out in the code.
