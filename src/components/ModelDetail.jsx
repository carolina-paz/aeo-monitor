import { useState } from 'react';
// import { findPosition } from '../utils';
const ModelDetail = ({ model, ranking, brandName}) => {

    const [showRanking, setShowRanking] = useState(false);

    // Find the index of brandName in the ranking
    const brandIndex = ranking.findIndex(item => item.includes(brandName));
    const brandPosition = brandIndex !== -1 ? brandIndex + 1 : "No presente";

    if (ranking.length === 0) {
        return (
            <div className="flex flex-col gap-2  p-4 rounded-lg">
                <div className="text-gray-800 text-2xl bg-white text-blue-900 border-2 border-blue-900 p-2 rounded-lg  text-center w-full font-bold">
                    {model}
                </div>
            </div>
        );
    }
    return (
      <div className="flex flex-col gap-2  p-4 rounded-lg">
          <div className="text-gray-800 text-2xl bg-white text-blue-900 border-2 border-blue-900 p-2 rounded-lg  text-center w-full font-bold">
            <div>
                {model}
            </div>
          <div className="text-gray-800 text-2xl bg-white text-blue-900  p-2 rounded-lg  text-center w-full font-bold">
                <div className={brandPosition !== "No presente" ? "text-green-600" : "text-red-600"}>{brandPosition !== "No presente" ? `#${brandPosition}` : brandPosition}</div>
          </div>
          <p onClick={() => setShowRanking(!showRanking)} className=" underline text-sm cursor-pointer">{showRanking ? "Ocultar ranking" : "Ver ranking completo"}</p>
          {showRanking && ranking.length > 0 && (
                <div className="flex flex-col gap-2 items-start text-left px-1 mt-2">
                    {ranking.map((item, index) => (
                        <p key={index} className={`${index >= 3 ? 'text-sm' : 'text-lg'} truncate w-full`}>
                            {index + 1}. {item}
                        </p>
                    ))}
                </div>
            )}
          </div>


      </div>
    );
  };
  
  export default ModelDetail;
  