import { useState } from "react";
import TextDisplay from "./components/TextDisplay";
import stringSimilarity from "string-similarity-js";

function App() {
  const [text, setText] = useState("");
  const [optimizedText, setoptimizedText] = useState<{ sentences: { text: string; similarity: number; similarTo: number | null }[]; separators: string[] }>({ sentences: [], separators: [] });

  const handleOptimize = () => {
    const regex = /([^.!?;]+[.!?;])(\s*)/g;
    const matches = [...text.matchAll(regex)];

    let sentences = matches.map(m => m[1]);
    let separators = matches.map(m => m[2]);

    const lastMatch = matches.length ? matches[matches.length - 1] : null;
    const lastIndex = lastMatch ? lastMatch.index! + lastMatch[0].length : 0;
    if (text.slice(lastIndex).trim().length > 0) {
      sentences.push(text.slice(lastIndex).trim());
      separators.push("");
    }

    const results: { text: string; similarity: number; similarTo: number | null }[] = [];

    const stripLastChar = (s: string) => s.length > 0 ? s.replace(/[.!?;]$/, "") : s;

    for (let i = 0; i < sentences.length; i++) {
      let maxSimilarity = 0;
      let similarTo: number | null = null;
      const base = stripLastChar(sentences[i]);

      for (let j = 0; j < sentences.length; j++) {
        if (i !== j) {
          const compare = stripLastChar(sentences[j]);
          const similarity = stringSimilarity(base, compare);

          if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            similarTo = j;
          }
        }
      }
      results.push({ text: sentences[i], similarity: maxSimilarity, similarTo });
    }

    setoptimizedText({ sentences: results, separators });
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
          onClick={handleOptimize}
        >
          Optimize
        </button>
        <TextDisplay sentences={optimizedText.sentences} separators={optimizedText.separators} />
      </div>
    </>
  );
}

export default App;