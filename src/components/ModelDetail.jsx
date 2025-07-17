import { useState } from 'react';
// import { findPosition } from '../utils';

// Function to normalize text (remove accents and convert to lowercase)
const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const ModelDetail = ({ model, ranking, brandName}) => {

    const [showRanking, setShowRanking] = useState(false);

    // Find the index of brandName in the ranking
    const brandIndex = ranking.findIndex(item => normalizeText(item).includes(normalizeText(brandName)));
    const brandPosition = brandIndex !== -1 ? brandIndex + 1 : "No presente";

    // Function to create Google search URL
    const createGoogleSearchUrl = (searchTerm) => {
        const encodedTerm = encodeURIComponent(searchTerm);
        return `https://www.google.com/search?q=${encodedTerm}`;
    };

    if (ranking.length === 0) {
        return (
            <div className="flex flex-col gap-2 p-2 md:p-4 rounded-lg">
                <div className="text-gray-800 text-lg md:text-2xl bg-white text-blue-900 border-2 border-blue-900 p-2 rounded-lg text-center w-full font-bold">
                    {model}
                </div>
            </div>
        );
    }
    return (
      <div className="flex flex-col gap-2 p-2 md:p-4 rounded-lg">
          <div className="text-gray-800 text-lg md:text-2xl bg-white text-blue-900 border-2 border-blue-900 p-2 rounded-lg text-center w-full font-bold">
            <div>
                {model}
            </div>
            <div className="text-gray-800 text-lg md:text-2xl bg-white text-blue-900 p-2 rounded-lg text-center w-full font-bold">
                <div className={brandPosition !== "No presente" ? "text-green-600" : "text-red-800"}>{brandPosition !== "No presente" ? `#${brandPosition}` : brandPosition}</div>
            </div>
            <p onClick={() => setShowRanking(!showRanking)} className="underline text-sm text-gray-500 cursor-pointer">{showRanking ? "Ocultar ranking" : "Ver ranking completo"}</p>
            {showRanking && ranking.length > 0 && (
                <div className="flex flex-col gap-1  md:gap-2 items-start underline text-left px-1 mt-2">
                    {ranking.map((item, index) => (
                        <a 
                            key={index} 
                            href={createGoogleSearchUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold  text-black !text-black truncate w-full hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-200 no-underline visited:text-black"
                        >
                            {index + 1}. {item}
                        </a>
                    ))}
                </div>
            )}
          </div>
      </div>
    );
  };
  
  export default ModelDetail;
  