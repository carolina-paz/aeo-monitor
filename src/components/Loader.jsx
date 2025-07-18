/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

const Loader = () => { //ranking is an array of arrays ranking

const messages = [
    {title: "Hoy tus clientes buscan respuestas, no solo páginas web",
        text: "Tu negocio puede destacarse si aparece en esas respuestas."
    },
    {title: "Eso se llama AEO: Answer Engine Optimization.",
        text: "Es como el SEO, pero para asistentes y buscadores que responden preguntas."
    },
    {title: "Con solo el nombre y descripción de tu negocio…",
        text: "Nuestra IA genera preguntas que un usuario podría hacer para encontrarte."
    },
    {title: "Después analizamos si tu marca aparece como respuesta.",
        text: "Y te mostramos un ranking fácil de entender."
    },
    {title: "Así descubres oportunidades para mejorar tu visibilidad online.",
        text: "Y conectar mejor con quienes necesitan lo que ofreces."
    },
    {title: "Estamos generando tu análisis ahora mismo...",
        text: "¡En breve vas a ver resultados hechos a medida para tu negocio!"
    }
]

const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
  const interval = setInterval(() => {
    setIsVisible(false);
    
    setTimeout(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      setIsVisible(true);
    }, 500); // Half second for fade out
  }, 6000); // 6 seconds per message

  return () => clearInterval(interval);
}, [messages.length]);

  return (
    <div className="flex flex-col  w-[80%]  justify-center items-center" >
          <div className="mt-12  rounded-xl w-[80%] flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>

            <div>
             <div 
               className={`flex flex-col gap-2 items-center mx-auto text-white text-lg mt-2 w-full text-center transition-opacity duration-500 ${
                 isVisible ? 'opacity-100' : 'opacity-0'
               }`}
             >
                 <div className="font-bold">{messages[currentMessageIndex].title}</div>
                 <div className="text-md">{messages[currentMessageIndex].text}</div>
             </div>
            </div>

          </div>
    </div>
  );
};

export default Loader;
