import { useState } from 'react';
import { findPosition } from '../utils';
const ModelDetail = ({ model, ranking, brandName}) => {

    const [showRanking, setShowRanking] = useState(false);

    return (
      <div className="flex flex-col gap-2  p-4 rounded-lg">
          <div className="text-gray-800 text-2xl bg-white text-blue-900 border-2 border-blue-900 p-2 rounded-lg  text-center w-full font-bold">
            <div>
                {model}
            </div>
          <div className="text-gray-800 text-2xl bg-white text-blue-900  p-2 rounded-lg  text-center w-full font-bold">
                <div id={findPosition(ranking, brandName)}></div>
          </div>
          <p onClick={() => setShowRanking(!showRanking)} className=" underline text-sm cursor-pointer">{showRanking ? "Ocultar ranking" : "Ver ranking completo"}</p>
          {showRanking && (
                <div className="flex flex-col gap-2 items-start px-1 mt-2">
                    {ranking.map((item, index) => (
                        <p key={index} className={`${index >= 3 ? 'text-sm' : 'text-lg'}`}>
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
  