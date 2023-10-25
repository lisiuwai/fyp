import { BiPlus, BiComment, BiTrash } from "react-icons/bi";

export default () => {
    return (
        <aside className="fixed left-0 w-80 h-screen bg-gray-900">
            <div className="text-gray-50 flex flex-col items-center py-3 gap-5">

                <button className="border rounded-md border-gray-600 w-4/5 hover:bg-blue-600">
                    <span className="block py-3">
                        <BiPlus className="inline" size={19} /> New Chat</span>
                </button>

                
                <div className="chat_list w-full flex flex-col gap-4 px-3">
                    <div className="w-full border-0 rounded-md bg-gray-800 py-1 px-3 flex justify-center items-center">
                        <button className="text-left truncate w-full "> 
                            <span className="block py-3 text-gray-50">
                                <BiComment className="inline mx-2" size={19}></BiComment>
                                Room 1
                            </span>
                        </button>
                        <button className="bg-gradient-to-l form-gray-800 py-4 px-3 hover:text-red-600">
                            <BiTrash />
                        </button>
                    </div>
                </div>
                <div className="chat_list w-full flex flex-col gap-4 px-3">
                    <div className="w-full border-0 rounded-md bg-gray-800 py-1 px-3 flex justify-center items-center">
                        <button className="text-left truncate w-full "> 
                            <span className="block py-3 text-gray-50">
                                <BiComment className="inline mx-2" size={19}></BiComment>
                                Room 1
                            </span>
                        </button>
                        <button className="bg-gradient-to-l form-gray-800 py-4 px-3 hover:text-red-600">
                            <BiTrash />
                        </button>
                    </div>
                </div>


            </div>

        </aside>
    )
}