import { useState } from "react";
import { BiNavigation } from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";
import { sendMessage } from "@/lib/request";

export default ({roomid}) => {
    const [input, setInput] = useState('')
    const queryclient = useQueryClient();
    const mutation = new useMutation((args)=>{
            return sendMessage(args)
    },{
        onSuccess : () =>{
queryclient.invalidateQueries('messages')
        }
    
    })

    function onSubmit(e) {
        e.preventDefault();
        mutation.mutate({roomid,message: input})
        setInput('')
    }
    if(mutation.isLoading) return <div className="text-center text-gray-50">Loading....</div>
    if(mutation.isError) return <div className="text-center text-gray-50">Error : {mutation.error.message}</div>

    return (
        <div className="fixed bottom-0 left-0 w-full z-0 h-40 text-gray-50 bg-gradient-to-t from-gray-900">
            <div className="grid grid-cols-6 absolute bottom-10 w-full">
                <div className="col-start-2 col-span-6 flex justify-center items-center w-full">
                    <div className="w-4/5 px-5 bg-gray-800 border-gray-700 rounded-lg flex items-center">
                        <form className="flex w-full shadow-2xl" onSubmit={onSubmit}>

                            <input type="text" className="w-full py-3 bg-transparent focus:outline-none text-lg"
                                autoFocus="autofocus"
                                placeholder="type in here" value={input} onChange={(e) => setInput(e.target.value)} />
                            <button type="submit">
                                <BiNavigation className="text-2xl ">

                                </BiNavigation>
                            </button>
                        </form>

                    </div>
                </div>
            </div>


        </div>
    )
}