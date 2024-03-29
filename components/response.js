import Image from "next/image";
import { BiCopy, BiCheck } from "react-icons/bi";
import { useRef, useState } from 'react';

export default ({ ans }) => {
    const textRef = useRef(null);
    const [hasCopied, setHasCopied] = useState(false);

    const copy = () => {
        if (textRef.current) {
            navigator.clipboard.writeText(textRef.current.textContent).then(() => {
                setHasCopied(true);
                setTimeout(() => setHasCopied(false), 3000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    };
    const ansArray = typeof ans === 'string' ? ans.split('\n') : [];
    return (
        <div className="flex items-center justify-between rounded-full w-full">
            <div className="flex-none bg-indigo-100 rounded-full p-2" style={{ width: '60px', height: '60px' }}>
                <Image src="/image/chatbot.png" width={50} height={50} alt="profile" />
            </div>

            <div className="px-4 flex-grow" ref={textRef}>
                {ansArray.map((line, index) => (
                    <div key={index} className="text-q">{line}</div>
                ))}
            </div>

            <div className="flex-none p-2">
                <button onClick={copy} className="focus:outline-none">
                    {hasCopied ? <BiCheck size="1.5em" /> : <BiCopy size="1.5em" />}
                </button>
            </div>
        </div>
    );
}
