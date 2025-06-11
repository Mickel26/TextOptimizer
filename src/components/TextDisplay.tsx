interface TextDisplayProps {
    text: string;
}

const TextDisplay = ({ text }: TextDisplayProps) => {
    

    return (
        <div className="mt-8 w-1/2 p-4 bg-white rounded-lg shadow text-gray-800 whitespace-pre-wrap">
            {text}
        </div>
    )
}

export default TextDisplay