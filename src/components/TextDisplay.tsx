import { useState } from "react";

interface TextDisplayProps {
    sentences: { text: string; similarity: number; similarTo: number | null }[];
    separators: string[];
}

const TextDisplay = ({ sentences, separators }: TextDisplayProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="mt-8 w-1/2 p-4 bg-white rounded-lg shadow text-gray-800 whitespace-pre-wrap">
            {sentences.map((sentence, index) => {
                const textColor =
                    sentence.similarity > 0.8
                        ? "text-red-500"
                        : sentence.similarity > 0.5
                        ? "text-yellow-500"
                        : "text-green-500";

                const isHighlighted =
                    hoveredIndex !== null &&
                    sentences[hoveredIndex].similarTo === index &&
                    sentences[hoveredIndex].similarity > 0.5;

                return (
                    <span
                        key={index}
                        className={`${textColor} ${isHighlighted ? "bg-red-200 transition-colors" : ""} rounded`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {sentence.text}
                        {sentence.similarity > 0.5 && sentence.similarTo !== null && (
                            <span className="ml-2 text-xs text-gray-500">
                                ({(sentence.similarity * 100).toFixed(0)}% similar to&nbsp;
                                <em>
                                    {sentences[sentence.similarTo].text}
                                </em>
                                )
                            </span>
                        )}
                        {separators && separators[index] ? separators[index] : ""}
                    </span>
                );
            })}
        </div>
    );
};

export default TextDisplay;