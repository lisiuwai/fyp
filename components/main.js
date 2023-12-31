import Question from "./question"
import Response from "./response"
import { useQuery } from "react-query";
import { getMessages } from "@/lib/request";
import Loading from "./loading";
import NoHistory from './nohistory'


export default ({roomid, darkTheme}) => {
    const {isLoading, isError, data : messages, error} = useQuery(['messages', roomid], () => getMessages(roomid));
    if(isLoading) return <Loading></Loading>
    if(isError) return <div className="text-center">Error: {error.message}</div>
    if(messages.length === 0) return <NoHistory darkTheme={darkTheme} />;

    return (
        <main className="container mx-auto w-4/5 py-5">
            {
                 messages && messages.map((message, index) => {
                    return(
                        <div key={index}>
                        <Question q={message.question}>
                        </Question>
                      
                        <Response ans={message.answer}>           
                        </Response>
                        </div>
                    )
                    })
                }
        </main>
    )
}