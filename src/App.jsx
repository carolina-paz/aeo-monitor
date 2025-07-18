/* eslint-disable no-unused-vars */

import './App.css'
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
import {  findPosition,  generateQuestions,  askChatGPTWithContext, askGeminiWithContext, askClaudeWithContext, askPerplexityWithContext } from './utils';
import Logo from './assets/logo.png';
import { useState } from 'react';
import QuestionBlock from './components/QuestionBlock';
import { googleSearch } from './googleSearch';
import ModelDetail from './components/ModelDetail';
function App() {
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [location, setLocation] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [GPTanalysis, setGPTanalysis] = useState([]);
  const [GeminiAnalysis, setGeminiAnalysis] = useState([]);
  const [ClaudeAnalysis, setClaudeAnalysis] = useState([]);
  const [PerplexityAnalysis, setPerplexityAnalysis] = useState([]);
  const [questions, setQuestions] = useState([]);
  // const [Claudeanalysis, setClaudeanalysis] = useState([]);
  // const [Perplexityanalysis, setPerplexityanalysis] = useState([]);


  // Use mock data instead of hardcoded object
  const descriptionPlaceholder = `Ej: "Somos una hamburguesería artesanal con opciones veganas, ubicada en Providencia. Abrimos hasta tarde y hacemos delivery por apps."`;
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Generar las preguntas
      const questions = await generateQuestions(brandName, brandDescription, location);
      console.log("Questions:", questions);
      setQuestions(questions);
      
      // 2. Por cada pregunta, obtener resultados de Google y usar askChatGPTWithContext y askGeminiWithContext
      const allGPTAnalyses = [];
      const allGeminiAnalyses = [];
      const allClaudeAnalyses = [];
      const allPerplexityAnalyses = [];
      
      for (const question of questions) {
        console.log("Processing question:", question);
        
        // Obtener resultados de Google para esta pregunta específica
        const googleResults = await googleSearch(question, location);
        console.log("Google results for question:", googleResults);
        
        // Obtener análisis de GPT para esta pregunta específica
        const questionGPTAnalysis = await askChatGPTWithContext(question, googleResults);
        console.log("GPT analysis for question:", questionGPTAnalysis);
        
        // Obtener análisis de Gemini para esta pregunta específica
        const questionGeminiAnalysis = await askGeminiWithContext(question, googleResults);
        console.log("Gemini analysis for question:", questionGeminiAnalysis);
        
        // Obtener análisis de Claude para esta pregunta específica
        const questionClaudeAnalysis = await askClaudeWithContext(question, googleResults);
        console.log("Claude analysis for question:", questionClaudeAnalysis);
        
        // Obtener análisis de Perplexity para esta pregunta específica
        const questionPerplexityAnalysis = await askPerplexityWithContext(question, googleResults);
        console.log("Perplexity analysis for question:", questionPerplexityAnalysis);
        
        // Agregar los análisis de esta pregunta a los arreglos
        allGPTAnalyses.push(questionGPTAnalysis);
        allGeminiAnalyses.push(questionGeminiAnalysis);
        allClaudeAnalyses.push(questionClaudeAnalysis);
        allPerplexityAnalyses.push(questionPerplexityAnalysis);
      }
      
      // 3. Loguear los arreglos con todos los análisis
      console.log("Arreglo con todos los análisis GPT:", allGPTAnalyses);
      console.log("Arreglo con todos los análisis Gemini:", allGeminiAnalyses);
      console.log("Arreglo con todos los análisis Claude:", allClaudeAnalyses);
      console.log("Arreglo con todos los análisis Perplexity:", allPerplexityAnalyses);
      
      // Guardar todos los análisis en el estado
      setGPTanalysis(allGPTAnalyses);
      setGeminiAnalysis(allGeminiAnalyses);
      setClaudeAnalysis(allClaudeAnalyses);
      setPerplexityAnalysis(allPerplexityAnalyses);
      console.log("All analyses set in state");
      setAnalyzed(true);
      console.log("Analyzed set to true");

    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col  w-full bg-gray-800 py-8 pb-16">
      <div className="flex flex-col items-center justify-center px-4">
        <div className="flex items-center justify-center mb-8">
          <img src={Logo} alt="logo" className="w-[200px] h-[200px] mr-4" />

        </div>
        <div className="text-start text-lg mb-8 flex flex-col w-full items-center justify-center">
        <div className="flex flex-col gap-2 w-1/2 mb-4">
            <label>Nombre de tu marca</label>
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} type="text"  placeholder="Ej: 'La hamburguesería'" className="p-2 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>
          <div className="flex flex-col gap-2 w-1/2 mb-4">
            <label>Ubicación <span className="text-xs italic text-gray-400">(opcional)</span></label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Ej: 'Providencia, Santiago'" className="p-2 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label>Describe tu negocio <span className="text-xs italic text-gray-400">(Mientras más detallado, mejor)</span></label>
            <textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder={descriptionPlaceholder} className=" p-2 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>


          <div className="flex items-center justify-center gap-8 mt-4 ">
            <button 
              onClick={(e) => handleSubmit(e)} 
              disabled={isLoading}
              className={`text-2xl font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${
                isLoading 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                  : 'bg-blue-900 hover:bg-blue-800 cursor-pointer text-white'
              }`}
            >
              {isLoading ? 'Analizando...' : 'Analizar mi marca'}
            </button>
      
          </div>
          
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 bg-gray-500 rounded-xl w-[80%] flex flex-col items-center justify-center shadow-lg p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
            <div className="text-white text-xl font-semibold">Analizando tu marca...</div>
            <div className="text-white text-md mt-2 w-2/3 text-center">El AEO mide qué tan bien se posiciona tu negocio en las respuestas de buscadores y asistentes como ChatGPT. Te dará una idea clara de qué tan visible eres para quienes buscan productos o servicios como el tuyo.</div>
            <div className="text-white text-sm mt-2 italic">Esto puede tomar unos minutos</div>
          </div>
        )}
        
        {/* {analyzed && <div className="flex flex-col gap-4">
          <div className="text-white text-2xl font-semibold">
            Análisis de tu marca
          </div>
          <div className="text-white text-base">
            {brandDescription}
          </div>
        </div>
        } */}
        
        {/* Test Section for QuestionBlock Component */}
       {analyzed && !isLoading && <div className="mt-12 bg-gray-700 rounded-xl w-[80%] flex flex-col gap-4 shadow-lg p-8">
                    <div className="space-y-4">
          {questions.map((question, index) => {
            // Crear el objeto rankings con la estructura correcta
            const rankings = {
              "ChatGPT": GPTanalysis[index] || [],
              "Gemini": GeminiAnalysis[index] || [],
              "Claude": ClaudeAnalysis[index] || [],
              "Perplexity": PerplexityAnalysis[index] || []
            };
            
            return (
              <div key={index}>
                <QuestionBlock 
                  question={question} 
                  rankings={rankings} 
                  brandName={brandName} 
                />
              </div>
            );
          })}
          </div>
        </div>
        }

        </div>
    </div>
  )
}

export default App
