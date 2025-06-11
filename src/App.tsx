import { useState } from "react";
import { icons } from "./constants/icons";

function App() {
  const [text, setText] = useState("");
  const [optimizedText, setOptimizedText] = useState("");

  const optimizeText = () => {
    setOptimizedText(text);
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h1 className="text-5xl font-bold mt-14">Text Optimizer</h1>
        <textarea
          className="mt-14 w-1/2 p-4 bg-white rounded-lg shadow text-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[3rem]"
          name="textInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
        />
        <button
          className="cursor-pointer mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          onClick={optimizeText}
        >
          Optimize
        </button>
        {optimizedText && (
          <div className="mt-8 w-1/2 p-4 bg-white rounded-lg shadow text-gray-800 whitespace-pre-wrap">
            <img src={icons.copy}/>
            {optimizedText}
          </div>
        )}
      </div>
    </>
  );
}

export default App
