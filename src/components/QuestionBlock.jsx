/* eslint-disable no-unused-vars */
import ModelDetail from './ModelDetail';
import { Models, mockRanking } from '../data/mockData';
const QuestionBlock = ({ question }) => {
  return (
    <div className="flex flex-col gap-2 bg-[#1E2938] p-4 rounded-lg shadow-xl" >
        <div className="text-white text-2xl font-bold">
            {question}
        </div>
<div className="flex justify-between    ">
    {Models.map((model) => (
        <div className="w-1/4">
            <ModelDetail model={model} position={1}  ranking={mockRanking}/>
        </div>
    ))}
</div>

    </div>
  );
};

export default QuestionBlock;
