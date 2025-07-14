/* eslint-disable no-unused-vars */

import './App.css'
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
import { askChatGPT, askClaude, askGemini, askPerplexity, findPosition, cleanAIResponse, generateQuestions } from './utils';
import Logo from './assets/logo.png';
import { useState } from 'react';
import QuestionBlock from './components/QuestionBlock';
import { mockQuestions, Models } from './data/mockData';
import { prompt } from './data/prompts';
function App() {
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [location, setLocation] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [GPTanalysis, setGPTanalysis] = useState([]);
  // const [Claudeanalysis, setClaudeanalysis] = useState([]);
  const [Geminianalysis, setGeminianalysis] = useState([]);
  // const [Perplexityanalysis, setPerplexityanalysis] = useState([]);
  const [fullAnalysis, setFullAnalysis] = useState([]);


  // Use mock data instead of hardcoded object
  const descriptionPlaceholder = `Ej: "Somos una hamburguesería artesanal con opciones veganas, ubicada en Providencia. Abrimos hasta tarde y hacemos delivery por apps."`;
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const questions = await generateQuestions(brandName, brandDescription, location);
      console.log("Questions:", questions);
      setAnalyzed(true);

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
        </div>
    </div>
  )
}

export default App
