import Image from "next/image"

export default function Question({ q, darkTheme }) {
    const bgColor = darkTheme ? "bg-gray-200" : "black"; 
    const textColor = darkTheme ? "text-white" : "text-dark"; 
    return (
        <div className={`flex items-center ${bgColor} rounded-full w-full`}>
            <div className="flex-none bg-indigo-300 rounded-full p-2" style={{ width: '60px', height: '60px' }}>
                <Image src="/image/user.png" layout='responsive' width={50} height={50} objectFit="contain" alt="profile" />
            </div>
        
            <div className={`flex-grow px-4 flex items-center ${textColor}`}>
                <span className="text-q break-words">
                    {q}
                </span>
            </div>
        </div>
    )
}
