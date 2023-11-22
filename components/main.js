import Question from "./question"
import Response from "./response"
import { useQuery } from "react-query";
import { getMessages } from "@/lib/request";
import Loading from "./loading";


export default ({ roomid }) => {

    const { isLoading, isError, data: messages, error } = useQuery(['messages', roomid], () => getMessages(roomid));
    if (isLoading) return <Loading></Loading>
    if (isError) return <div className='text-center'>Error: {error.message} </div>
    if (messages.length === 0) return <div>Not found</div>
    return (
        <main className="container mx-auto w-4/5 py-5">
          {messages.map((message, index) => (
            <div key={index}>
              <Question q={message.question} />
              <Response ans={message.answer} />
            </div>
          ))}
        </main>
      );
    };