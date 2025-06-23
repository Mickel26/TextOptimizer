import { useState } from "react";
import TextDisplay from "./components/TextDisplay";
import stringSimilarity from "string-similarity-js";

function App() {
  const [text, setText] = useState("");
  const [optimizedText, setoptimizedText] = useState<{ sentences: { text: string; similarity: number; similarTo: number | null }[]; separators: string[] }>({ sentences: [], separators: [] });
  const [fixedText, setFixedText] = useState<string>("");

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
      const base = stripLastChar(sentences[i]).toLowerCase();

      for (let j = 0; j < sentences.length; j++) {
        if (i !== j) {
          const compare = stripLastChar(sentences[j]).toLowerCase();
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
    setFixedText("");
  };

  const handleFix = (fixed: string) => {
    setFixedText(fixed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mt-14 mb-10 text-blue-700 drop-shadow-lg tracking-tight">Text Optimizer</h1>
      {/* Bigger input area */}
      <div className="flex flex-col items-center w-full max-w-6xl mb-10">
        <textarea
          className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg text-gray-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y min-h-[12rem] text-lg transition"
          name="textInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          placeholder="Paste or type your text here..."
        />
        <button
          className="cursor-pointer mt-6 px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-semibold rounded-xl shadow-md hover:from-blue-700 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          onClick={handleOptimize}
        >
          Optimize
        </button>
      </div>
      {/* Results area below input, side by side and equal size */}
      <div className="flex flex-row w-full max-w-6xl gap-10 justify-center items-start">
        <div className="flex-1 flex flex-col items-center min-h-[32rem]">
          <TextDisplay
            sentences={optimizedText.sentences}
            separators={optimizedText.separators}
            optimized={optimizedText.sentences.length > 0}
            onFix={handleFix}
          />
        </div>
        {fixedText && (
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-blue-100 h-full flex flex-col min-h-[32rem]">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Fixed Text</h2>
            <div className="whitespace-pre-wrap text-lg text-gray-800 flex-1">{fixedText}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;