interface TextDisplayProps {
    sentences: { text: string; similarity: number }[];
    separators: string[];
}

const TextDisplay = ({ sentences, separators }: TextDisplayProps) => {
    return (
        <div className="mt-8 w-1/2 p-4 bg-white rounded-lg shadow text-gray-800 whitespace-pre-wrap">
            {sentences.map((sentence, index) => {
                const textColor =
                    sentence.similarity > 0.8
                    ? "text-red-500"
                    : sentence.similarity > 0.5
                    ? "text-yellow-500"
                    : "text-green-500";
                return (
                    <span key={index} className={textColor}>
                        {sentence.text}
                        <span className="ml-2 text-xs text-gray-500">
                            (Similarity: {sentence.similarity.toFixed(2)})
                        </span>
                        {/* Use the original separator */}
                        {separators && separators[index] ? separators[index] : ""}
                    </span>
                );
            })}
        </div>
    )
}

export default TextDisplay