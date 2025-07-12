/* eslint-disable no-unused-vars */

import './App.css'
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
import { askChatGPT, askClaude, askGemini, askPerplexity } from './utils';
import Logo from './assets/logo.png';
import { useState } from 'react';
import QuestionBlock from './components/QuestionBlock';
import { mockQuestions, Models } from './data/mockData';

function App() {


  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  // Use mock data instead of hardcoded object
  const descriptionPlaceholder = `Ej: "Somos una hamburguesería artesanal con opciones veganas, ubicada en Providencia. Abrimos hasta tarde y hacemos delivery por apps."`
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const question = "Cuentame un chiste";
      console.log("Sending question:", question);
      const answer = await askChatGPT(question);
      console.log("Received answer:", answer);
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert(`Error: ${error.message}`);
    }
    // try {
    //   const docRef = await addDoc(collection(db, "questions"), {
    //     question: question,
    //     answer: answer,
    //     timestamp: new Date(),
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (error) {
    //   console.error("Error adding document: ", error);
    // }
  };

  const handleClaude = async (e) => {
    e.preventDefault();
    try {
      const question = "Cuentame un chiste";
      console.log("Sending question to Claude:", question);
      const answer = await askClaude(question);
      console.log("Received answer from Claude:", answer);
    } catch (error) {
      console.error("Error en handleClaude:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleGemini = async (e) => {
    e.preventDefault();
    try {
      const question = "Cuentame un chiste";
      console.log("Sending question to Gemini:", question);
      const answer = await askGemini(question);
      console.log("Received answer from Gemini:", answer);
    } catch (error) {
      console.error("Error en handleGemini:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handlePerplexity = async (e) => {
    e.preventDefault();
    try {
      const question = "Cuentame un chiste";
      console.log("Sending question to Perplexity:", question);
      const answer = await askPerplexity(question);
      console.log("Received answer from Perplexity:", answer);
    } catch (error) {
      console.error("Error en handlePerplexity:", error);
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
          <div className="flex flex-col gap-2 w-1/2">
            <label>Describe tu negocio</label>
            <textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder={descriptionPlaceholder} className=" p-2 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>


          <div className="flex items-center justify-center gap-8 mt-4 ">
            <button className="bg-blue-900 hover:bg-blue-800 cursor-pointer text-white text-2xl font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">Analizar mi marca</button>
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
        <div className="mt-12 bg-gray-500 rounded-xl w-[80%] flex flex-col gap-4 shadow-lg p-8">
                    <div className="space-y-4">
            <QuestionBlock question={mockQuestions[0].question} />
          </div>
        </div>
        </div>
    </div>
  )
}

export default App
