
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
import { askChatGPT, askClaude, askGemini, askPerplexity } from './utils';
function App() {

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
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={(e) => handleSubmit(e)}>
          ChatGPT
        </button>
        <button onClick={(e) => handleClaude(e)}>
          Claude
        </button>
        <button onClick={(e) => handleGemini(e)}>
          Gemini
        </button>
        <button onClick={(e) => handlePerplexity(e)}>
          Perplexity
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
