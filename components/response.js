import Image from "next/image"

export default () => {
    return (
        <div className="grid grid-cols-12 py-4">
            
            <div className="icon col-span-1 bg-indigo-100 mr-auto rounded-full p-2">
               <Image src="/image/chatbot.png" width={50} height={50} alt="profile" ></Image>
            </div>

            <div className="answer col-span-11 px-4 flex flex-col justify-center ">
               <span className="text-q py-4"> what is 115161
               what is 115161what is 115161what is 115161what is 115161what is 115161what is 115161what is 115161what is 115161what is 115161

               BiNavigation
                </span>
            </div>
            
            
        </div>
    )
}