import Image from "next/image"

export default ({q}) => {
    return (
        

        <div className="flex items-center bg-gray-600 rounded-full w-full">
        <div className="flex-none bg-indigo-300 rounded-full p-2" style={{ width: '60px', height: '60px' }}>
            <Image src="/image/user.png" layout='responsive' width={50} height={50} objectFit="contain" alt="profile" />
        </div>
      
        <div className="flex-grow px-4 flex items-center">
            <span className="text-q break-words">
                {q}
                </span>
            </div>


        </div>
       
    )
}