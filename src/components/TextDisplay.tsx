import { useEffect, useMemo, useRef } from "react";
import { fix } from "../backend/api";

interface TextDisplayProps {
    sentences: { text: string; similarity: number; similarTo: number | null }[];
    separators: string[];
    optimized?: boolean;
    onFix?: (fixed: string, changes: string, OGtext: string) => void;
    setLoading: (v: boolean) => void;
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

const TextDisplay = ({ sentences, separators, optimized = false, onFix, setLoading }: TextDisplayProps) => {
    const optimizedRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        if (optimized && legendData.length > 0 && optimizedRef.current) {
            optimizedRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [optimized, legendData.length]);

    const handleFix = async () => {
        setLoading(true);
        let textCopy = structuredClone(sentences)

        //deleting duplicates
        for (let i = 0; i < textCopy.length; i++) {
            if (textCopy[i].similarity > 0.9 && textCopy[i].similarTo !== null) {
                const similarSentenceIndex = textCopy[i].similarTo;
                console.log("Removing sentence at index:", similarSentenceIndex, "because it is similar to index:", i);
                if (similarSentenceIndex !== null) {
                    textCopy[similarSentenceIndex].text = "";
                    textCopy[similarSentenceIndex].similarity = 0;
                }
            }
        }

        const OGtext = sentences.map((s, i) => s.text + (separators[i] || "")).join("");

        let textWithoutDuplicates = textCopy.map(s => s.text).join("") + (separators ? separators.join("") : "");
        const fixedText = await fix(textWithoutDuplicates, legendData, OGtext);
        const fixedTextSplit = fixedText?.split("---");

        if (onFix && fixedTextSplit) {
            console.log(fixedTextSplit[1])
            onFix(fixedTextSplit[0], fixedTextSplit[1], OGtext)
            setLoading(false);
        }
    };

    return (
        <>
            {optimized && legendData.length > 0 && (
                <div ref={optimizedRef} className="mt-6 bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-gray-800 whitespace-pre-wrap w-full">
                    <div className="mb-6">
                        <ul className="flex flex-row flex-wrap gap-4 justify-center mb-4">
                            {legendData.map((item, i) => (
                                <li key={i} className="flex items-center">
                                    <span
                                        className="inline-block w-6 h-6 rounded mr-2 border"
                                        style={{ background: item.color }}
                                    ></span>
                                    <span className="text-lg text-gray-800">
                                        Sentences <b>{item.indices[0] + 1}</b> &amp; <b>{item.indices[1] + 1}</b> — <b>{item.percentage}%</b> similarity
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-2">
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
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="cursor-pointer mt-8 px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-semibold rounded-xl shadow-md hover:from-blue-700 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                            onClick={handleFix}
                        >
                            Fix it
                        </button>
                    </div>
                </div>
            )}
            {optimized && legendData.length === 0 && (
                <div className="mt-6 bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-green-700 text-xl font-semibold w-full text-center">
                    ✅ No similar sentence pairs found. Everything is fine!
                </div>
            )}
        </>
    );
};

export default TextDisplay;
