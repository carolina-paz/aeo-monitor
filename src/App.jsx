/* eslint-disable no-unused-vars */

import './App.css'
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
import { askChatGPT, askClaude, askGemini, askPerplexity, findPosition, cleanAIResponse, generateQuestions, askQuestions, askChatGPTWithContext } from './utils';
import Logo from './assets/logo.png';
import { useState } from 'react';
import QuestionBlock from './components/QuestionBlock';
import { googleSearch } from './googleSearch';

function App() {
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [location, setLocation] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [GPTanalysis, setGPTanalysis] = useState([]);
  const [googleSearchResults, setGoogleSearchResults] = useState([]);
  // const [Claudeanalysis, setClaudeanalysis] = useState([]);
  const [Geminianalysis, setGeminianalysis] = useState([]);
  // const [Perplexityanalysis, setPerplexityanalysis] = useState([]);
  const [fullAnalysis, setFullAnalysis] = useState([]);
  const [contextResponse, setContextResponse] = useState('');

  // Función para probar googleSearch
  const testGoogleSearch = async () => {
    if (!brandName.trim()) {
      alert('Por favor ingresa un nombre de marca para probar la búsqueda');
      return;
    }

    try {
      console.log('Probando googleSearch con:', brandName);
      const results = await googleSearch(brandName);
      console.log('Resultados de Google Search:', results);
      setGoogleSearchResults(results);
      
      if (results.length > 0) {
        alert(`Búsqueda exitosa! Se encontraron ${results.length} resultados. Revisa la consola para ver los detalles.`);
      } else {
        alert('No se encontraron resultados para esta búsqueda.');
      }
    } catch (error) {
      console.error('Error en testGoogleSearch:', error);
      alert(`Error al probar Google Search: ${error.message}`);
    }
  };

  // Función para probar askChatGPTWithContext
  const testChatGPTWithContext = async () => {
    if (!brandName.trim()) {
      alert('Por favor ingresa un nombre de marca para probar');
      return;
    }

    if (googleSearchResults.length === 0) {
      alert('Primero debes hacer una búsqueda de Google para obtener contexto');
      return;
    }

    try {
      const prompt = `Analiza la presencia online de "${brandName}" basándote en la información de búsqueda web proporcionada. ¿Qué tan bien posicionada está esta marca en internet? ¿Qué fortalezas y debilidades puedes identificar?`;
      
      console.log('Probando askChatGPTWithContext con:', brandName);
      const response = await askChatGPTWithContext(prompt, googleSearchResults);
      console.log('Respuesta con contexto:', response);
      setContextResponse(response);
      
      alert('Análisis con contexto completado! Revisa la sección de resultados.');
    } catch (error) {
      console.error('Error en testChatGPTWithContext:', error);
      alert(`Error al analizar con contexto: ${error.message}`);
    }
  };


  // Use mock data instead of hardcoded object
  const descriptionPlaceholder = `Ej: "Somos una hamburguesería artesanal con opciones veganas, ubicada en Providencia. Abrimos hasta tarde y hacemos delivery por apps."`;
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const questions = await generateQuestions(brandName, brandDescription, location);
      console.log("Questions:", questions);
      
      console.log("About to call askQuestions...");
      const GPTanalysis = await askQuestions(questions, 'gpt');
      console.log("GPTanalysis received:", GPTanalysis);
      setGPTanalysis(GPTanalysis);
      console.log("GPTanalysis set in state");
      setAnalyzed(true);
      console.log("Analyzed set to true");

    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert(`Error: ${error.message}`);
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
            <label>Ubicación</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Ej: 'Providencia, Santiago'" className="p-2 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label>Describe tu negocio</label>
            <textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder={descriptionPlaceholder} className=" p-2 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>


          <div className="flex items-center justify-center gap-8 mt-4 ">
            <button onClick={(e) => handleSubmit(e)} className="bg-blue-900 hover:bg-blue-800 cursor-pointer text-white text-2xl font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">Analizar mi marca</button>
            <button onClick={testGoogleSearch} className="bg-green-600 hover:bg-green-500 cursor-pointer text-white text-lg font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">Probar Google Search</button>
            <button onClick={testChatGPTWithContext} className="bg-purple-600 hover:bg-purple-500 cursor-pointer text-white text-lg font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">Analizar con Contexto</button>
          </div>
          
        </div>
        
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
       {analyzed && <div className="mt-12 bg-gray-500 rounded-xl w-[80%] flex flex-col gap-4 shadow-lg p-8">
                    <div className="space-y-4">
          {GPTanalysis.map((question, index) => {
            let position = 0;
            if (question.present) {
              const foundIndex = findPosition(question.ranking, brandName);
              position = foundIndex >= 0 ? foundIndex + 1 : 0;
            }
            
            return (
              <div key={index}>
                <QuestionBlock 
                  question={question.question} 
                  ranking={question.ranking} 
                  position={position}
                />
              </div>
            );
          })}
          </div>
        </div>
        }
        
        {/* Sección de resultados de Google Search */}
        {googleSearchResults.length > 0 && (
          <div className="mt-8 bg-gray-500 rounded-xl w-[80%] flex flex-col gap-4 shadow-lg p-8">
            <div className="text-white text-2xl font-semibold mb-4">
              Resultados de Google Search para "{brandName}"
            </div>
            <div className="space-y-4">
              {googleSearchResults.map((result, index) => (
                <div key={index} className="bg-gray-600 rounded-lg p-4">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-gray-200 text-sm mb-2">{result.link}</p>
                  <p className="text-gray-300">{result.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Sección de análisis con contexto */}
        {contextResponse && (
          <div className="mt-8 bg-gray-500 rounded-xl w-[80%] flex flex-col gap-4 shadow-lg p-8">
            <div className="text-white text-2xl font-semibold mb-4">
              Análisis con Contexto Web para "{brandName}"
            </div>
            <div className="bg-gray-600 rounded-lg p-6">
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {contextResponse}
              </div>
            </div>
          </div>
        )}
        </div>
    </div>
  )
}

export default App
