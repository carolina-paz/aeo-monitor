/* eslint-disable no-unused-vars */

import './App.css'
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
import { askChatGPT, askClaude, askGemini, askPerplexity } from './utils';
import Logo from './assets/logo.png';
import { useState } from 'react';

function App() {


  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  
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
    <div className="min-h-screen bg-gray-800 py-8">
      <div className=" mx-auto px-4">
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
        
        {analyzed && <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={(e) => handleSubmit(e)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              ChatGPT
            </button>
            <button 
              onClick={(e) => handleClaude(e)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Claude
            </button>
            <button 
              onClick={(e) => handleGemini(e)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Gemini
            </button>
            <button 
              onClick={(e) => handlePerplexity(e)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Perplexity
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm">
              Haz clic en cualquiera de los botones para probar los diferentes modelos de IA
            </p>
          </div>
        </div>
        }
        </div>
    </div>
  )
}

export default App
