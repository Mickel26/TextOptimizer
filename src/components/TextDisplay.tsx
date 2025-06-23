import { useMemo } from "react";

interface TextDisplayProps {
    sentences: { text: string; similarity: number; similarTo: number | null }[];
    separators: string[];
    optimized?: boolean;
    onFix?: (fixed: string) => void; // NEW
}

function getRandomPastelColor(existingHues: Set<number>) {
    let hue: number;
    do {
        hue = Math.floor(Math.random() * 360);
    } while (
        ([...existingHues].some(existing => Math.abs(existing - hue) < 40)) ||
        (hue >= 50 && hue <= 70)
    );
    existingHues.add(hue);
    return `hsl(${hue}, 85%, 72%)`;
}

const TextDisplay = ({ sentences, separators, optimized = false, onFix }: TextDisplayProps) => {
    const outputText = sentences
        .map((s, i) => s.text + (separators && separators[i] ? separators[i] : ""))
        .join("");

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText);
    };
    
    const highlightColors = useMemo(() => {
        const map = new Map<number, string[]>();
        const usedHues = new Set<number>();
        const pairColors: string[][] = [];
        sentences.forEach((sentence, idx) => {
            if (
                sentence.similarity > 0.5 &&
                sentence.similarTo !== null
            ) {
                const pairKey = [Math.min(idx, sentence.similarTo), Math.max(idx, sentence.similarTo)].join("-");
                if (!pairColors.some(([k]) => k === pairKey)) {
                    const color = getRandomPastelColor(usedHues);
                    pairColors.push([pairKey, color]);
                }
            }
        });
        pairColors.forEach(([pairKey, color]) => {
            const [a, b] = pairKey.split("-").map(Number);
            map.set(a, [...(map.get(a) || []), color]);
            map.set(b, [...(map.get(b) || []), color]);
        });
        return map;
    }, [sentences]);

    const legendData = useMemo(() => {
        const seenPairs = new Set<string>();
        const legend: { color: string; indices: [number, number]; percentage: number }[] = [];
        sentences.forEach((sentence, idx) => {
            if (
                sentence.similarity > 0.5 &&
                sentence.similarTo !== null
            ) {
                const pairKey = [Math.min(idx, sentence.similarTo), Math.max(idx, sentence.similarTo)].join("-");
                if (!seenPairs.has(pairKey)) {
                    seenPairs.add(pairKey);
                    const colorArr = highlightColors.get(idx) || [];
                    legend.push({
                        color: colorArr[0] || "#eee",
                        indices: [idx, sentence.similarTo],
                        percentage: Math.round(sentence.similarity * 100),
                    });
                }
            }
        });
        return legend;
    }, [sentences, highlightColors]);

    const handleFix = () => {
        const fixedText = sentences.map(s => s.text).join("") + (separators ? separators.join("") : "");
        navigator.clipboard.writeText(fixedText);
        if (onFix) {
            onFix(fixedText); // Send fixed text to parent
        }
    };

    return (
        <div className="mt-6 p-4 bg-white rounded-lg shadow text-gray-800 whitespace-pre-wrap">
            {legendData.length > 0 ? (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Legend</h2>
                    <ul className="flex flex-row flex-wrap gap-4 justify-center mb-4">
                        {legendData.map((item, i) => (
                            <li key={i} className="flex items-center">
                                <span
                                    className="inline-block w-6 h-6 rounded mr-2 border"
                                    style={{ background: item.color }}
                                ></span>
                                <span className="text-sm">
                                    Sentences <b>{item.indices[0] + 1}</b> &amp; <b>{item.indices[1] + 1}</b> — <b>{item.percentage}%</b> similarity
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                optimized && (
                    <div className="mb-3 text-center text-green-600 font-semibold">
                        ✅ No similar sentence pairs found. Everything is fine!
                    </div>
                )
            )}

            {sentences.map((sentence, index) => {
                const colorArr = highlightColors.get(index) || [];
                let style = {};
                if (colorArr.length === 1) {
                    style = { background: colorArr[0], fontWeight: 600 };
                } else if (colorArr.length > 1) {
                    const stops = colorArr.map((color, i) => {
                        const start = Math.round((i / colorArr.length) * 100);
                        const end = Math.round(((i + 1) / colorArr.length) * 100);
                        return `${color} ${start}%, ${color} ${end}%`;
                    }).join(", ");
                    style = {
                        background: `linear-gradient(90deg, ${stops})`,
                        fontWeight: 600,
                    };
                }

                return (
                    <span
                        key={index}
                        className="rounded"
                        style={style}
                    >
                        <span>
                            {sentence.text}
                        </span>
                        {separators && separators[index] ? separators[index] : ""}
                    </span>
                );
            })}
            {optimized && legendData.length > 0 && (
                <div className="flex justify-center">
                    <button
                        className="cursor-pointer mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                        onClick={handleFix}
                    >
                        Fix it
                    </button>
                </div>
            )}
            {/* <div className="flex justify-center">
                <button
                    className="cursor-pointer mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    onClick={handleCopy}
                >
                    Copy
                </button>
            </div> */}
        </div>
    );
};

export default TextDisplay;